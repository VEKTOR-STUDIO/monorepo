import { createClient } from "@/libs/supabase/server";

export { getVideoEmbed, formatDuration, LEVEL_LABELS } from "@/libs/lms-utils";

// -----------------------------------------------------------------------------
// Capa de datos del LMS de entrenamiento.
//
// Lee de Supabase (tablas: programs, workouts, exercises, videos). Si Supabase
// no está configurado, la tabla no existe todavía, o no hay datos publicados,
// devuelve contenido DEMO para que la página funcione igual durante la prueba.
// -----------------------------------------------------------------------------

const DEMO_PROGRAMS = [
  {
    id: "demo-camp-striker",
    slug: "camp-8-semanas-striker",
    title: "Camp 8 semanas · Striker",
    subtitle: "Potencia de piernas, velocidad de golpeo y capacidad anaeróbica repetida",
    description:
      "Bloque de ejemplo del sistema para un striker que quiere controlar el centro del octágono. Semanas 1-4: base de potencia, velocidad rotacional y pico neural. Semanas 5-6: fase específica. Semanas 7-8: sistema híbrido de rounds. 3 sesiones por semana de 55 a 65 minutos.",
    level: "avanzado",
    category: "combate",
    cover_image_url: null,
    duration_weeks: 8,
    sessions_count: 24,
    sort_order: 1,
  },
];

const DEMO_WORKOUTS = {
  "camp-8-semanas-striker": [
    {
      id: "demo-w1",
      title: "Semana 1 · Día 1 — Base de potencia",
      description:
        "Objetivo: reactividad, fuerza rápida y base anaeróbica. Cada repetición explosiva; si baja la velocidad, se termina la serie.",
      week_number: 1,
      day_number: 1,
      focus: "Base de potencia",
      duration_minutes: 60,
      sort_order: 11,
      exercises: [
        {
          id: "demo-e1",
          name: "Assault bike o cuerda",
          block_name: "Warm up",
          animation_slug: "assault-bike",
          description: "Ritmo suave, solo para subir pulsaciones.",
          sets: 1,
          reps: "3 min",
          rest_seconds: 0,
          sort_order: 1,
        },
        {
          id: "demo-e2",
          name: "A1. Depth jump + triple tuck jump",
          block_name: "Plyometrics",
          superset_group: "A",
          description: "Contacto mínimo con el suelo y salida explosiva.",
          sets: 3,
          reps: "2",
          rest_seconds: 0,
          sort_order: 2,
        },
        {
          id: "demo-e3",
          name: "B1. Speed back box squat",
          block_name: "Contrast set",
          superset_group: "B",
          animation_slug: "squat",
          description: "Velocidad máxima en la subida. Si baja la velocidad, se termina la serie.",
          sets: 4,
          reps: "3",
          intensity: "75 % 1RM",
          rest_seconds: 0,
          sort_order: 3,
        },
        {
          id: "demo-e4",
          name: "C1. Push press (cluster)",
          block_name: "Push + Pull",
          superset_group: "C",
          animation_slug: "push-press",
          description: "Haz 2 repeticiones, pausa 20 s dentro de la serie y sigue hasta completar 6.",
          sets: 3,
          reps: "2 + 2 + 2",
          rest_seconds: 0,
          sort_order: 4,
        },
        {
          id: "demo-e5",
          name: "C2. Ballistic chin ups",
          block_name: "Push + Pull",
          superset_group: "C",
          animation_slug: "chin-up",
          description: "Explosivo hacia arriba. Descanso 2 min al cerrar la ronda.",
          sets: 3,
          reps: "6",
          rest_seconds: 120,
          sort_order: 5,
        },
        {
          id: "demo-e6",
          name: "D2. Rotaciones explosivas con banda",
          block_name: "Midsection",
          superset_group: "D",
          animation_slug: "banded-woodchop",
          description: "Banda a la altura del pecho; remata como un golpe.",
          sets: 3,
          reps: "8",
          per_side: true,
          rest_seconds: 60,
          sort_order: 6,
        },
        {
          id: "demo-e7",
          name: "Assault bike: base + sprints",
          block_name: "Conditioning",
          animation_slug: "assault-bike",
          description: "3 min a 130 BPM y después 7 sprints de 8 s con 2 min de descanso completo.",
          sets: 7,
          reps: "8 s sprint",
          intensity: "Máximo",
          rest_seconds: 120,
          sort_order: 7,
        },
        {
          id: "demo-e8",
          name: "Respiración diafragmática 4·6·4·6",
          block_name: "Breathing",
          description: "Inhala 4, mantén 6, exhala 4, mantén 6. Manos en las costillas.",
          sets: 1,
          reps: "3-5 min",
          rest_seconds: 0,
          sort_order: 8,
        },
      ],
    },
    {
      id: "demo-w2",
      title: "Semana 5 · Día 1 — Específico",
      description: "Contrast set con golpeo y sprints cortos con descanso incompleto.",
      week_number: 5,
      day_number: 1,
      focus: "Específico",
      duration_minutes: 60,
      sort_order: 51,
      exercises: [],
    },
    {
      id: "demo-w3",
      title: "Semana 7 · Día 1 — Sistema híbrido",
      description: "Simula fatiga extrema: 5 rounds de 5 minutos alternando sprint y drill de combate.",
      week_number: 7,
      day_number: 1,
      focus: "Sistema híbrido",
      duration_minutes: 55,
      sort_order: 71,
      exercises: [],
    },
  ],
};

const DEMO_VIDEOS = [
  {
    id: "demo-v1",
    title: "Cómo respirar durante el esfuerzo",
    description: "Bracing y respiración para levantar con seguridad y recuperar entre rounds.",
    category: "respiración",
    level: "todos",
    video_url: "https://www.youtube.com/watch?v=2pLT-olgUJs",
    thumbnail_url: null,
    duration_seconds: 480,
    is_free_preview: true,
    sort_order: 1,
  },
  {
    id: "demo-v2",
    title: "Calentamiento articular de 8 min",
    description: "Serie dinámica de cadera, columna torácica y hombros para empezar cualquier sesión.",
    category: "movilidad",
    level: "todos",
    video_url: "https://www.youtube.com/watch?v=3sTf3JCTGKw",
    thumbnail_url: null,
    duration_seconds: 510,
    is_free_preview: true,
    sort_order: 2,
  },
];

// -----------------------------------------------------------------------------
// Reads
// -----------------------------------------------------------------------------

export async function getPrograms() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("programs")
      .select(
        "id, slug, title, subtitle, description, level, category, cover_image_url, duration_weeks, sessions_count, sort_order"
      )
      .eq("is_published", true)
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) return DEMO_PROGRAMS;
    return data;
  } catch {
    return DEMO_PROGRAMS;
  }
}

export async function getProgramBySlug(slug) {
  try {
    const supabase = await createClient();
    const { data: program, error } = await supabase
      .from("programs")
      .select(
        "id, slug, title, subtitle, description, level, category, cover_image_url, duration_weeks, sessions_count"
      )
      .eq("slug", slug)
      .eq("is_published", true)
      .single();

    if (error || !program) return getDemoProgram(slug);

    const { data: workouts } = await supabase
      .from("workouts")
      .select(
        "id, title, description, week_number, day_number, focus, duration_minutes, sort_order, exercises(id, name, description, sets, reps, rest_seconds, tempo, video_url, animation_slug, block_name, intensity, per_side, superset_group, sort_order)"
      )
      .eq("program_id", program.id)
      .eq("is_published", true)
      .order("sort_order", { ascending: true });

    const normalized = (workouts || []).map((w) => ({
      ...w,
      exercises: (w.exercises || []).sort(
        (a, b) => (a.sort_order || 0) - (b.sort_order || 0)
      ),
    }));

    return { ...program, workouts: normalized };
  } catch {
    return getDemoProgram(slug);
  }
}

export async function getVideos() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("videos")
      .select(
        "id, title, description, category, level, video_url, thumbnail_url, duration_seconds, is_free_preview, sort_order"
      )
      .eq("is_published", true)
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) return DEMO_VIDEOS;
    return data;
  } catch {
    return DEMO_VIDEOS;
  }
}

/** Plan de ejemplo con sus sesiones. También lo usa el modo local sin login. */
export function getDemoProgram(slug = DEMO_PROGRAMS[0].slug) {
  const program = DEMO_PROGRAMS.find((p) => p.slug === slug);
  if (!program) return null;
  return { ...program, workouts: DEMO_WORKOUTS[slug] || [] };
}
