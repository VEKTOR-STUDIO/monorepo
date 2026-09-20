// -----------------------------------------------------------------------------
// Configuración de Citta Cars.
//
// Los datos salen del Instagram del negocio (@cittacars), que se presenta así:
//
//   "Somos tu concesionario de confianza 💎
//    Tenemos taller de accesorios y detailing 💧
//    Arma la camioneta de tus sueños 🚀
//    Profesionalismo y experiencia ⚡"
//
// Son tres patas y las tres están en la página: el inventario del
// concesionario, el taller de accesorios y detailing, y la consignación
// (una de sus historias destacadas es, literalmente, "¿Quieres dejar tu
// vehículo a consignación?").
//
// PENDIENTE (antes de enseñarla al cliente):
//   · `whatsapp` — hoy está vacío y los botones caen al DM de Instagram.
//   · `ciudad` / `direccion` — el perfil no dice dónde está el showroom.
//     Mientras no se sepa, la página habla de "Venezuela" y no inventa
//     ninguna dirección.
//   · `domainName` / `siteUrl` — cittacars.com está por comprobar. Aquí hay
//     un dominio de trabajo.
// -----------------------------------------------------------------------------

const config = {
  appName: "Citta Cars",
  appDescription:
    "Concesionario de camionetas, pick-up y carros en Venezuela, con taller de accesorios y detailing. Precio en dólares, ficha completa de cada vehículo y atención directa por WhatsApp.",
  domainName: "cittacars.com",
  siteUrl:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : process.env.SITE_URL || "https://cittacars.com",

  crisp: {
    id: "",
    onlyShowOnRoutes: ["/"],
  },

  resend: {
    fromNoReply: `Citta Cars <noreply@cittacars.com>`,
    fromAdmin: `Citta Cars <contacto@cittacars.com>`,
    supportEmail: "",
  },

  colors: {
    // Tema único oscuro, definido en app/globals.css.
    theme: "citta",
    // Rojo de marca, el de las barras del logotipo. Cambiarlo también en
    // --color-primary de globals.css.
    main: "#CE2B37",
    // Verde de las barras: el acento que se usa con cuentagotas.
    acento: "#009246",
    // El negro del logo. Es el color de la barra del navegador.
    fondo: "#0D0D0D",
  },

  business: {
    nombre: "Citta Cars",
    razonSocial: "CITTA CARS",
    // PENDIENTE: número real. Vacío → los botones llevan al DM de Instagram.
    whatsapp: "",
    whatsappVisible: "",
    instagram: "cittacars",
    instagramUrl: "https://instagram.com/cittacars/",
    seguidores: "5.427",
    publicaciones: "213",
    // PENDIENTE: el perfil no dice la ciudad. Hasta saberla, no se inventa.
    ciudad: "Venezuela",
    horario: "Atención por WhatsApp e Instagram",
    tagline: "Somos tu concesionario de confianza",
    // Las tres patas del negocio, tal como las anuncia la cuenta.
    servicios: [
      "Venta de vehículos",
      "Taller de accesorios",
      "Detailing",
      "Consignación",
    ],
  },

  // El taller: la segunda pata del negocio y lo que de verdad los distingue de
  // un concesionario cualquiera. "Arma la camioneta de tus sueños" es suyo.
  taller: {
    titulo: "Arma la camioneta de tus sueños",
    entrada:
      "El vehículo sale del showroom como tú lo quieres. Accesorios montados aquí mismo y detailing antes de entregarlo: no hay que llevarlo a otro sitio ni esperar a que aparezca el repuesto.",
    servicios: [
      {
        nombre: "Accesorios 4x4",
        detalle: "Parachoques, estribos, barras, winche y faros auxiliares.",
      },
      {
        nombre: "Batea y carrocería",
        detalle: "Forros de batea, roll bar, cubiertas y protectores.",
      },
      {
        nombre: "Luces y sonido",
        detalle: "LED, pantallas, cámaras de retroceso y sensores.",
      },
      {
        nombre: "Detailing",
        detalle: "Pulitura, tratamiento de pintura y limpieza a fondo.",
      },
      {
        nombre: "Vidrios y ahumado",
        detalle: "Papel ahumado, tratamiento de vidrios y faros.",
      },
      {
        nombre: "Entrega lista",
        detalle: "Todo montado y el vehículo detallado antes de dártelo.",
      },
    ],
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
        titulo: "Lo ves en el showroom",
        detalle:
          "Se coordina la cita para verlo, probarlo y llevarlo a un taller de tu confianza si quieres.",
      },
      {
        titulo: "Sale como tú lo quieres",
        detalle:
          "Se acompaña el traspaso y los documentos, y si le vas a montar accesorios se hace aquí antes de entregarlo.",
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
  // Esta página se le enseña al dueño de @cittacars antes de vendérsela. Con el
  // modo demo activo se ve casi todo, pero no se puede USAR: hay que pasar una
  // puerta con contraseña, el listado se corta a mitad y el contacto no sale
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
      "Página completa del concesionario, con ficha propia para cada vehículo",
      "Buscador con filtros por tipo, marca, año y precio",
      "Sección de taller y de consignación, con su propio contacto",
      "Cada vehículo se comparte con su enlace directo, listo para el post",
      "Botón de WhatsApp que llega con el vehículo ya escrito en el mensaje",
      "Precio en dólares con su equivalente en bolívares a la tasa del BCV del día",
      "Diseño propio, dominio propio y el código es tuyo",
    ],
  },
};

export default config;
