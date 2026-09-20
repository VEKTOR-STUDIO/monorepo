import { cache } from "react";
import { createClient } from "@/libs/supabase/server";
import { DEV_NO_LOGIN } from "@/libs/dev-mode";
import { getDemoProgram } from "@/libs/lms";
import catalog from "@/libs/exercise-catalog.json";

// -----------------------------------------------------------------------------
// Capa de datos del sistema de entrenamiento (lado servidor).
//
// Todo pasa por RLS: un alumno solo puede leer lo suyo y los planes que el
// entrenador le asignó. No hace falta filtrar por usuario "a mano" salvo donde
// se indique.
// -----------------------------------------------------------------------------

// Se re-exportan para que el servidor pueda importarlo todo desde aquí.
export { LEVELS, CATEGORY_LABELS, TYPE_FIELDS, levelProgress } from "@/libs/training-constants";

// -----------------------------------------------------------------------------
// Modo local sin login (libs/dev-mode.js): sesión ficticia de coach y datos
// de ejemplo donde la base, sin sesión, no deja leer nada.
// -----------------------------------------------------------------------------
const LOCAL_USER_ID = "00000000-0000-4000-8000-000000000001";

const LOCAL_SESSION = {
  user: {
    id: LOCAL_USER_ID,
    email: "coach@local.dev",
    user_metadata: { full_name: "Coach (modo local)" },
  },
  profile: {
    id: LOCAL_USER_ID,
    email: "coach@local.dev",
    full_name: "Coach (modo local)",
    image: null,
    role: "admin",
    phone: null,
    goal: "Ver la app en local sin iniciar sesión.",
    level: "avanzado",
    show_in_ranking: false,
    is_active: true,
    weight_kg: 80,
    height_cm: 180,
    weight_class: "155 lb (70,3 kg)",
    discipline: "Striker",
    fight_record: "5-0 Pro",
    fight_strategy:
      "Control del centro del octágono: presión, velocidad de entrada, potencia corta y capacidad de repetir esfuerzos.",
  },
  isAdmin: true,
  isLocalSession: true,
};

// El libro entero, desde el JSON del paquete: mismo formato que la tabla.
const LOCAL_BOOK = catalog.map((exercise) => ({
  id: exercise.slug,
  slug: exercise.slug,
  name: exercise.name,
  name_en: exercise.name_en,
  description: null,
  cues: null,
  equipment: exercise.equipment,
  primary_muscle: exercise.primary_muscle,
  secondary_muscles: exercise.secondary_muscles || [],
  exercise_type: exercise.exercise_type,
  category: exercise.category,
  level: "todos",
  animation_slug: exercise.slug,
  video_url: null,
  default_sets: 3,
  default_reps: "10-12",
}));

function localDemoAssignment() {
  const program = getDemoProgram();
  if (!program) return [];
  return [
    {
      id: "demo-assignment",
      starts_on: new Date().toISOString().slice(0, 10),
      ends_on: null,
      status: "activo",
      notes: "Modo local sin login: este es el plan de ejemplo. Lo que registres aquí no se guarda.",
      programs: {
        ...program,
        workouts: program.workouts.map((workout) => ({ ...workout, is_published: true })),
      },
    },
  ];
}

function localDemoWorkout(workoutId) {
  const program = getDemoProgram();
  const workout = program?.workouts.find((item) => item.id === workoutId);
  if (!workout) return null;
  return {
    ...workout,
    program_id: program.id,
    programs: { id: program.id, slug: program.slug, title: program.title },
    exercises: (workout.exercises || []).map((exercise) => ({
      ...exercise,
      exercise_type: exercise.exercise_type || "weight_reps",
      cues: null,
      equipment: null,
      primary_muscle: null,
      library_id: null,
    })),
  };
}

// -----------------------------------------------------------------------------
// Sesión del usuario
// -----------------------------------------------------------------------------
export const getCurrentUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    if (DEV_NO_LOGIN) return LOCAL_SESSION;
    return { user: null, profile: null, isAdmin: false };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select(
      "id, email, full_name, image, role, phone, goal, level, show_in_ranking, is_active, weight_kg, height_cm, weight_class, discipline, fight_record, fight_strategy"
    )
    .eq("id", user.id)
    .single();

  return {
    user,
    profile: profile || null,
    isAdmin: profile?.role === "admin",
  };
});

export function displayNameOf(user, profile) {
  return (
    profile?.full_name ||
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    (user?.email ? user.email.split("@")[0] : "Atleta")
  );
}

// -----------------------------------------------------------------------------
// Panel del alumno
// -----------------------------------------------------------------------------
export async function getAthleteStats(athleteId) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("athlete_stats")
    .select(
      "xp, level, current_streak, longest_streak, last_workout_on, total_workouts, total_minutes"
    )
    .eq("athlete_id", athleteId)
    .maybeSingle();

  return (
    data || {
      xp: 0,
      level: 1,
      current_streak: 0,
      longest_streak: 0,
      last_workout_on: null,
      total_workouts: 0,
      total_minutes: 0,
    }
  );
}

export async function getMyAssignments(athleteId) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("program_assignments")
    .select(
      `id, starts_on, ends_on, status, notes,
       programs (
         id, slug, title, subtitle, description, level, category,
         duration_weeks, cover_image_url,
         workouts ( id, title, description, week_number, day_number, focus,
                    duration_minutes, sort_order, is_published )
       )`
    )
    .eq("athlete_id", athleteId)
    .in("status", ["activo", "pausado"])
    .order("created_at", { ascending: false });

  if (DEV_NO_LOGIN && (error || !data || data.length === 0)) return localDemoAssignment();
  if (error || !data) return [];

  return data
    .filter((assignment) => assignment.programs)
    .map((assignment) => ({
      ...assignment,
      programs: {
        ...assignment.programs,
        workouts: (assignment.programs.workouts || [])
          .filter((workout) => workout.is_published)
          .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0)),
      },
    }));
}

// Sesiones ya registradas, para pintar el "hecho" en la lista del plan.
export async function getCompletedWorkoutIds(athleteId) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("workout_logs")
    .select("workout_id, performed_on")
    .eq("athlete_id", athleteId)
    .not("workout_id", "is", null);

  const map = new Map();
  (data || []).forEach((log) => {
    const previous = map.get(log.workout_id);
    if (!previous || log.performed_on > previous) {
      map.set(log.workout_id, log.performed_on);
    }
  });
  return map;
}

export async function getWorkoutDetail(workoutId) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("workouts")
    .select(
      `id, title, description, week_number, day_number, focus, duration_minutes, program_id,
       programs ( id, slug, title ),
       exercises ( id, name, description, sets, reps, rest_seconds, tempo, video_url,
                   animation_slug, target_weight_kg, rpe_target, superset_group, sort_order,
                   block_name, intensity, per_side, library_id,
                   exercise_library ( slug, name, animation_slug, exercise_type, cues,
                                      equipment, primary_muscle ) )`
    )
    .eq("id", workoutId)
    .maybeSingle();

  if (error || !data) return DEV_NO_LOGIN ? localDemoWorkout(workoutId) : null;

  const exercises = (data.exercises || [])
    .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
    .map((exercise) => ({
      ...exercise,
      // El slug del ejercicio manda; si no lo tiene, se usa el del libro.
      animation_slug:
        exercise.animation_slug || exercise.exercise_library?.animation_slug || null,
      exercise_type: exercise.exercise_library?.exercise_type || "weight_reps",
      cues: exercise.exercise_library?.cues || null,
      equipment: exercise.exercise_library?.equipment || null,
      primary_muscle: exercise.exercise_library?.primary_muscle || null,
    }));

  return { ...data, exercises };
}

export async function getRecentLogs(athleteId, limit = 8) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("workout_logs")
    .select(
      "id, performed_on, duration_minutes, perceived_effort, notes, status, xp_awarded, workouts ( title )"
    )
    .eq("athlete_id", athleteId)
    .order("performed_on", { ascending: false })
    .limit(limit);

  return data || [];
}

// -----------------------------------------------------------------------------
// Gamificación
// -----------------------------------------------------------------------------
export async function getAchievements(athleteId) {
  const supabase = await createClient();

  const [{ data: catalog }, { data: unlocked }] = await Promise.all([
    supabase
      .from("achievements")
      .select("id, code, name, description, icon, xp_reward, threshold_type, threshold_value")
      .order("sort_order"),
    supabase
      .from("athlete_achievements")
      .select("achievement_id, unlocked_at")
      .eq("athlete_id", athleteId),
  ]);

  const unlockedMap = new Map(
    (unlocked || []).map((row) => [row.achievement_id, row.unlocked_at])
  );

  return (catalog || []).map((achievement) => ({
    ...achievement,
    unlocked_at: unlockedMap.get(achievement.id) || null,
  }));
}

export async function getLeaderboard(period = "total", limit = 20) {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_leaderboard", {
    p_limit: limit,
    p_period: period,
  });
  if (error) return [];
  return data || [];
}

export async function getMyRank(period = "total") {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_my_rank", { p_period: period });
  if (error || !data?.length) return null;
  return data[0];
}

// -----------------------------------------------------------------------------
// Libro de entrenamiento
// -----------------------------------------------------------------------------
export async function getExerciseBook({
  search = "",
  category = "",
  muscle = "",
  equipment = "",
  limit = 400,
} = {}) {
  const supabase = await createClient();

  let query = supabase
    .from("exercise_library")
    .select(
      "id, slug, name, name_en, description, cues, equipment, primary_muscle, secondary_muscles, exercise_type, category, level, animation_slug, video_url, default_sets, default_reps"
    )
    .eq("is_published", true)
    .order("name")
    .limit(limit);

  if (search) query = query.or(`name.ilike.%${search}%,name_en.ilike.%${search}%`);
  if (category) query = query.eq("category", category);
  if (muscle) query = query.eq("primary_muscle", muscle);
  if (equipment) query = query.eq("equipment", equipment);

  const { data, error } = await query;

  // Sin sesión la tabla no se puede leer: en modo local se usa el JSON del libro.
  if (DEV_NO_LOGIN && (error || !data || data.length === 0)) {
    const needle = search.trim().toLowerCase();
    return LOCAL_BOOK.filter(
      (exercise) =>
        (!needle ||
          exercise.name.toLowerCase().includes(needle) ||
          (exercise.name_en || "").toLowerCase().includes(needle)) &&
        (!category || exercise.category === category) &&
        (!muscle || exercise.primary_muscle === muscle) &&
        (!equipment || exercise.equipment === equipment)
    ).slice(0, limit);
  }

  if (error) return [];
  return data || [];
}

export async function getBookFilters() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("exercise_library")
    .select("primary_muscle, equipment, category")
    .eq("is_published", true);

  const rows = DEV_NO_LOGIN && !data?.length ? LOCAL_BOOK : data || [];

  const unique = (key) =>
    [...new Set(rows.map((row) => row[key]).filter(Boolean))].sort((a, b) =>
      a.localeCompare(b, "es")
    );

  return {
    muscles: unique("primary_muscle"),
    equipment: unique("equipment"),
    categories: unique("category"),
  };
}

// -----------------------------------------------------------------------------
// Administración (entrenador)
// -----------------------------------------------------------------------------
export async function getAthletes() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select(
      "id, email, full_name, image, phone, goal, level, is_active, created_at, role, weight_kg, weight_class, discipline"
    )
    .order("created_at", { ascending: false });

  const athletes = (data || []).filter((profile) => profile.role !== "admin");
  if (athletes.length === 0) return [];

  const { data: stats } = await supabase
    .from("athlete_stats")
    .select("athlete_id, xp, level, current_streak, total_workouts, last_workout_on")
    .in(
      "athlete_id",
      athletes.map((athlete) => athlete.id)
    );

  const statsMap = new Map((stats || []).map((row) => [row.athlete_id, row]));

  const { data: assignments } = await supabase
    .from("program_assignments")
    .select("athlete_id, status, programs ( title )")
    .in(
      "athlete_id",
      athletes.map((athlete) => athlete.id)
    )
    .eq("status", "activo");

  const plansMap = new Map();
  (assignments || []).forEach((assignment) => {
    const list = plansMap.get(assignment.athlete_id) || [];
    if (assignment.programs?.title) list.push(assignment.programs.title);
    plansMap.set(assignment.athlete_id, list);
  });

  return athletes.map((athlete) => ({
    ...athlete,
    stats: statsMap.get(athlete.id) || null,
    plans: plansMap.get(athlete.id) || [],
  }));
}

export async function getAthleteDetail(athleteId) {
  const supabase = await createClient();

  const [{ data: profile }, { data: stats }, { data: assignments }, { data: logs }] =
    await Promise.all([
      supabase
        .from("profiles")
        .select(
          "id, email, full_name, image, phone, birth_date, goal, level, coach_notes, is_active, created_at, weight_kg, height_cm, weight_class, discipline, fight_record, fight_strategy"
        )
        .eq("id", athleteId)
        .maybeSingle(),
      supabase
        .from("athlete_stats")
        .select("*")
        .eq("athlete_id", athleteId)
        .maybeSingle(),
      supabase
        .from("program_assignments")
        .select("id, status, starts_on, ends_on, notes, programs ( id, title, slug )")
        .eq("athlete_id", athleteId)
        .order("created_at", { ascending: false }),
      supabase
        .from("workout_logs")
        .select(
          "id, performed_on, duration_minutes, perceived_effort, notes, status, xp_awarded, workouts ( title )"
        )
        .eq("athlete_id", athleteId)
        .order("performed_on", { ascending: false })
        .limit(30),
    ]);

  if (!profile) return null;
  return {
    profile,
    stats: stats || null,
    assignments: assignments || [],
    logs: logs || [],
  };
}

export async function getAdminPrograms() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("programs")
    .select(
      "id, slug, title, subtitle, level, category, duration_weeks, is_published, is_public, sort_order, workouts ( id ), program_assignments ( id )"
    )
    .order("sort_order");

  return (data || []).map((program) => ({
    ...program,
    workouts_count: program.workouts?.length || 0,
    athletes_count: program.program_assignments?.length || 0,
  }));
}

export async function getAdminProgram(programId) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("programs")
    .select(
      `id, slug, title, subtitle, description, level, category, duration_weeks,
       sessions_count, is_published, is_public, sort_order,
       workouts ( id, title, description, week_number, day_number, focus,
                  duration_minutes, sort_order, is_published,
                  exercises ( id, name, description, sets, reps, rest_seconds, tempo,
                              video_url, animation_slug, target_weight_kg, rpe_target,
                              superset_group, block_name, intensity, per_side,
                              sort_order, library_id ) )`
    )
    .eq("id", programId)
    .maybeSingle();

  if (!data) return null;

  const workouts = (data.workouts || [])
    .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
    .map((workout) => ({
      ...workout,
      exercises: (workout.exercises || []).sort(
        (a, b) => (a.sort_order || 0) - (b.sort_order || 0)
      ),
    }));

  return { ...data, workouts };
}

/** Resumen de la semana para el panel del entrenador. */
export async function getCoachOverview() {
  const supabase = await createClient();
  const weekAgo = new Date(Date.now() - 7 * 86_400_000).toISOString().slice(0, 10);

  const [
    { count: athleteCount },
    { count: programCount },
    { count: activeAssignments },
    { data: weekLogs },
    { data: recent },
    { count: pendingLeads },
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .neq("role", "admin"),
    supabase.from("programs").select("id", { count: "exact", head: true }),
    supabase
      .from("program_assignments")
      .select("id", { count: "exact", head: true })
      .eq("status", "activo"),
    supabase
      .from("workout_logs")
      .select("id, duration_minutes")
      .gte("performed_on", weekAgo),
    supabase
      .from("workout_logs")
      .select(
        "id, performed_on, duration_minutes, perceived_effort, notes, xp_awarded, athlete_id, workouts ( title ), profiles ( full_name, email )"
      )
      .order("created_at", { ascending: false })
      .limit(12),
    supabase
      .from("elite_leads")
      .select("id", { count: "exact", head: true })
      .eq("status", "nuevo"),
  ]);

  return {
    athleteCount: athleteCount || 0,
    programCount: programCount || 0,
    activeAssignments: activeAssignments || 0,
    weekSessions: (weekLogs || []).length,
    weekMinutes: (weekLogs || []).reduce(
      (total, log) => total + (log.duration_minutes || 0),
      0
    ),
    pendingLeads: pendingLeads || 0,
    recent: recent || [],
  };
}

/** Clases con el número de plazas ya reservadas. */
export async function getClasses() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("classes")
    .select(
      "id, title, description, starts_at, duration_minutes, capacity, location, level, is_published, class_bookings ( id, status )"
    )
    .order("starts_at", { ascending: true });

  return (data || []).map((item) => ({
    ...item,
    booked: (item.class_bookings || []).filter((booking) => booking.status === "reservada")
      .length,
  }));
}

/** Clases próximas publicadas, con el estado de reserva del alumno. */
export async function getUpcomingClasses(athleteId) {
  const supabase = await createClient();

  const [{ data: classes }, { data: bookings }] = await Promise.all([
    supabase
      .from("classes")
      .select(
        "id, title, description, starts_at, duration_minutes, capacity, location, level, class_bookings ( id, status )"
      )
      .eq("is_published", true)
      .gte("starts_at", new Date().toISOString())
      .order("starts_at", { ascending: true }),
    supabase
      .from("class_bookings")
      .select("class_id, status")
      .eq("athlete_id", athleteId),
  ]);

  const mine = new Map((bookings || []).map((row) => [row.class_id, row.status]));

  return (classes || []).map((item) => {
    const booked = (item.class_bookings || []).filter(
      (booking) => booking.status === "reservada"
    ).length;
    return {
      ...item,
      booked,
      free: Math.max(item.capacity - booked, 0),
      myStatus: mine.get(item.id) || null,
    };
  });
}

/** Cita presencial pendiente o confirmada del alumno, si tiene alguna. */
export async function getActiveAppointment(athleteId) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("appointments")
    .select("*, services ( id, name, duration_minutes )")
    .eq("user_id", athleteId)
    .in("status", ["pending", "confirmed"])
    .order("appointment_date", { ascending: true })
    .limit(1);

  return data?.[0] || null;
}
