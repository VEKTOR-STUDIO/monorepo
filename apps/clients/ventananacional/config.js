// -----------------------------------------------------------------------------
// Configuración de Venta Nacional.
//
// Los datos salen del Instagram del negocio (@ventanacional, 160 mil
// seguidores, 27.230 publicaciones). El perfil se presenta así:
//
//   "Concesionaria de automóviles
//    Barcelona, Anzoátegui / El Rosal, Caracas 📍
//    •COMPRA / VENTA / CONSIGNACIÓN / IMPORTACIÓN
//    🏠 @VENTANACIONAL.INMUEBLES"
//
// Es una concesionaria con dos sedes, no un vendedor particular: por eso la
// página gira sobre el inventario y sobre las cuatro formas de hacer negocio,
// y la pata inmobiliaria se reconoce al final y lleva a su propia cuenta.
//
// PENDIENTE (antes de entregarla):
//   · `domainName` / `siteUrl` — hoy no tienen web; el enlace del perfil es el
//     WhatsApp. El dominio de aquí es de trabajo.
//   · Cargar las publicaciones reales: el catálogo es de muestra.
// -----------------------------------------------------------------------------

const config = {
  appName: "Venta Nacional",
  appDescription:
    "Concesionaria de automóviles en Venezuela: compra, venta, consignación e importación. Inventario con precio en dólares y ficha completa, en Barcelona (Anzoátegui) y El Rosal (Caracas).",
  domainName: "ventanacional.com",
  siteUrl:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : process.env.SITE_URL || "https://ventanacional.com",

  crisp: {
    id: "",
    onlyShowOnRoutes: ["/"],
  },

  resend: {
    fromNoReply: `Venta Nacional <noreply@ventanacional.com>`,
    fromAdmin: `Venta Nacional <contacto@ventanacional.com>`,
    supportEmail: "",
  },

  colors: {
    // Tema único oscuro, definido en app/globals.css.
    theme: "ventanacional",
    // El amarillo de las alas del logotipo. Cambiarlo también en
    // --color-primary de globals.css.
    main: "#F2B705",
  },

  business: {
    nombre: "Venta Nacional",
    razonSocial: "Venta Nacional",
    // El enlace del perfil de Instagram es este WhatsApp. Formato
    // internacional, sin "+".
    whatsapp: "584149997557",
    whatsappVisible: "+58 414 999 7557",
    instagram: "ventanacional",
    instagramUrl: "https://instagram.com/ventanacional/",
    // La cuenta hermana, la de inmuebles.
    instagramInmuebles: "ventanacional.inmuebles",
    instagramInmueblesUrl: "https://instagram.com/ventanacional.inmuebles/",
    threads: "https://www.threads.net/@ventanacional",
    seguidores: "160 mil",
    publicaciones: "27.230",
    categoria: "Concesionaria de automóviles",
    ciudad: "Venezuela",
    horario: "Atención por WhatsApp e Instagram",
    tagline: "Concesionaria de automóviles",
    // Las cuatro formas de hacer negocio, tal como las lista el perfil.
    servicios: ["Compra", "Venta", "Consignación", "Importación"],
  },

  // Las dos salas. Salen en la portada, en el pie y como filtro del inventario:
  // el valor de `zona` tiene que coincidir con el campo `ubicacion` de
  // data/vehiculos.json, que es por donde filtra el buscador.
  sedes: [
    {
      zona: "El Rosal, Caracas",
      ciudad: "Caracas",
      detalle: "Distrito Capital",
    },
    {
      zona: "Barcelona, Anzoátegui",
      ciudad: "Barcelona",
      detalle: "Oriente del país",
    },
  ],

  // Qué se puede hacer con ellos. Es lo que el perfil resume en una línea
  // —COMPRA / VENTA / CONSIGNACIÓN / IMPORTACIÓN— explicado para quien no
  // sabe qué significa cada palabra.
  operaciones: [
    {
      clave: "compra",
      titulo: "Compramos",
      detalle:
        "Traes el vehículo, se tasa el mismo día y se paga de contado. Sin dejarlo publicado esperando comprador.",
    },
    {
      clave: "venta",
      titulo: "Vendemos",
      detalle:
        "Todo el inventario, revisado y con los papeles al día. Lo ves en sala, lo pruebas y lo llevas a tu mecánico.",
    },
    {
      clave: "consignacion",
      titulo: "Consignación",
      detalle:
        "Lo dejas en la sala y lo vendemos por ti: fotos, publicación ante 160 mil seguidores y el trato cerrado.",
    },
    {
      clave: "importacion",
      titulo: "Importación",
      detalle:
        "Se busca afuera el modelo que quieres, se nacionaliza y se entrega listo para rodar, con todo el trámite hecho.",
    },
  ],

  // Cómo se cierra una compra: el recorrido que hoy se hace por WhatsApp,
  // puesto por escrito para que el comprador sepa a qué atenerse.
  compra: {
    pasos: [
      {
        titulo: "Eliges el vehículo",
        detalle:
          "Cada ficha lleva año, kilometraje, motor, origen y estado de documentos. Sin llamadas para preguntar lo básico.",
      },
      {
        titulo: "Lo ves en la sala",
        detalle:
          "En El Rosal o en Barcelona: lo revisas, lo pruebas y lo llevas al taller de tu confianza antes de decidir.",
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
  // Esta página se le enseña a @ventanacional antes de vendérsela. Con el modo
  // demo activo se ve casi todo, pero no se puede USAR: hay que pasar una
  // puerta con contraseña, el inventario se corta a mitad y el contacto no sale
  // hacia el WhatsApp del negocio.
  //
  // Se apaga con NEXT_PUBLIC_DEMO=false, que es lo que hay que hacer el día que
  // el sistema se entregue.
  // ---------------------------------------------------------------------------
  demo: {
    activa: process.env.NEXT_PUBLIC_DEMO !== "false",

    // La contraseña de la puerta NO está aquí: este archivo lo importan
    // componentes del navegador y acabaría en el bundle, a la vista de
    // cualquiera. Vive en libs/acceso.js, que solo corre en el servidor.

    // El precio va por encima del de otros clientes del monorepo a propósito:
    // aquí son dos sedes, catálogo grande y cuatro operaciones distintas.
    // Si se decide otro número, se cambia aquí y cambia en toda la página.
    precio: "$690",
    // El precio de antes, que sale tachado al lado del de ahora. Vacío = no se
    // enseña ninguna rebaja.
    precioAnterior: "$990",
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

    // Lo que se lleva quien lo compre. Sale en la puerta y en el bloque de
    // venta, así que se escribe una sola vez.
    incluye: [
      "Inventario completo, con ficha propia y enlace directo por vehículo",
      "Buscador con filtros por tipo, marca, sede, año y precio",
      "Las dos sedes en la página: cada vehículo dice en cuál está",
      "Botón de WhatsApp que llega con el vehículo ya escrito en el mensaje",
      "Precio en dólares con su equivalente en bolívares a la tasa del BCV",
      "Panel para publicar, cambiar precios y marcar vendidos, sin programador",
      "Diseño propio, dominio propio y el código es tuyo",
    ],
  },
};

export default config;
