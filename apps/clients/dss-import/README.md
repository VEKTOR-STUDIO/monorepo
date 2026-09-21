# DSS Import & Export · créditos para vehículos y motos

Página de catálogo y solicitud de crédito para **DSS Import Export, C.A.**
(@somosdss), en Maracay, estado Aragua. Next.js 15 (App Router), Tailwind 4 +
daisyUI 5, GSAP. Sin base de datos: el catálogo vive en `data/catalogo.json`.

Hoy está en **modo demo**: se le enseña al cliente antes de vendérsela, detrás
de una puerta con contraseña. Ver [Modo demo](#modo-demo).

---

## Lo primero que hay que entender

**DSS no es un concesionario.** No vende vehículos: vende el **acceso** a un
vehículo o a una moto **en cuotas**. Su bio lo dice entero —«Planes de créditos
para vehículos y motos»— y ninguna de sus 141 publicaciones anuncia un precio de
venta. Todas anuncian una **cuota**:

> «ADQUIERE UN CHEVROLET OPTRA 2009-2011 · CUOTAS DESDE 75 SEMANALES»
> «ADQUIERE UNA TORO POWER TP180 · LLÉVALA FINANCIADA · DESDE 75$ MENSUAL»
> «OBTÉN TU VEHÍCULO CON 50% DE INICIAL · ENTREGA SEMANAL»
> «¡Financiamiento de 2 años! Pagando en cómodas cuotas»

De ahí salen las tres decisiones que estructuran todo el código, y que no hay
que deshacer sin pensarlo:

1. **La cuota es la cifra grande; el precio de contado va debajo y en gris.**
   En la tarjeta, en el carrusel, en la ficha y hasta en el `<title>` de cada
   página. Si el precio total pasara a mandar, esto sería la web de un
   concesionario, que es justo lo que DSS no es.
2. **El primer corte es vehículos contra motos**, no la condición ni la
   carrocería. Son los dos productos de su bio y dos compradores que no se
   parecen: uno financia el carro de la familia a dos años, el otro se lleva una
   moto de trabajo con cuota mensual.
3. **El filtro principal del catálogo es la cuota máxima.** Nadie llega
   preguntando «¿qué tienen por menos de 7.000?»; llegan preguntando «¿qué me
   llevo por 75 a la semana?».

Una nota de redacción: sus piezas escriben «COUTAS» y «comodas». Aquí se escribe
**cuotas** y **cómodas**. Reproducir la errata de un cliente en su propia web no
es fidelidad, es copiarle un fallo que él no eligió.

---

## De dónde sale todo

Del Instagram del cliente, que es lo único que hay. Las capturas están en
`docs/fuentes/`:

| Archivo | Qué es |
|---|---|
| `Insta_Saver_@somosdss_dp_HD.jpg` | el sello original, 1080 px (el que se usa en `public/marca/dss-import.jpg`) |
| `instagram-perfil.png` | el perfil: bio, seguidores, destacados |
| `instagram-cuadricula.png` | la cuadrícula, de donde salen las unidades y las cuotas |
| `instagram-publicacion-optra.png` | una pieza completa, de donde sale la plantilla |

Datos de la cuenta: **43,2 mil seguidores**, **141 publicaciones**, 206
seguidos. Enlace de la bio: `beacons.ai/dssimport`. Destacados: CLIENTESDSS,
OFICINA, ALIADOS, BENEFICIOS, PREGUNTAS.

Las **tres razones** de la portada (`config.business.razones`) no son un
argumentario inventado: son las que ellos publican en su pieza «3 RAZONES PARA
SER NUESTRO BENEFICIADO».

---

## Lo que NO se pudo traer, y por qué

| Falta | Por qué | Qué hace la página mientras tanto |
|---|---|---|
| **Todas las fotos** | Instagram limitó las peticiones desde esta IP (429 por red, no por cuenta) | Dibuja la plantilla de sus posts: `components/PlantillaPublicacion.js` |
| **El WhatsApp** | Su bio lleva a `beacons.ai/dssimport` y el número no se lee en ninguna captura | Los botones caen al DM de Instagram, que sí está publicado |
| **La dirección exacta** | Publican «contamos con oficina física» y «Maracay», pero no la calle | Se dice «Maracay, estado Aragua» |
| **Los precios de contado** | Sus publicaciones solo llevan la cuota | Referencias de mercado, marcadas con `precioProvisional` |
| **7 de las 13 unidades** | Solo 6 se pudieron leer de la cuadrícula | Marcadas con `deMuestra: true` y avisadas en pantalla |
| **El dominio** | No tienen | `dssimport.com` como marcador en `config.js` |

Las **cuotas de las seis unidades reales sí son suyas**, tomadas del cartel de
cada post. Las de las siete de muestra las calcula `cuotaDe()` en
`libs/catalogo.js` con las condiciones de `config.credito`, y salen marcadas en
pantalla con `AvisoCuotaCalculada`. Esa distinción importa: una cuota inventada
que parezca suya es lo único de esta página que podría costarle dinero a
alguien.

### Traer el catálogo real desde Instagram

La herramienta está en `tools/instagram/` (léele el README antes):

```bash
node tools/instagram/leer-perfil.mjs somosdss --max 80
node tools/instagram/bajar-fotos.mjs tools/instagram/salida/somosdss.json \
     --destino apps/clients/dss-import/public/catalogo
```

**Estado: falló con 429 por límite de IP.** La sesión era buena —el script
entra y dice con qué cuenta—, el límite es de la red y se quita solo en un par
de horas. Insistir lo alarga. Cuando se consiga:

1. Leer los `caption` a mano y sacar de ahí modelo, año y **cuota**. El script
   los deja crudos a propósito; un regex que adivine mal mete datos falsos en el
   catálogo de un cliente.
2. Añadir `"fotos": ["/catalogo/<archivo>.jpg"]` a cada unidad.
3. Quitar `deMuestra` y `precioProvisional` de las que se confirmen.

Los avisos de la interfaz desaparecen solos en cuanto esos campos se van.

---

## Estado

- ✅ Portada, catálogo con filtros, ficha por unidad, simulador de cuota,
  solicitud de crédito, 404, términos, privacidad.
- ✅ Capa de demo entera: puerta, franja, muro, bloque de venta, aviso flotante.
- ✅ Tasa del BCV para el equivalente en bolívares del precio de contado.
- ⚠️ El formulario de solicitud **no reenvía a ningún sitio** todavía (ver
  `app/api/contacto/route.js`).
- ⚠️ Términos y privacidad **sin revisar por un abogado**. En un negocio de
  crédito eso pesa más que en otros clientes: ver el comentario largo de
  `app/tos/page.js`.
- ❌ Sin panel de administración todavía (`SeccionPanel` lo describe y lo
  promete; es parte de lo que se vende).

---

## Modo demo

Se ve casi todo, no se puede usar nada, y en cada pantalla hay una vía para
comprarla. **Todos los cortes están en el servidor**, no en la pantalla: una
pantalla de bloqueo pintada con CSS se quita con F12 en diez segundos.

| Qué | Dónde se corta | Qué pasa |
|---|---|---|
| Ver cualquier página | `middleware.js` + `libs/acceso.js` | Redirige a `/entrar` sin la cookie correcta |
| El catálogo | `app/catalogo/page.js` | Se ven 6 nítidas, el resto difuminado tras `MuroDemo` |
| Solicitud de crédito | `app/api/contacto/route.js` | 403, aunque se llame a la ruta a mano |
| Botón de WhatsApp | `libs/demo.js` → `enlaceDeWhatsapp()` | Devuelve `null`; se enseña `AvisoBloqueado` |

El corte del contacto es el que más importa aquí: lo que entra por ese botón no
es una consulta cualquiera, es una **solicitud de crédito con los datos de una
persona**. Si abriera de verdad, un desconocido probando la demo le estaría
metiendo solicitudes falsas en la bandeja a un negocio que tiene que llamar a
cada una.

La contraseña **no está en `config.js`** —ese archivo lo importan componentes de
cliente y Next lo empaqueta para el navegador—: vive en `libs/acceso.js`, que
solo corre en servidor. Clave de reserva: `dss2026`. Cámbiala con
`DEMO_PASSWORD` antes de repartir el enlace, y compruébalo:

```bash
grep -rl "dss2026" .next/static/   # no debe devolver nada
```

### Apagarlo el día de la entrega

```bash
NEXT_PUBLIC_DEMO=false
```

Eso solo. Desaparecen la puerta, la franja, el muro, el bloque de venta, el
aviso flotante, los cintillos y la comparación con Instagram; vuelven el
WhatsApp y la solicitud de crédito. `SeccionPanel` se queda, porque también le
habla al cliente final.

> **Si se apaga la demo sin haberla vendido, vacía antes el catálogo.** La
> puerta con contraseña y el `noindex` de `/entrar` son lo que impide que el
> material de un tercero acabe indexado colgando de un dominio ajeno.

---

## Las dos voces de la página

Conviven dos discursos y el visitante tiene derecho a saber cuál lee:

- **El escaparate** le habla a quien viene a financiar un carro o una moto. Va
  con la tipografía de la casa (Barlow Condensed itálica).
- **La oferta** le habla al dueño de DSS sobre el sistema que se le vende. Va en
  **Microgramma**, la tipografía de la firma de Alessandrovaru.

Entre una y otra pasa un `Cintillo`, que no es decoración: es el aviso de que
cambia el interlocutor.

---

## Diseño

Tema único oscuro, `dss`, definido en `app/globals.css`. **No se inventó una
paleta: se copió la suya.**

| Token | Valor | Qué es |
|---|---|---|
| `--color-oro` | `#D9A72C` | el oro del sello; la cuota, el botón, el cielo |
| `--color-oro-claro` | oro pálido | el brillo del pan de oro |
| `--color-oro-hondo` | ámbar | la sombra del pan de oro |
| `--color-marfil` | blanco cálido | el tercer color: bordes, filetes, cifras secundarias |
| `--angulo-dss` | `-9deg` | muy tumbado: el gesto dominante es el círculo, no la diagonal |

Cuatro decisiones que vienen de su gráfica y no de un gusto:

- **Fondo negro.** Su monograma está calado en negro sobre el oro y sus piezas
  usan el negro como respiro entre dorados.
- **El oro no decora, señala.** Es la cuota, el botón y el cielo. Si llenara,
  dejaría de significar nada.
- **El marfil es el tercer color**, no un gris cualquiera: su oro es cálido y
  al lado un gris azulado lo ensucia.
- **Círculos, no esquinas.** El logotipo es un sello redondo con el rótulo en
  arco.

La escena de sus publicaciones —cielo dorado, ciudad recortada, asfalto, vetas
de oro cruzando— es `components/Escenario.js`, y se monta como capa dentro de
cualquier sección.

### El logotipo

Dos piezas, y no hay que confundirlas:

- **El sello** (`components/Logo.js`): el disco de pan de oro, el archivo suyo
  sin retocar.
- **El rótulo** (`components/MarcaDSS.js`): «DSS» con «IMPORT & EXPORT» debajo,
  separados por un filete. Es lo que encabeza todas sus piezas. Va en texto, no
  en SVG: son letras.

**Cómo se recorta el sello, y por qué no lleva el filtro de alfa.** Otras marcas
de este monorepo tienen el logotipo calado sobre negro y usan un filtro SVG que
saca el alfa del brillo del píxel. Aquí sería lo contrario de lo que hace falta:
el archivo de DSS es un disco dorado sobre **blanco**, así que ese filtro
dejaría las esquinas opacas y calaría el monograma —lo único oscuro—: un cuadro
blanco con un agujero con forma de S. Un logotipo redondo se recorta redondo, y
eso hace la clase `.sello` con `border-radius` y `object-fit: cover`.

---

## Cargar el catálogo real

`data/catalogo.json`. Campos de una unidad:

```jsonc
{
  "slug": "chevrolet-optra-2011",   // único; es la URL /unidad/<slug>
  "segmento": "auto",               // auto | moto  ← el corte principal
  "carroceria": "sedan",            // sedan hatchback suv pickup moto scooter
  "condicion": "usado",             // nuevo | usado
  "estado": "disponible",           // disponible | reservado | entregado
  "marca": "Chevrolet",
  "modelo": "Optra",
  "version": "Limited",
  "anio": 2011,
  "precio": 6500,                   // de CONTADO; secundario en la interfaz
  "km": 142000,
  "destacado": true,                // sale en el escaparate de la portada
  "credito": {
    "cuota": 75,                    // si está, MANDA: es su cifra publicada
    "periodo": "semanal",           // semanal | mensual
    "plazoMeses": 24,
    "inicialPct": 50
  },
  "detalles": ["Cuotas desde 75$ semanales"],
  "descripcion": "…",
  "fotos": []                       // vacío → se dibuja la plantilla
}
```

**Sobre `credito.cuota`:** si viene escrita, se usa tal cual y la unidad no
lleva aviso. Si falta, `cuotaDe()` la calcula con `config.credito` y la marca
como estimación. Esa es la diferencia entre publicar una oferta y publicar una
aproximación, y la interfaz la dice en voz alta.

Campos de honestidad, que hay que **quitar** según se confirmen los datos:

- `"deMuestra": true` → «Unidad de muestra, para llenar el catálogo».
- `"precioProvisional": true` → «Precio de contado de referencia».

---

## Antes de entregar

1. **Pedir el WhatsApp.** Es lo que más falta: sin él los botones van al DM de
   Instagram, donde el mensaje prerrellenado se pierde. `config.business.whatsapp`.
2. **Pedir la dirección exacta** de la oficina. Es su propio argumento de venta.
3. **Confirmar las condiciones del crédito** (`config.credito`): si las cuotas
   llevan intereses o gastos, el texto de `/tos` y el simulador tienen que
   decirlo.
4. **Revisar `/tos` y `/privacy-policy` con un abogado.** El crédito al consumo
   está regulado; ver el comentario de `app/tos/page.js`.
5. **Traer las fotos y el catálogo real** cuando Instagram suelte el límite.
6. Registrar el dominio y poner `domainName`, `siteUrl` y `SITE_URL`.
7. Cambiar `DEMO_PASSWORD` y repartir el enlace.
8. Enganchar `/api/contacto` al canal real del cliente.
9. `NEXT_PUBLIC_DEMO=false` y comprobar que la página entera sigue en pie.

---

## Desarrollo

```bash
cd apps/clients/dss-import
npm run dev              # http://localhost:3000  (puerta: dss2026)

NEXT_PUBLIC_DEMO=false npm run dev   # sin la capa de demo
npx next build && npx next lint      # antes de dar nada por terminado
npm run generate-favicon             # si cambia el oro de marca
```

Comprobar que la puerta corta de verdad:

```bash
curl -s -o /dev/null -w "%{http_code} %{redirect_url}\n" localhost:3000/
curl -s -X POST localhost:3000/api/contacto -d '{}' -w " [%{http_code}]\n"
```
