// -----------------------------------------------------------------------------
// Configuración de LM 2006.
//
// Todo lo de aquí sale de su Instagram @lm2006.ccs (9.179 seguidores, 47
// publicaciones). La bio dice, literalmente:
//
//     "🚙 Concesionario de Vehículos y Camiones
//      🚗 Compra • Venta • Consignación
//      🇻🇪 Los Chaguaramos – Calle Sanz / Caracas
//      📇 Contáctanos
//      linktr.ee/lm2006.ccs"
//
// Y el nombre del perfil, que es el titular de la casa: «LM 2006 | Concesionario
// Caracas».
//
// Dos cosas de ese perfil mandan sobre el resto de la página:
//
//   · VEHÍCULOS **Y CAMIONES**. Es la primera línea de la bio y tienen un
//     destacado entero dedicado a Sinotruk. No es un detalle: es el corte
//     principal del catálogo (ver libs/vehiculos.js → SEGMENTOS).
//   · EL LOGOTIPO. Tres barras inclinadas —plata, roja y azul— y "LM" en
//     blanco sobre el bloque azul. De ahí salen el color, el ángulo y la
//     gráfica entera (ver app/globals.css).
//
// PENDIENTE (antes de entregarla):
//   · `whatsapp` — hoy está vacío y los botones caen al DM de Instagram. En la
//     bio solo hay un Linktree, así que el número hay que pedírselo.
//   · `domainName` / `siteUrl` — no tienen dominio propio todavía.
//   · Los precios: el único publicado en su feed es el del Corolla HEV
//     (36.500 $). El resto son de referencia. Ver data/vehiculos.json.
// -----------------------------------------------------------------------------

const config = {
  appName: "LM 2006",
  appDescription:
    "Concesionario de vehículos y camiones en Caracas. Compra, venta y consignación en Los Chaguaramos: 0 km con su ficha completa, camiones Sinotruk y precio a la vista. LM 2006.",
  domainName: "lm2006.com",
  siteUrl:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : process.env.SITE_URL || "https://lm2006.com",

  crisp: {
    id: "",
    onlyShowOnRoutes: ["/"],
  },

  resend: {
    fromNoReply: `LM 2006 <noreply@lm2006.com>`,
    fromAdmin: `LM 2006 <contacto@lm2006.com>`,
    supportEmail: "",
  },

  colors: {
    // Tema único oscuro, definido en app/globals.css.
    theme: "lm",
    // El azul del bloque del logotipo. Cambiarlo también en --color-primary de
    // globals.css.
    main: "#0059FF",
  },

  business: {
    nombre: "LM 2006",
    razonSocial: "LM 2006",
    // Como se presenta el perfil en Instagram.
    titulo: "LM 2006 | Concesionario Caracas",
    // PENDIENTE: número real. Vacío → los botones llevan al DM de Instagram.
    whatsapp: "",
    whatsappVisible: "",
    instagram: "lm2006.ccs",
    instagramUrl: "https://www.instagram.com/lm2006.ccs/",
    // El único enlace que hoy tienen publicado.
    linktree: "https://linktr.ee/lm2006.ccs",
    seguidores: "9.179",
    publicaciones: "47",
    ciudad: "Caracas",
    estado: "Distrito Capital",
    // Tal como está escrita en la bio.
    direccion: "Los Chaguaramos – Calle Sanz",
    direccionLarga: "Los Chaguaramos, Calle Sanz, Caracas",
    horario: "Atención en el local y por WhatsApp",
    // La primera línea de la bio, que es la que manda en la portada.
    tagline: "Concesionario de vehículos y camiones",
    lema: "Compra · Venta · Consignación",
    servicios: ["Compra", "Venta", "Consignación"],
    // Los destacados del perfil, que son las cuatro cosas que ellos mismos
    // decidieron dejar fijadas arriba.
    destacados: ["Sinotruk", "Contacto", "Horario", "Ubicación"],
  },

  // Cómo se cierra una compra. Es el recorrido que hoy se hace entre el
  // Instagram, el WhatsApp y el local, puesto por escrito.
  compra: {
    pasos: [
      {
        titulo: "Eliges la unidad",
        detalle:
          "Cada ficha lleva año, motor, transmisión y versión, igual que tus publicaciones. Sabes qué estás preguntando antes de escribir.",
      },
      {
        titulo: "La ves en el local",
        detalle:
          "Los Chaguaramos, Calle Sanz. Se revisa, se prueba y se lleva al taller de tu confianza antes de decidir.",
      },
      {
        titulo: "Se cierra el trato",
        detalle:
          "Compra directa o consignación. Acompañamiento en el traspaso y los documentos hasta que quede a tu nombre.",
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
  // Esta página se le enseña al dueño de LM 2006 antes de vendérsela. Con el
  // modo demo activo se ve casi todo, pero no se puede USAR: hay que pasar una
  // puerta con contraseña, el inventario se corta a mitad y el contacto no sale
  // hacia ningún teléfono real.
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

    // Cuántas unidades se ven nítidas en /vehiculos antes del muro.
    elementosVisibles: 6,

    // Lo que se lleva quien lo compre. Sale en el bloque de venta.
    incluye: [
      "Tu catálogo completo en la web, con ficha propia para cada unidad",
      "Vehículos y camiones separados, que es como te presentas tú",
      "Buscador con filtros por segmento, tipo, marca, año y precio",
      "Cada unidad se comparte con su enlace directo, listo para el post",
      "Botón de WhatsApp que llega con la unidad ya escrita en el mensaje",
      "Precio en dólares con su equivalente en bolívares a la tasa del BCV",
      "Diseño sacado de tu logotipo: tu azul, tus tres barras, tu inclinación",
      "Dominio propio, el código es tuyo y no hay mensualidad",
    ],
  },
};

export default config;
