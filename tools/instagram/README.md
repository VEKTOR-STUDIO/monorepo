# Leer Instagram

Para llenar la web de un cliente con su catálogo real —los vehículos que de
verdad publica, con sus fotos y sus textos— en vez de fotos de stock.

## Por qué hace falta una credencial

Instagram cerró todas las puertas anónimas. Comprobado, no recordado:

| Vía | Qué devuelve hoy |
|---|---|
| `curl` a la página del perfil | muro de login |
| API web `users/web_profile_info` | `{"require_login": true}` |
| `/p/<post>/embed/captioned/` | 200, 626 KB de JavaScript y **cero fotos** |

No existe una vía gratis y sin credencial que funcione. Hay tres con
credencial: la cookie de sesión (esto), la Graph API oficial de Meta (necesita
que ambas cuentas sean Business y una app en Meta Developers) y un scraper de
pago tipo Apify. Aquí está implementada la primera.

## Sacar el sessionid

Una vez cada varias semanas, no cada vez.

1. Inicia sesión en `instagram.com` **con una cuenta secundaria**.
2. `F12` → pestaña **Application** (Chrome) o **Almacenamiento** (Firefox).
3. **Cookies** → `https://www.instagram.com` → fila `sessionid`.
4. Copia el valor entero (algo como `7123456789%3AabCd…%3A12%3AAYf…`).
5. `cp .env.example .env.local` y pégalo ahí.

Cuidados que no son burocracia:

- **Cuenta secundaria.** Ese valor es la sesión entera: quien lo tenga entra
  sin contraseña y sin que el 2FA le pregunte nada.
- **No cierres sesión en ese navegador.** Cerrarla invalida el sessionid; es
  también la forma de anularlo el día que quieras.
- `.env.local` ya está en `.gitignore`. No lo pegues en un chat ni en un issue.
- **No bajes las pausas del script.** Están en 2,5–6 s entre páginas a
  propósito. Leer unos cientos de publicaciones al día es normal; miles no, y
  la cuenta acaba limitada.
- Si aparece *"Please wait a few minutes before you try again"*, la cuenta ya
  está limitada: para y vuelve en unas horas. Insistir la agrava.

Esto lee contenido público de cuentas de negocio para montar la web de ese
negocio. Va contra los términos de uso de Instagram igualmente, así que es
tuyo el criterio: cuentas comerciales, nunca perfiles personales.

## Uso

```bash
# 1. Leer el perfil → JSON crudo en salida/
node tools/instagram/leer-perfil.mjs aprovechalo.ve --max 80

# Solo lo publicado este año:
node tools/instagram/leer-perfil.mjs aprovechalo.ve --desde 2026-01-01

# 2. Bajar las fotos a la app del cliente
node tools/instagram/bajar-fotos.mjs tools/instagram/salida/aprovechalo.ve.json \
     --destino apps/clients/aprovechalo-ve/public/vehiculos
```

Acepta `@cuenta` y también un enlace pegado del navegador. Arranca abriendo
`instagram.com` como haría un navegador —la API mira cookies que solo se
reparten al cargar la web— y te dice con qué cuenta entra antes de gastar
peticiones.

**Los 429 son dos cosas distintas y se distinguen solas.** Instagram devuelve
el mismo 429 cuando la cookie no vale y cuando la IP ha pedido de más, pero la
página de error lleva escrito en el `<html>` si te reconoce (`logged-in`) o no
(`not-logged-in`). El script lo mira y te dice cuál de las dos es: una se
arregla sacando otra cookie, la otra esperando. El límite por IP se quita solo
en un par de horas, y repetir el comando mientras tanto lo alarga.

| Opción | Script | Por defecto |
|---|---|---|
| `--max <n>` | ambos | 60 publicaciones / todas las fotos |
| `--desde <YYYY-MM-DD>` | leer-perfil | sin corte |
| `--salida <ruta>` | leer-perfil | `salida/<cuenta>.json` |
| `--destino <carpeta>` | bajar-fotos | obligatorio |
| `--ancho <px>` | bajar-fotos | 1600 |
| `--calidad <1-100>` | bajar-fotos | 82 |

Si hay `sharp` a mano, las fotos se recomprimen y se enderezan por su EXIF;
si no, se guardan los originales y el script lo avisa. **Hoy no lo hay**: en
este monorepo `sharp` solo existe como dependencia transitiva y no se puede
importar. Instagram ya sirve las fotos a 1080 px, así que el original suele
valer tal cual; si quieres la recompresión, `pnpm add -w -D sharp` y el script
lo encuentra solo.

## Qué sale

```json
{
  "cuenta": "aprovechalo.ve",
  "perfil": { "nombre": "…", "bio": "…", "seguidores": 4210 },
  "posts": [
    {
      "shortcode": "C8xK2mLuQrT",
      "fecha": "2026-08-14T18:22:05.000Z",
      "tipo": "carrusel",
      "caption": "Toyota RAV4 2019 XLE\n68.000 km · 32.000$\nTítulo propio…",
      "imagenes": ["https://scontent…"],
      "archivos": ["C8xK2mLuQrT-1.jpg", "C8xK2mLuQrT-2.jpg"]
    }
  ]
}
```

**Crudo a propósito: el script no interpreta el `caption`.** Cada cuenta
escribe sus anuncios a su manera —el precio en bolívares o en dólares, el año
pegado al modelo, el kilometraje a veces ausente— y un regex que adivine mal
te mete datos falsos en el inventario de un cliente. El paso de `caption` a
ficha lo hace quien lea el JSON, leyéndolo.

**Las URLs de `imagenes` caducan en unas horas**: van firmadas por el CDN.
Baja las fotos el mismo día o vuelve a leer el perfil.

## Cuando falla

| Mensaje | Qué pasó |
|---|---|
| `El sessionid no vale` | la web se sirve como anónimo → saca uno nuevo |
| `Instagram está limitando las peticiones desde aquí` | la sesión es buena y el límite es **de la IP** → espera un par de horas y repite el mismo comando. Insistir lo alarga |
| `Instagram rechazó la sesión (401/403)` | el sessionid caducó → saca uno nuevo |
| `Please wait a few minutes` | la cuenta, no la IP → para y vuelve mañana |
| `⚠ N URL(s) ya habían caducado` | pasó demasiado tiempo → vuelve a leer y baja seguido |
| `@cuenta es privada` | solo se lee si la cuenta de la sesión la sigue |
