# @alessandrovaru/ui

Shared React component library for Alessandrovaru apps.

## Rules

- **No hardcoded colors.** Use DaisyUI semantic tokens (`bg-primary`, `text-base-content`, `bg-base-100`, `btn-primary`, etc.) so each app's theme drives the final look.
- **No app-specific data imports.** Components receive content via props — never `import config from "@/config"` from inside this package.
- **Tailwind JIT awareness.** Each app's `tailwind.config.js` must list `../../packages/ui/src/**/*.{js,jsx}` (or `../../../packages/ui/...` from `apps/clients/<name>`) in its `content` array so the classes used here get compiled.

## Adding a component

1. Drop it in `src/MyComponent.js`.
2. Strip hardcoded colors → DaisyUI tokens.
3. Re-export from `src/index.js`.
4. Import in any app: `import { MyComponent } from "@alessandrovaru/ui";`.
