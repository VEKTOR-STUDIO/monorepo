# Template Brand Transformer — Examples

## Brand Architecture Plan (output template)

Start every transformation with a short plan in this shape:

```markdown
## Brand Architecture Plan

**Palette**
- Background: [e.g. #0a0a0a]
- Primary: [e.g. ocre #c9a227]
- Secondary: [e.g. warm gray]

**Vibe**
- Typography: [e.g. Serif headlines, sans body]
- Component style: [e.g. Glassmorphism, high-contrast borders]

**DB changes**
- [ ] Add table: `services` (id, name, duration, price)
- [ ] Add column: `appointments.health_notes` (text, nullable)
- [ ] No changes to `profiles`, `leads`, or auth
```

Then deliver code in order: config → globals.css → Hero/Landing → Dashboard/Forms.

---

## Schema adaptation examples

**Aesthetic / clinic**
- New table: `services` (id, name, slug, duration_min, price_cents, description).
- `appointments`: add `service_id` (FK to services), `health_notes` (text).

**Portfolio / creative**
- New table: `portfolio_items` (id, title, slug, media_url, category, order).
- Optionally adapt or add `articles` for blog/case studies.

**E‑commerce / physical products**
- `appointments` or equivalent: add `shipping_address`, `delivery_notes`.
- Optional: `products`, `order_items` if moving beyond appointments.

Always preserve: `profiles` (and link to auth.users), `leads`, and existing RLS/FKs.
