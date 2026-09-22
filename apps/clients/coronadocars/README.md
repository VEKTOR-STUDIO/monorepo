# Coronado Carss · compra, venta y consignación en Valencia

Página de inventario para **Coronado Carss**
([@coronadocarss](https://www.instagram.com/coronadocarss/) · 71,8 mil
seguidores, 2.567 publicaciones), concesionaria de automóviles en **Valencia,
Carabobo**, parte del **Grupo Autos del Centro**
([@autosdel.centro](https://www.instagram.com/autosdel.centro/)).

Su bio: *"Concesionaria de automóviles · Emp. @autosdel.centro · Centro de
publicaciones 📷 · Link Directo al WhatsApp"*, con `wa.me/584144055202`. Su
logotipo: *"Compra - Venta y Consignación de Vehículos · CORONADO CARSS ·
Servimos con Excelencia"*.

Base: copia de `kingscars` (una sola sede, corte usados/0 km, página de «vende
tu carro») reidentificada. Next.js 15 (App Router) · Tailwind 4 + daisyUI 5 ·
GSAP 3. Sin base de datos: el inventario es un JSON.

---

## De dónde sale todo

Todo está guardado en `docs/fuentes/` (fuera de `public/`, para que no se sirva
en la web).

| Archivo | Qué aportó |
|---|---|
| `coronadocarss-perfil.jpg` | El **logotipo**: recuadro azul rey, "CORONADO CARSS" en amarillo neón en cursiva, la 4Runner blanca saliéndose y el lema. De ahí salen los colores, la tipografía y la pendiente. |
| `instagram-perfil.png` | La bio, las cifras, el WhatsApp, el grupo, las destacadas (Cliente feliz · Horarios · Videos · Ubicación) y las fijadas ("¿Quieres vender tú…?", "Grupo Autos del Centro · Cómo llegar"). |
| `post-ficha-yaris-2008.png` | **La ficha de sus posts**: la pared de prensa del local, la etiqueta blanca "YARIS" con banda azul, su recuadro abajo a la derecha, el filete amarillo y la fila AÑO (azul) · MODELO · KILOMETRAJE · TRANSMISIÓN (blancas), y la pastilla "@CoronadoCarss +58 414 405 5202". También la única unidad real del inventario. |
| `post-vendido.png` | La pieza de "VENDIDO!": el neón sobre azul, una palabra que grita y el resto en blanco. |

---

## La identidad, en cinco reglas

1. **Fondo azul de noche**, no negro: el azul del recuadro llevado a oscuro. Ni
   negro (cualquier concesionario) ni blanco (Top Miami Cars ya es la demo clara).
2. **El amarillo solo vive sobre azul** y solo señala: precio, 0 km, llamada a
   la acción, el filete. En su gráfica nunca va sobre blanco.
3. **El azul rey es el de las cajas**: la del AÑO, el recuadro, la pastilla del
   @usuario, el segundo botón (`.btn-azul`).
4. **Todo inclinado −12°**: la cursiva de "CORONADO CARSS" y el lado cortado de
   sus cajas. `--angulo-cc` en `app/globals.css` y `ANGULO` en
   `libs/animaciones.js` van a la par. `.faceta` corta el lado derecho.
5. **La pared de prensa**: todas sus fichas se fotografían contra la misma
   pared de logos. `.pared-logos` (bajita, sobre la noche) y `.pared-clara`
   (a plena luz, detrás de cada carro dibujado). Son solo placas: **no se
   dibuja el logo de autocom**, la marca hermana que comparte la pared.

**Logotipo** — `components/MarcaCoronado.js` lo redibuja en vector (texto en
Exo 2 con `textLength`, para que no se descuadre aunque la fuente tarde). El JPG
no se usa en la web: es un cuadrado blanco y recortarlo parte la camioneta.
`components/Logo.js` compone recuadro + silueta SUV + lema.

**Tipografía** — Exo 2 800 itálica para rótulos (la más cercana libre a su
logotipo), Archivo para el cuerpo, JetBrains Mono para cifras, Microgramma
solo para la voz de Vektor.

**Iconos** — `scripts/generate-favicon.mjs`: cuadro azul con dos barras
amarillas inclinadas (las dos líneas del nombre).

---

## Estado

| | |
|---|---|
| WhatsApp | ✅ `+58 414 405 5202`, el de su bio y sus posts |
| Instagram | ✅ @coronadocarss, y el grupo @autosdel.centro |
| Ciudad | ✅ Valencia, Carabobo 2001 — **falta la dirección exacta** (el «cómo llegar» fijado no se lee) |
| Horario | ❌ está en una destacada que no se pudo abrir; no se publica uno inventado |
| Correo | ❌ no publican ninguno |
| Dominio | ❌ `coronadocarss.com` es un supuesto |
| Inventario | ⚠️ 1 unidad real + 17 de muestra (ver abajo) |
| Precios | ⚠️ todos de referencia: **no publican precios** |
| Fotos | ❌ ninguna; cada ficha dibuja la plantilla de sus posts |
| Condiciones de consignación | ❌ no las publican; `config.business.consignar` no promete comisión ni plazo |

---

## Cargar el inventario real

`data/vehiculos.json` lleva arriba un `_nota` con todo esto. Resumen:

- **Solo el Toyota Yaris Belta 2008 es suyo**: año, modelo (Belta),
  188.000 km y sincrónico, leídos de su ficha. Lo que la ficha no dice —motor,
  color, tracción, puestos, combustible— está **vacío a propósito**. Su precio
  ($6.500) es de referencia.
- Las otras 17 llevan `"deMuestra": true` y `"precioProvisional": true`.

| Bandera | Aviso en pantalla | Se quita cuando |
|---|---|---|
| `deMuestra: true` | «Unidad de muestra, para llenar el inventario» | se sustituye por una unidad suya |
| `precioProvisional: true` | «Precio de referencia: tus fichas no publican precio» | den el precio real |
| (sin `fotos`) | «Aquí va tu foto» y la plantilla dibujada | la ficha trae `fotos` |

Los avisos salen en tarjeta, ficha y portada y **desaparecen solos** al quitar
la bandera; el aviso «Sobre este inventario» de la portada también.

**Ojo**: la puerta con contraseña y `noindex` es lo que permite enseñar su
logotipo y sus textos. Si algún día se apaga la demo sin que hayan comprado,
vacía antes el catálogo.

---

## Modo demo

Esta página se le enseña a Coronado Carss antes de vendérsela. Con el modo demo
activo se ve casi todo, pero no se puede **usar**. **El candado está en el
servidor, no en la pantalla.**

| Qué corta | Dónde | Qué pasa |
|---|---|---|
| Ver cualquier página | `middleware.js` | Sin la cookie de acceso, **307 a `/entrar`**. |
| Entrar | `app/api/entrar/route.js` | Compara huellas SHA-256, espera 600 ms por fallo y deja una cookie `httpOnly` (`coronado_acceso`). |
| El inventario completo | `app/vehiculos/page.js` | Se ven 6 nítidas (`config.demo.elementosVisibles`); el resto, difuminado tras `MuroDemo`. |
| Enviar el contacto | `app/api/contacto/route.js` | **403**, aunque se llame a mano con `curl`. |
| Pedir un avalúo | `app/api/vender/route.js` | **403**, igual. |
| Escribir por una unidad | `components/BotonContacto.js`, `libs/demo.js` | No abre WhatsApp: explica qué haría el sistema entregado. |

El WhatsApp es el que atiende a sus compradores de verdad: un desconocido
probando la demo no puede mandarle preguntas por carros de muestra.

La contraseña **no está en `config.js`**: vive en `libs/acceso.js` (solo
servidor) y la pisa `DEMO_PASSWORD`. Si falta, se usa la de reserva
(`coronado2026`), para que la demo nunca quede abierta por un olvido. En Vercel
lleva su propia `DEMO_PASSWORD`. Comprobado:

```bash
grep -rl "coronado2026" .next/static/    # no devuelve nada
```

La huella lleva el cliente como sal (`coronado-carss::acceso::…`): la cookie de
otra demo no vale aquí.

Precio de la demo: **$740 tachado → $449**, el mismo en todas las demos del
monorepo; oferta hasta el 15-10-2026.

### Apagarlo el día de la entrega

```bash
NEXT_PUBLIC_DEMO=false
```

Desaparecen la puerta, la franja, el muro, el aviso flotante, los cintillos, el
bloque de venta y la comparación con Instagram; los formularios y los botones de
WhatsApp empiezan a funcionar. Antes, enganchar `app/api/contacto` y
`app/api/vender` al canal que elijan (hoy responden bien pero no reenvían).

---

## Desarrollo

```bash
pnpm install          # desde la raíz del monorepo
pnpm dev              # en esta carpeta
npx next build && npx next lint
node scripts/generate-favicon.mjs   # si cambia el icono
```
