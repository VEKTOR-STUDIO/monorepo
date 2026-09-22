// -----------------------------------------------------------------------------
// Configuración de Lone Star All In Autos.
//
// Todo lo de aquí sale de su cuenta de Instagram, @lonestarallinautos: la foto
// de perfil y cinco publicaciones, guardadas en public/marca/. No hay más
// material, y lo que no dicen ahí no se inventa aquí.
//
//   · El emblema: "LONE STAR · ALL IN AUTOS" bajo una estrella blanca y roja,
//     y debajo sus tres verbos, "COMPRAMOS | REPARAMOS | EXPORTAMOS".
//   · La frase: "Tu vehículo, nuestro compromiso".
//   · El destino: "Envíos a toda Latinoamérica", con las banderas de
//     Venezuela, Panamá y Colombia.
//   · El contacto: +1 (281) 692-8067, por WhatsApp o por DM.
//   · El proceso, en cinco pasos: compra en subasta → transporte → reparación
//     y acondicionamiento → trámites y aduanas → envío a tu país.
//   · Los pagos: Zelle, ACH, wire, efectivo en oficina y monedas electrónicas
//     (USDT TRC20, Cash App, PayPal). Todos en USD.
//
// No es un concesionario con salón: es un comprador en las subastas de
// Estados Unidos (Texas) que repara y exporta. Por eso la web no habla de
// "sedes" ni de "0 km", sino de lotes en subasta, millas, daño primario y
// "Run & Drive", que es como lo escriben ellos.
//
// La gráfica es la de su emblema: NEGRO profundo, ROJO de la estrella y BLANCO
// del rótulo, con el resplandor rojo, el piso mojado y el puerto con
// contenedores al fondo. En dos piezas usan además el azul marino de la
// bandera de Texas; aquí queda como acento, no como tema.
//
// PENDIENTE (antes de entregarla):
//   · `domainName` / `siteUrl` — no tienen dominio propio todavía.
//   · La ciudad exacta y la dirección de la oficina: el 281 es Houston, pero
//     ninguna publicación lo dice, así que la web dice "Texas, USA".
//   · Seguidores y publicaciones de Instagram: no se pudieron leer.
//   · El inventario de data/vehiculos.json es EN SU MAYORÍA de muestra: solo
//     la Tacoma y el Corolla salen de sus publicaciones. Ver ese archivo.
// -----------------------------------------------------------------------------

const config = {
  appName: "Lone Star All In Autos",
  appDescription:
    "Compramos en las subastas de Estados Unidos, reparamos y exportamos tu vehículo a Venezuela, Panamá, Colombia y toda Latinoamérica. Desde Texas.",
  domainName: "lonestarallinautos.com",
  siteUrl:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : process.env.SITE_URL || "https://lonestarallinautos.com",

  crisp: {
    id: "",
    onlyShowOnRoutes: ["/"],
  },

  resend: {
    fromNoReply: `Lone Star All In Autos <noreply@lonestarallinautos.com>`,
    fromAdmin: `Lone Star All In Autos <contacto@lonestarallinautos.com>`,
    supportEmail: "",
  },

  colors: {
    // Tema único oscuro, definido en app/globals.css.
    theme: "lonestar",
    // El rojo de la estrella. Cambiarlo también en --color-primary de
    // globals.css.
    main: "#E3161E",
  },

  business: {
    nombre: "Lone Star All In Autos",
    razonSocial: "Lone Star All In Autos",

    // El número que va impreso en el emblema y en todas sus piezas. En modo
    // demo NO se usa: libs/demo.js lo corta para que un desconocido probando
    // la página no le escriba al negocio real.
    whatsapp: "12816928067",
    whatsappVisible: "+1 (281) 692-8067",

    instagram: "lonestarallinautos",
    instagramUrl: "https://www.instagram.com/lonestarallinautos/",

    // Una sola base: la oficina y el taller en Texas. Se deja como lista para
    // que el día que abran una segunda base baste con añadirla aquí.
    sedes: [
      {
        slug: "texas",
        nombre: "Texas",
        zona: "Texas, USA",
        estado: "Estados Unidos",
        direccion: "Texas, USA",
        telefono: "+1 (281) 692-8067",
        whatsapp: "12816928067",
        instagram: "lonestarallinautos",
        instagramUrl: "https://www.instagram.com/lonestarallinautos/",
        resumen:
          "Donde se puja, se recibe, se repara y se prepara la exportación de cada unidad.",
      },
    ],

    // A dónde mandan, tal como salen las banderas en su emblema. "Y toda
    // Latinoamérica" es literal: el emblema dice "Envíos a toda
    // Latinoamérica".
    destinos: [
      { slug: "venezuela", nombre: "Venezuela", bandera: "ve" },
      { slug: "panama", nombre: "Panamá", bandera: "pa" },
      { slug: "colombia", nombre: "Colombia", bandera: "co" },
    ],
    destinosNota: "y toda Latinoamérica",

    ciudad: "Texas",
    estado: "Texas",
    pais: "US",
    direccion: "Texas, USA",
    direccionLarga: "Texas, USA · envíos a toda Latinoamérica",
    horario: "Atención por WhatsApp y DM",

    // La frase del emblema, y la que manda en la portada.
    tagline: "Tu vehículo, nuestro compromiso",
    lema: "Compramos · Reparamos · Exportamos",
    // El remate de la pieza del Corolla.
    remate: "USA → tu país, en manos de expertos",

    // Los tres verbos del emblema, con lo que cada uno quiere decir en sus
    // publicaciones.
    servicios: [
      {
        slug: "compramos",
        titulo: "Compramos",
        detalle:
          "Pujamos por ti en las subastas de Estados Unidos: buscamos, revisamos el reporte y pujamos con estrategia para llegar al mejor precio.",
      },
      {
        slug: "reparamos",
        titulo: "Reparamos",
        detalle:
          "La unidad llega a nuestro taller en Texas y sale reparada y acondicionada, lista para viajar.",
      },
      {
        slug: "exportamos",
        titulo: "Exportamos",
        detalle:
          "Trámites, aduana y envío a tu país. Venezuela, Panamá, Colombia y toda Latinoamérica.",
      },
    ],

    // Lo que ofrecen alrededor de la subasta, palabra por palabra de su pieza
    // "¿Tienes dudas cómo funcionan las subastas?".
    subastas: [
      "Acceso a las mejores subastas de USA",
      "Búsqueda y selección del mejor vehículo para ti",
      "Pujas estratégicas para obtener el mejor precio",
      "Proceso 100 % transparente y confiable",
      "Transporte y exportación a Latinoamérica",
    ],

    // De su pieza "¿Quieres invertir en vehículos?".
    inversion: {
      titulo: "¿Quieres invertir en vehículos?",
      bajada: "Compra en subasta y obtén grandes ganancias",
      puntos: ["Mejores precios", "Alta demanda", "Inversión segura", "Gran rentabilidad"],
    },

    // De su pieza "FAQ · Métodos de pago".
    pagos: {
      nota: "Todos los pagos deben realizarse en USD.",
      metodos: [
        {
          slug: "zelle",
          nombre: "Zelle",
          detalle: "Rápido, seguro y directo desde tu banco. Ideal para pagos en USD.",
          sellos: ["Rápido", "Seguro", "Confiable"],
        },
        {
          slug: "ach",
          nombre: "ACH",
          detalle: "Transferencia electrónica entre cuentas bancarias en USA. Segura y con tarifas bajas.",
          sellos: ["Seguro", "Confiable", "Económico"],
        },
        {
          slug: "wire",
          nombre: "Transferencia wire",
          detalle: "Transferencias internacionales rápidas y seguras. Ideal para pagos grandes.",
          sellos: ["Rápido", "Seguro", "Global"],
        },
        {
          slug: "efectivo",
          nombre: "Efectivo",
          detalle: "En nuestras oficinas. Consulta los detalles con nuestro equipo.",
          sellos: ["Seguro", "Directo", "Confiable"],
        },
        {
          slug: "cripto",
          nombre: "Monedas electrónicas",
          detalle: "USDT (TRC20), Cash App, PayPal y otras. Rápido, seguro y conveniente.",
          sellos: ["Rápido", "Moderno", "Seguro"],
        },
      ],
    },

    // Las marcas que salen en sus piezas. Por ahora todas son Toyota: el
    // emblema pone una Tundra, una RAV4 y un Camry, y las publicaciones son de
    // una Tacoma y dos Corolla.
    marcasQueMueven: ["Toyota"],
  },

  // Cómo se trae un vehículo, tal como lo dibujan en la pieza del Corolla:
  // cinco pasos, de la subasta a tu país.
  compra: {
    pasos: [
      {
        titulo: "Compra en subasta",
        detalle:
          "Eliges la unidad —o nos dices qué buscas— y pujamos por ti en las subastas de Estados Unidos.",
      },
      {
        titulo: "Transporte",
        detalle: "Del patio de la subasta a nuestro taller en Texas.",
      },
      {
        titulo: "Reparación y acondicionamiento",
        detalle: "Se repara el daño que traiga y se prepara para el viaje.",
      },
      {
        titulo: "Trámites y aduanas",
        detalle: "Papeles de exportación y aduana, de nuestro lado.",
      },
      {
        titulo: "Envío a tu país",
        detalle: "Sale en barco hacia Venezuela, Panamá, Colombia o el país que nos digas.",
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
  // Esta página se le enseña a Lone Star antes de vendérsela. Con el modo demo
  // activo se ve casi todo, pero no se puede USAR: hay que pasar una puerta con
  // contraseña, el inventario se corta a mitad y el contacto no sale hacia
  // ningún teléfono real.
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

    // Lo que se lleva quien lo compre. Sale en la puerta y en el bloque de
    // venta.
    incluye: [
      "Tus lotes en subasta con millas, daño primario y Run & Drive a la vista",
      "Los modelos que traes a pedido, con su precio desde",
      "Ficha propia por unidad, con su enlace listo para el post o el estado",
      "Los cinco pasos de la subasta a su país, explicados sin DM",
      "Tus métodos de pago en USD, en una sola página",
      "Botón de WhatsApp que llega con la unidad ya escrita en el mensaje",
      "Buscador por tipo, estado, marca, año y precio",
      "Tu estrella, tu rojo y tu puerto: la gráfica de tus publicaciones",
      "Dominio propio, el código es tuyo y no hay mensualidad",
    ],
  },
};

export default config;
