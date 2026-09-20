# Camargo Coach — High Performance System for Combat Sports

Plataforma de entrenamiento online para atletas de combate. El coach arma
planes por bloques (warm up, plyometrics, contrast set, push + pull, midsection,
conditioning, breathing), se los asigna a sus peleadores y ellos registran cada
sesión desde el móvil.

Lema: *"La ciencia detrás del rendimiento"*.

- Cómo funciona el sistema de entrenamiento: `docs/SISTEMA_ENTRENAMIENTO.md`
- Base de datos (SQL para pegar en Supabase): `supabase/README.md`

> **Importante:** este proyecto necesita **su propio proyecto de Supabase**.
> El `.env.local` heredado apunta al de otro cliente; crea uno nuevo y cambia
> `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` antes de aplicar
> la migración.

## Ver en local

```bash
pnpm dev   # http://localhost:3000
```

Con `NEXT_PUBLIC_DEV_NO_LOGIN=true` en `.env.local` (ya está puesto) entras a
`/dashboard` y `/admin` sin iniciar sesión, con datos de ejemplo. Solo aplica en
desarrollo; guardar cambios sigue exigiendo login real.
