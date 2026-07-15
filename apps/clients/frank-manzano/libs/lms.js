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
    id: "demo-funcional-base",
    slug: "funcional-base-8-semanas",
    title: "Funcional Base · 8 semanas",
    subtitle: "Construye una base sólida de fuerza y movimiento",
    description:
      "Programa de entrada al entrenamiento funcional. Patrones básicos (sentadilla, bisagra, empuje, tracción, core) con progresión semanal y video en cada sesión.",
    level: "principiante",
    category: "fuerza",
    cover_image_url: null,
    duration_weeks: 8,
    sessions_count: 24,
    sort_order: 1,
  },
  {
    id: "demo-hiit",
    slug: "acondicionamiento-hiit",
    title: "Acondicionamiento & HIIT",
    subtitle: "Capacidad aeróbica y potencia metabólica",
    description:
      "Circuitos de alta intensidad e intervalos para mejorar tu condición física, quemar grasa y ganar resistencia.",
    level: "intermedio",
    category: "hiit",
    cover_image_url: null,
    duration_weeks: 6,
    sessions_count: 18,
    sort_order: 2,
  },
  {
    id: "demo-movilidad",
    slug: "movilidad-y-prevencion",
    title: "Movilidad & Prevención",
    subtitle: "Muévete mejor, entrena sin dolor",
    description:
      "Rutinas de movilidad articular, activación y trabajo correctivo para sostener cargas altas y prevenir lesiones.",
    level: "todos",
    category: "movilidad",
    cover_image_url: null,
    duration_weeks: 4,
    sessions_count: 12,
    sort_order: 3,
  },
];

const DEMO_WORKOUTS = {
  "funcional-base-8-semanas": [
    {
      id: "demo-w1",
      title: "Semana 1 · Día 1 — Full Body",
      description: "Introducción a los patrones básicos con carga ligera.",
      week_number: 1,
      day_number: 1,
      focus: "full body",
      duration_minutes: 45,
      sort_order: 1,
      exercises: [
        {
          id: "demo-e1",
          name: "Sentadilla goblet",
          description: "Pecho arriba, rodillas siguen la punta del pie, baja controlado.",
          sets: 3,
          reps: "10-12",
          rest_seconds: 90,
          video_url: "https://www.youtube.com/watch?v=MeIiIdhvXT4",
          sort_order: 1,
        },
        {
          id: "demo-e2",
          name: "Flexiones",
          description: "Cuerpo en línea, codos a ~45°.",
          sets: 3,
          reps: "8-12",
          rest_seconds: 90,
          video_url: "https://www.youtube.com/watch?v=IODxDxX7oi4",
          sort_order: 2,
        },
        {
          id: "demo-e3",
          name: "Remo con banda",
          description: "Escápulas atrás y abajo, sin balanceo.",
          sets: 3,
          reps: "12-15",
          rest_seconds: 60,
          video_url: "https://www.youtube.com/watch?v=xQNrFHEMhI4",
          sort_order: 3,
        },
        {
          id: "demo-e4",
          name: "Plancha",
          description: "Glúteos y abdomen activos, cadera neutra.",
          sets: 3,
          reps: "30-45 s",
          rest_seconds: 60,
          video_url: "https://www.youtube.com/watch?v=ASdvN_XEl_c",
          sort_order: 4,
        },
      ],
    },
    {
      id: "demo-w2",
      title: "Semana 1 · Día 2 — Tren inferior",
      description: "Sentadilla y bisagra de cadera, foco en técnica.",
      week_number: 1,
      day_number: 2,
      focus: "tren inferior",
      duration_minutes: 50,
      sort_order: 2,
      exercises: [],
    },
    {
      id: "demo-w3",
      title: "Semana 1 · Día 3 — Tren superior + core",
      description: "Empuje, tracción y estabilidad de core.",
      week_number: 1,
      day_number: 3,
      focus: "tren superior",
      duration_minutes: 50,
      sort_order: 3,
      exercises: [],
    },
  ],
};

const DEMO_VIDEOS = [
  {
    id: "demo-v1",
    title: "Cómo respirar durante el esfuerzo",
    description: "Bracing y respiración para levantar con seguridad.",
    category: "técnica",
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
    description: "Rutina de movilidad para empezar cualquier sesión.",
    category: "movilidad",
    level: "todos",
    video_url: "https://www.youtube.com/watch?v=3sTf3JCTGKw",
    thumbnail_url: null,
    duration_seconds: 510,
    is_free_preview: true,
    sort_order: 2,
  },
  {
    id: "demo-v3",
    title: "Técnica de sentadilla",
    description: "Errores comunes y cómo corregirlos.",
    category: "técnica",
    level: "principiante",
    video_url: "https://www.youtube.com/watch?v=MeIiIdhvXT4",
    thumbnail_url: null,
    duration_seconds: 600,
    is_free_preview: false,
    sort_order: 3,
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
        "id, title, description, week_number, day_number, focus, duration_minutes, sort_order, exercises(id, name, description, sets, reps, rest_seconds, tempo, video_url, sort_order)"
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

function getDemoProgram(slug) {
  const program = DEMO_PROGRAMS.find((p) => p.slug === slug);
  if (!program) return null;
  return { ...program, workouts: DEMO_WORKOUTS[slug] || [] };
}
