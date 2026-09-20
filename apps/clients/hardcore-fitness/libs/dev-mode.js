// -----------------------------------------------------------------------------
// Modo "sin login", SOLO para ver la app en local.
//
// Con NEXT_PUBLIC_DEV_NO_LOGIN=true en .env.local:
//   * el middleware deja pasar a /dashboard y /admin sin sesión,
//   * getCurrentUser() devuelve una sesión ficticia de coach,
//   * el área privada se rellena con el plan de ejemplo y el libro local
//     cuando la base de datos no deja leer nada (RLS sin sesión).
//
// Nunca se activa con NODE_ENV=production, aunque la variable esté puesta:
// en un despliegue real el login sigue siendo obligatorio.
// Guardar (registrar sesiones, editar planes…) NO funciona en este modo:
// las acciones del servidor siguen exigiendo una sesión real.
// -----------------------------------------------------------------------------
export const DEV_NO_LOGIN =
  process.env.NODE_ENV !== "production" &&
  process.env.NEXT_PUBLIC_DEV_NO_LOGIN === "true";
