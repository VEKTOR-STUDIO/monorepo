// -----------------------------------------------------------------------------
// Configuración de Aprovéchalo.
//
// Los datos salen del Instagram del negocio (@aprovechalo.ve): consultoría
// inmobiliaria y venta de vehículos. La bio dice, literalmente:
//
//   "Consultor Inmobiliario | Inversiones | Compra | Venta | Alquiler 🏡
//    Cumpliendo sueños 🍾 VENTA DE VEHICULOS 🚘🏍"
//
// Esta página cubre la pata de vehículos, que es la que se pidió. La parte
// inmobiliaria se reconoce al final de la portada y lleva al mismo contacto.
//
// PENDIENTE (antes de enseñarla al cliente):
//   · `whatsapp` — hoy está vacío y los botones caen al DM de Instagram.
//   · `domainName` / `siteUrl` — el dominio de la bio (aprovechalo.com) está
//     aparcado y a la venta en GoDaddy, no es suyo. Aquí hay uno de trabajo.
// -----------------------------------------------------------------------------

const config = {
  appName: "Aprovéchalo",
  appDescription:
    "Venta de vehículos en Venezuela: carros, camionetas y motos verificados, con precio en dólares y atención directa por WhatsApp. Compra, venta y asesoría.",
  domainName: "aprovechalo.ve",
  siteUrl:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : process.env.SITE_URL || "https://aprovechalo.ve",

  crisp: {
    id: "",
    onlyShowOnRoutes: ["/"],
  },

  resend: {
    fromNoReply: `Aprovéchalo <noreply@aprovechalo.ve>`,
    fromAdmin: `Aprovéchalo <contacto@aprovechalo.ve>`,
    supportEmail: "",
  },

  colors: {
    // Tema único claro, definido en app/globals.css.
    theme: "aprovechalo",
    // Azul de marca. Cambiarlo también en --color-primary de globals.css.
    main: "#0B5FB0",
  },

  business: {
    nombre: "Aprovéchalo",
    razonSocial: "Aprovéchalo VE",
    // PENDIENTE: número real. Vacío → los botones llevan al DM de Instagram.
    whatsapp: "",
    whatsappVisible: "",
    instagram: "aprovechalo.ve",
    instagramUrl: "https://instagram.com/aprovechalo.ve/",
    seguidores: "42,7 K",
    ciudad: "Venezuela",
    horario: "Atención por WhatsApp e Instagram",
    tagline: "Cumpliendo sueños",
    // Las dos patas del negocio, tal como las anuncia la cuenta.
    servicios: ["Venta de vehículos", "Consultoría inmobiliaria", "Inversiones"],
  },

  // Cómo se cierra una compra. Es el recorrido que hoy hace la cuenta por
  // WhatsApp, puesto por escrito para que el comprador sepa a qué atenerse.
  compra: {
    pasos: [
      {
        titulo: "Eliges el vehículo",
        detalle:
          "Cada ficha lleva año, kilometraje, motor y estado de documentos. Sin llamadas para preguntar lo básico.",
      },
      {
        titulo: "Lo revisas en persona",
        detalle:
          "Se coordina la cita para verlo, probarlo y llevarlo a un taller de tu confianza.",
      },
      {
        titulo: "Se cierra el trato",
        detalle:
          "Acompañamiento en el traspaso, el notariado y los documentos hasta que el vehículo quede a tu nombre.",
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
  // Esta página se le enseña al dueño de @aprovechalo.ve antes de vendérsela.
  // Con el modo demo activo se ve casi todo, pero no se puede USAR: hay que
  // pasar una puerta con contraseña, el listado se corta a mitad y el contacto
  // no sale hacia ningún teléfono real.
  //
  // Se apaga con NEXT_PUBLIC_DEMO=false en el entorno, que es lo que hay que
  // hacer el día que el sistema se entregue.
  // ---------------------------------------------------------------------------
  demo: {
    activa: process.env.NEXT_PUBLIC_DEMO !== "false",

    // La contraseña de la puerta NO está aquí: este archivo lo importan
    // componentes del navegador y acabaría en el bundle, a la vista de
    // cualquiera. Vive en libs/acceso.js, que solo corre en el servidor.

    // PENDIENTE: poner el enlace de compra.
    precio: "$399",
    // El precio de antes, que sale tachado al lado del de ahora. Vacío = no
    // se enseña ninguna rebaja.
    precioAnterior: "$690",
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
      "Página completa de vehículos, con ficha propia para cada uno",
      "Buscador con filtros por tipo, marca, año y precio",
      "Cada vehículo se comparte con su enlace directo, listo para el post",
      "Botón de WhatsApp que llega con el vehículo ya escrito en el mensaje",
      "Precio en dólares con su equivalente en bolívares a la tasa del BCV del día",
      "Diseño propio, dominio propio y el código es tuyo",
    ],
  },
};

export default config;
