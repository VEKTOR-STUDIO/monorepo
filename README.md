# Alessandrovaru Monorepo Engine

Development monorepo for Alessandrovaru projects. Built on Next.js + Tailwind + DaisyUI, managed with **pnpm workspaces** + **Turborepo**.

## Structure

```
alessandrovaru-monorepo/
├── apps/
│   ├── vanilla-template/            ← Shipfast base. Clone this for new client projects.
│   ├── vanilla-template-supabase/   ← Variant with Supabase auth.
│   └── clients/                     ← Live client projects (one folder per client).
├── packages/
│   ├── ui/                          ← Shared React components (@alessandrovaru/ui).
│   ├── tailwind-config/             ← Shared Tailwind preset (@alessandrovaru/tailwind-config).
│   ├── eslint-config/               ← Shared lint rules (@alessandrovaru/eslint-config).
│   ├── tsconfig/                    ← Shared jsconfig/tsconfig base (@alessandrovaru/tsconfig).
│   └── lib/                         ← Shared helpers (@alessandrovaru/lib).
├── pnpm-workspace.yaml
├── turbo.json
└── package.json
```

## Repository Policy

These rules apply to every developer (human or AI) contributing to this monorepo.

### 1. Zero Duplication (DRY)

Before creating a new component inside a client folder, **verify if it already exists in `@alessandrovaru/shared-components`** (i.e. `packages/ui` and the other shared packages). If a generic version exists, consume it; if it does not, build it inside the shared package first, then import it from the client. Duplicating a component across clients is forbidden.

### 2. Mandatory Structure

Every new project must start by cloning the structure of `apps/vanilla-template-supabase/` (which uses Shipfast) and live inside `apps/clients/`. Do not place client projects anywhere else. Do not introduce a new layout for a new client.

### 3. Styling

Each client manages its own theme by **extending the base configuration from `@alessandrovaru/tailwind-config`**. Shared components in `@alessandrovaru/ui` never use hardcoded colors — they use DaisyUI semantic tokens (`bg-primary`, `text-base-content`, `btn-primary`, etc.) so the same component picks up each client's brand palette automatically.

## Frequent Commands

```bash
# Install every workspace dependency (run from the repo root):
pnpm install

# Run a specific client in dev mode:
pnpm run dev --filter <client-name>
# Example:
pnpm run dev --filter @alessandrovaru/taller-bmw

# Build a specific client:
pnpm run build --filter <client-name>

# Run every app in dev mode:
pnpm dev

# Lint everything:
pnpm lint
```

## Adding a new client

1. Clone the template into the clients folder:
   ```bash
   cp -r apps/vanilla-template apps/clients/<client-name>
   ```
2. In `apps/clients/<client-name>/package.json`, rename `"name"` to `@alessandrovaru/<client-name>`.
3. Replace the DaisyUI themes in the client's `globals.css` (or `tailwind.config.js`) with the brand's palette — keep `@alessandrovaru/tailwind-config` as the preset.
4. Run `pnpm install` from the root, then `pnpm run dev --filter @alessandrovaru/<client-name>`.
