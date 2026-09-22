# Lone Star All In Autos · subasta, reparación y exportación

Página para **Lone Star All In Autos** ([@lonestarallinautos](https://www.instagram.com/lonestarallinautos/)),
un negocio de Texas que **compra en las subastas de Estados Unidos, repara y
exporta** a Venezuela, Panamá, Colombia y toda Latinoamérica. WhatsApp:
**+1 (281) 692-8067**.

No es un concesionario con salón: por eso la web habla de **lotes en subasta**
(millas, daño primario, Run & Drive, puja estimada) y de **modelos a pedido**
(precio desde), no de 0 km ni de sedes.

Base: copia de `dealernautacars`, reidentificada entera · Next.js 15 (App
Router) · Tailwind 4 + daisyUI 5 · GSAP 3. Sin base de datos: el inventario es
un JSON.

---

## De dónde sale todo

Solo hay seis archivos suyos, en `public/marca/`:

| Archivo | Qué aportó |
|---|---|
| `lone-star.jpg` | El **emblema** (foto de perfil, 1080 px): estrella blanca y roja, "LONE STAR · ALL IN AUTOS", "Compramos · Reparamos · Exportamos", "Tu vehículo, nuestro compromiso", las banderas y el número. De ahí salen el negro, el rojo y el blanco. |
| `publicacion-tacoma.jpg` | La **Toyota Tacoma Off-Road 2026** en subasta: 2.4L turbo, 4x4, 1,186 mi, daño Rear End, Run & Drive. Sus tres fotos, recortadas y sin rótulos, están en `public/vehiculos/`. |
| `publicacion-corolla.jpg` | El **Toyota Corolla a pedido "a partir de $16,000"** y los **cinco pasos**: compra en subasta → transporte → reparación → trámites y aduanas → envío. |
| `publicacion-invertir.jpg` | "¿Quieres invertir en vehículos?" y la foto del Corolla negro en el patio. |
| `publicacion-subastas.webp` | "¿Tienes dudas cómo funcionan las subastas?" y los cinco puntos que ofrecen. |
| `publicacion-pagos.webp` | Métodos de pago: Zelle, ACH, wire, efectivo, USDT/Cash App/PayPal. Todo en USD. |

Todo el texto de la página que habla de ellos está transcrito de ahí, en
`config.js`.

## Cargar el inventario real

`data/vehiculos.json` tiene 13 unidades y solo **2 son suyas** (la Tacoma y el
Corolla). El `_nota` de arriba del JSON lo cuenta. Lo que no es suyo va marcado
y se avisa en pantalla:

| Bandera | Aviso | Quién la lleva |
|---|---|---|
| `muestra: true` | «Unidad de ejemplo» | las 11 unidades inventadas |
| `precioProvisional: true` | «Precio de referencia» | todas menos el Corolla (su $16,000 es real) |

Al cargar lo suyo se quitan las banderas y **los avisos desaparecen solos**,
también el bloque «Sobre este inventario» de la portada. Las unidades sin
`fotos` se dibujan con `components/PlantillaPublicacion.js` (la maqueta de su
pieza de la Tacoma); en cuanto la ficha trae `fotos`, sale la foto.

Lo que su publicación no dice se deja **vacío**: el año del Corolla, el color y
la transmisión de la Tacoma. No se adivina.

---

## Modo demo

Con el modo demo activo se ve casi todo, pero no se puede **usar**. El candado
está en el servidor, no en la pantalla.

| Qué corta | Dónde | Qué pasa |
|---|---|---|
| Ver cualquier página | `middleware.js` | Sin la cookie de acceso, **307 a `/entrar`**. |
| Entrar | `app/api/entrar/route.js` | Compara huellas SHA-256, espera 600 ms por fallo y deja una cookie `httpOnly`. |
| El inventario completo | `app/vehiculos/page.js` | Se ven 6 nítidas; el resto, difuminado tras `MuroDemo`. |
| Enviar el formulario | `app/api/contacto/route.js` | **403**, aunque se llame a mano. |
| Escribir por una unidad | `components/BotonContacto.js` | No abre WhatsApp: explica qué haría el sistema entregado. |

El último corte importa: el número es real y va impreso en su emblema.

La contraseña vive en `libs/acceso.js` (solo servidor) y la pisa
`DEMO_PASSWORD`; la de reserva es `lonestar2026`. La cookie
(`lonestar_acceso`) lleva la sal `lone-star::acceso::`.

```bash
grep -rl "<la-clave>" .next/static/   # no debe devolver nada
```

### Apagarlo el día de la entrega

```bash
NEXT_PUBLIC_DEMO=false
```

Desaparecen la puerta, la franja, el muro, el aviso flotante, los cintillos, el
bloque de venta y la comparación con Instagram; el formulario y WhatsApp
empiezan a funcionar.

---

## Diseño

Ver la cabecera de `app/globals.css`. En corto: **negro de noche, rojo de la
estrella (#E3161E) y blanco del rótulo**; la escena de su emblema
(`components/Escenario.js`) con humo rojo, la bandera arriba, el puerto con
grúas y contenedores al fondo y el piso mojado; bandas rojas en diagonal;
esquinas casi rectas. Titulares en Barlow Condensed itálica.

Logo (`components/Logo.js`): el emblema redondo tal cual para la puerta, y la
versión corta de sus piezas —estrella partida + "LONE STAR" + "ALL IN AUTOS"—
en vector para la cabecera. Los iconos salen de `scripts/generate-favicon.mjs`.

---

## Antes de entregar

- [ ] Lotes reales en `data/vehiculos.json`; quitar `muestra` y `precioProvisional`
- [ ] Fotos en `public/vehiculos/` y rellenar `fotos`
- [ ] Ciudad y dirección de la oficina (hoy dice "Texas, USA"; el 281 es Houston)
- [ ] `domainName` / `SITE_URL` con el dominio de verdad
- [ ] `DEMO_PASSWORD` propia antes de repartir el enlace
- [ ] `demo.urlCompra` con el enlace de pago (hoy vacío → `/contacto`)
- [ ] `demo.ofertaHasta` con una fecha que no haya pasado
- [ ] Enganchar `app/api/contacto/route.js` al canal que elija el cliente
- [ ] Repasar `/tos` (ley de Texas) y `/privacy-policy` con el cliente

## Desarrollo

```bash
pnpm install
pnpm --filter lone-star dev
pnpm --filter lone-star build
pnpm --filter lone-star generate-favicon
```

```bash
DEMO_PASSWORD=          # contraseña de la puerta; sin ella, la de reserva
NEXT_PUBLIC_DEMO=       # "false" para entregar el sistema completo
SITE_URL=               # dominio, para el sitemap y el SEO
```
