// -----------------------------------------------------------------------------
// Configuración de Coronado Carss.
//
// Todo lo de aquí sale de lo único que hay del cliente: su cuenta de Instagram
// @coronadocarss, su foto de perfil y dos de sus publicaciones (guardadas en
// docs/fuentes/, fuera de `public/`).
//
//   · @coronadocarss — «Coronado Carss», 2.567 publicaciones, 71,8 mil
//       seguidores, 3.198 seguidos. Categoría: Concesionaria de automóviles.
//       "Emp. @autosdel.centro"
//       "Centro de publicaciones 📷"
//       "Link Directo al WhatsApp 👇👇👇"
//       "Grupo autos del centro, Valencia, Carabobo 2001"
//       Enlace de la bio: wa.me/584144055202. También en Threads.
//       Destacadas: Cliente feliz · Horarios · Videos · Ubicación.
//       Fijadas: "¿Quieres vender tú…?", "Grupo Autos del Centro · Cómo
//       llegar" y la foto de la fachada del grupo.
//
// LA MARCA SON DOS COLORES Y UNA INCLINACIÓN. Su logotipo —docs/fuentes/
// coronadocarss-perfil.jpg— es un rectángulo AZUL REY con "CORONADO CARSS" en
// AMARILLO NEÓN, en una grotesca técnica gruesa e INCLINADA, "Compra - Venta y
// Consignación de Vehículos" en blanco encima y "Servimos con Excelencia"
// debajo. Una 4Runner blanca se sale del recuadro por la derecha.
//
// EL AMARILLO SOLO VIVE SOBRE AZUL. En el logotipo y en todas sus piezas el
// neón va encima del azul —nunca sobre blanco, donde no se lee— y siempre para
// lo que tiene que verse primero: el nombre, "VENDIDO!", el filete sobre los
// datos. Aquí hace lo mismo: precio, 0 km y la llamada a la acción.
//
// LA FICHA DE CADA UNIDAD ES SUYA, no una invención: sus posts ponen el modelo
// en una etiqueta blanca arriba a la izquierda ("YARIS") y rematan abajo con
// una fila de cajas —AÑO en azul; MODELO, KILOMETRAJE y TRANSMISIÓN en
// blanco— bajo un filete amarillo, y el pie "@CoronadoCarss +58 414 405 5202".
// Detrás, siempre la misma pared de prensa del local. Eso es
// `components/PlantillaPublicacion.js` y `.tarjeta-dato` en app/globals.css.
//
// PENDIENTE (antes de entregarla):
//   · `domainName` / `siteUrl` — no tienen dominio propio todavía.
//   · El correo y la dirección exacta: su bio solo dice "Grupo autos del
//     centro, Valencia". El «cómo llegar» fijado no se lee en la captura.
//   · El horario: está en una destacada que no se pudo abrir.
//   · El inventario de data/vehiculos.json es CASI TODO DE MUESTRA. De sus
//     publicaciones solo se leyó una ficha entera (el Yaris Belta 2008). Ver
//     data/vehiculos.json y el aviso de la portada.
//   · Las fotos: no hay ninguna suya. Cada ficha se dibuja con la plantilla de
//     sus propias publicaciones hasta que carguen las suyas.
// -----------------------------------------------------------------------------

const config = {
  appName: "Coronado Carss",
  appDescription:
    "Concesionaria de automóviles en Valencia, Carabobo, del Grupo Autos del Centro. Compra, venta y consignación de vehículos: usados y 0 km con su año, modelo, kilometraje y transmisión a la vista.",
  domainName: "coronadocarss.com",
  siteUrl:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : process.env.SITE_URL || "https://coronadocarss.com",

  crisp: {
    id: "",
    onlyShowOnRoutes: ["/"],
  },

  resend: {
    fromNoReply: `Coronado Carss <noreply@coronadocarss.com>`,
    fromAdmin: `Coronado Carss <contacto@coronadocarss.com>`,
    supportEmail: "",
  },

  colors: {
    // Tema único oscuro —azul de noche—, definido en app/globals.css.
    theme: "coronado",
    // El azul rey del recuadro del logotipo. Lo lee `viewport.themeColor` y el
    // navegador lo usa para la barra del móvil, que es donde interesa que se
    // vea la casa. El amarillo neón es el acento y va en --color-primary.
    main: "#0B4DC4",
  },

  business: {
    nombre: "Coronado Carss",
    razonSocial: "Coronado Carss",
    // Lo que dice el recuadro del logotipo encima del nombre, palabra por
    // palabra (con las tildes que el logotipo no lleva).
    rotuloEmblema: "Compra - Venta y Consignación de Vehículos",

    // El WhatsApp de su bio y del pie de todas sus publicaciones. En modo demo
    // NO se usa: libs/demo.js lo corta para que un desconocido probando la
    // página no le escriba al negocio real.
    whatsapp: "584144055202",
    whatsappVisible: "+58 414 405 5202",

    instagram: "coronadocarss",
    instagramUrl: "https://www.instagram.com/coronadocarss/",
    seguidores: "71,8 mil",
    publicaciones: "2.567",
    seguidos: "3.198",

    // Forman parte de un grupo, y lo dicen en la bio y en una fijada: la
    // empresa madre es @autosdel.centro. No es un dato de contacto cualquiera,
    // es de dónde sale la confianza de una cuenta de 71 mil seguidores.
    grupo: "Grupo Autos del Centro",
    grupoInstagram: "autosdel.centro",
    grupoInstagramUrl: "https://www.instagram.com/autosdel.centro/",

    ciudad: "Valencia",
    estado: "Carabobo",
    // Se conservan con estos nombres porque la cabecera, el pie y el SEO los
    // leen así. `centro` es el nombre corto del sitio; `centroLargo`, el largo.
    centro: "Autos del Centro",
    centroLargo: "Grupo Autos del Centro",
    direccion: "Grupo Autos del Centro, Valencia",
    direccionLarga: "Grupo Autos del Centro, Valencia, Carabobo 2001",

    // Tienen una destacada de "Horarios", pero no se pudo leer. Hasta que la
    // confirmen, se dice lo que sí es seguro.
    horario: "Horario en su destacada de Instagram · consulta por WhatsApp",

    // La frase de su logotipo y la del recuadro, tal cual.
    tagline: "Servimos con Excelencia",
    lema: "Compra, venta y consignación de vehículos",
    descriptor: "Concesionaria de automóviles",

    // Lo que le hacen al carro de quien lo pone en consignación. Su bio se
    // llama a sí misma "Centro de publicaciones 📷" y todas sus fichas se
    // fotografían contra la misma pared del local, así que el paso de las
    // fotos es suyo. Las condiciones (comisión, plazo) no las publican: no se
    // escriben aquí hasta que las den.
    consignar: [
      {
        titulo: "Avalúo",
        detalle:
          "Se revisa el carro y se le pone el precio al que se vende de verdad en Valencia hoy, no el que a uno le gustaría.",
      },
      {
        titulo: "Sesión de fotos",
        detalle:
          "Se fotografía en nuestro centro de publicaciones, contra la misma pared que ves en todas nuestras fichas.",
      },
      {
        titulo: "Publicación",
        detalle:
          "Sale con su ficha —año, modelo, kilometraje y transmisión— delante de los 71,8 mil que nos siguen.",
      },
      {
        titulo: "Venta",
        detalle:
          "Atendemos a los interesados, filtramos a los curiosos y te acompañamos hasta el traspaso.",
      },
    ],

    // Lo que hacen, en su orden: es lo que dice el recuadro del logotipo.
    servicios: [
      "Venta de vehículos usados y 0 km",
      "Compra de tu vehículo",
      "Consignación",
      "Centro de publicaciones",
    ],

    // Las marcas que hay HOY en data/vehiculos.json, que no es lo mismo que las
    // que ellos mueven: casi todas las unidades son de muestra. Se confirman al
    // cargar el inventario real.
    marcasQueMueven: [
      "Toyota",
      "Chevrolet",
      "Ford",
      "Hyundai",
      "Kia",
      "Mitsubishi",
      "Jeep",
      "Chery",
    ],
  },

  // Cómo se cierra una compra. Es el recorrido que hoy hacen entre el
  // Instagram, el WhatsApp de la bio y el local del grupo, puesto por escrito.
  compra: {
    pasos: [
      {
        titulo: "Eliges la unidad",
        detalle:
          "Cada ficha lleva año, modelo, kilometraje y transmisión, que es exactamente lo que dicen nuestras publicaciones. Se sabe lo básico antes de escribir.",
      },
      {
        titulo: "Escribes por WhatsApp",
        detalle:
          "El mensaje llega con la unidad ya escrita. Te confirmamos que sigue disponible y te damos la hora para verla.",
      },
      {
        titulo: "La ves en Valencia",
        detalle:
          "En el Grupo Autos del Centro: se prueba, se revisa y se puede llevar a tu mecánico. Después, compra directa, parte de pago o consignación.",
      },
    ],
  },

  auth: {
    loginUrl: "/entrar",
    callbackUrl: "/",
  },

  // ---------------------------------------------------------------------------
  // Modo demo
  //
  // Esta página se le enseña a Coronado Carss antes de vendérsela. Con el modo
  // demo activo se ve casi todo, pero no se puede USAR: hay que pasar una
  // puerta con contraseña, el inventario se corta a mitad y ningún formulario
  // ni botón de WhatsApp sale hacia ellos.
  //
  // Se apaga con NEXT_PUBLIC_DEMO=false en el entorno, que es lo que hay que
  // hacer el día que el sistema se entregue.
  // ---------------------------------------------------------------------------
  demo: {
    activa: process.env.NEXT_PUBLIC_DEMO !== "false",

    // La contraseña de la puerta NO está aquí: este archivo lo importan
    // componentes del navegador y acabaría en el bundle, a la vista de
    // cualquiera. Vive en libs/acceso.js, que solo corre en el servidor.

    precio: "$449",
    // El precio de antes, que sale tachado al lado del de ahora. Vacío = no
    // se enseña ninguna rebaja.
    precioAnterior: "$740",
    precioNota: "Pago único · dominio, montaje y carga del catálogo incluidos",

    // Hasta cuándo vale el precio rebajado. Es una FECHA REAL, no una cuenta
    // atrás que se reinicia en cada visita: eso último es un truco de tienda
    // barata y quien está evaluando comprar un sistema lo detecta recargando.
    //
    // Cuando la fecha pasa, el contador desaparece solo y el precio se queda
    // sin rebaja. Para alargar la oferta, se mueve esta fecha.
    ofertaHasta: "2026-10-15T23:59:59-04:00",
    // A dónde va el botón de comprar. Mientras esté vacío, los botones llevan
    // a /contacto en vez de a un enlace roto.
    urlCompra: "",
    textoBoton: "Quiero esta página",

    // Cuántos vehículos se ven nítidos en /vehiculos antes del muro.
    elementosVisibles: 6,

    // Lo que se lleva quien lo compre. Sale en el bloque de venta.
    incluye: [
      "Tu inventario completo en la web, con ficha propia para cada unidad",
      "La ficha calcada de tus posts: año, modelo, kilometraje y transmisión",
      "Página de consignación con su formulario de avalúo",
      "Buscador con filtros por condición, carrocería, marca, año y precio",
      "Cada unidad se comparte con su enlace directo, listo para la historia",
      "Botón de WhatsApp que llega con la unidad ya escrita en el mensaje",
      "Precio en dólares con su equivalente en bolívares a la tasa del BCV",
      "Diseño sacado de tu propia gráfica: tu azul, tu amarillo, tu pared",
      "Dominio propio, el código es tuyo y no hay mensualidad",
    ],
  },
};

export default config;
