// -----------------------------------------------------------------------------
// Configuración de Veloce Autos.
//
// Todo lo de aquí sale de lo que ellos mismos publican. Tres fuentes:
//
//   · La BIO de @veloce.autos (222 mil seguidores, 2.391 publicaciones):
//
//       "🌐 Importación Directa • Dubái | Europa | China | USA
//        📍 Av. Los Mangos, La Florida (Showroom)
//        🏁 Autos nuevos y usados premium
//        👇 Cotiza con nosotros aquí
//        wa.me/584242671832"
//
//   · Su COMUNICADO fijado, que enumera los canales oficiales y advierte de
//     que no hacen sorteos y de que "no tenemos página web". De ahí salen la
//     sección de canales oficiales y, de paso, el argumento de venta entero.
//
//   · La FOTO DE PERFIL: la V alada, negra sobre blanco. Es toda la gráfica
//     que tienen y es suficiente —de ahí vienen el monocromo y el vértice que
//     manda en la página. Ver app/globals.css.
//
// PENDIENTE (antes de entregarla):
//   · `domainName` / `siteUrl` — no tienen dominio propio; aquí hay uno de
//     trabajo.
//   · Los vehículos de data/vehiculos.json son de MUESTRA mientras Instagram
//     no deje leer el perfil. Van marcados y la página lo dice en voz alta.
//     Ver README, sección «Cargar el inventario real».
// -----------------------------------------------------------------------------

const config = {
  appName: "Veloce Autos",
  appDescription:
    "Importación directa de vehículos desde Dubái, Europa, China y Estados Unidos. Autos nuevos y usados premium en Caracas, con showroom en La Florida y sede en Chacao.",
  domainName: "veloceautos.com",
  siteUrl:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : process.env.SITE_URL || "https://veloceautos.com",

  crisp: {
    id: "",
    onlyShowOnRoutes: ["/"],
  },

  resend: {
    fromNoReply: `Veloce Autos <noreply@veloceautos.com>`,
    fromAdmin: `Veloce Autos <contacto@veloceautos.com>`,
    supportEmail: "",
  },

  colors: {
    // Tema único oscuro, definido en app/globals.css.
    theme: "veloce",
    // El negro de la marca. Su logotipo no tiene ni un color: es negro sobre
    // blanco y nada más. Ver la nota del tema en globals.css.
    main: "#0A0A0B",
  },

  business: {
    nombre: "Veloce Autos",
    razonSocial: "Veloce Autos",
    // El WhatsApp corporativo que publican en la bio y en el comunicado.
    whatsapp: "584242671832",
    whatsappVisible: "+58 424-267-1832",
    instagram: "veloce.autos",
    instagramUrl: "https://www.instagram.com/veloce.autos/",
    tiktok: "veloceautosoficial",
    tiktokUrl: "https://www.tiktok.com/@veloceautosoficial",
    seguidores: "222 K",
    publicaciones: "2.391",
    ciudad: "Caracas",
    estado: "Distrito Capital",
    direccion: "Av. Los Mangos, La Florida",
    direccionLarga: "Av. Los Mangos, La Florida, Caracas",
    horario: "Showroom abierto de lunes a sábado · atención por WhatsApp todos los días",
    // La primera línea de su bio, que es la que manda en la portada.
    tagline: "Importación directa",
    lema: "Autos nuevos y usados premium",
    // Los cuatro orígenes de su bio, en el mismo orden en que los escriben.
    procedencias: ["Dubái", "Europa", "China", "USA"],
    servicios: [
      "Importación directa a pedido",
      "Autos nuevos y usados premium",
      "Entrega y trámite de documentos",
    ],

    // ---------------------------------------------------------------------------
    // Las dos sedes.
    //
    // Cada una tiene su propio Instagram, y eso no es un detalle: quien ve una
    // publicación de Chacao y escribe al de La Florida acaba rebotando. Aquí
    // cada vehículo lleva su sede y el filtro de inventario la usa.
    // ---------------------------------------------------------------------------
    sedes: [
      {
        slug: "la-florida",
        nombre: "Sede La Florida",
        corto: "La Florida",
        direccion: "Av. Los Mangos, La Florida",
        ciudad: "Caracas",
        instagram: "veloce.autos",
        instagramUrl: "https://www.instagram.com/veloce.autos/",
        nota: "El showroom que anuncian en la bio.",
      },
      {
        slug: "chacao",
        nombre: "Sede Chacao",
        corto: "Chacao",
        direccion: "Chacao",
        ciudad: "Caracas",
        instagram: "veloceautoschacao",
        instagramUrl: "https://www.instagram.com/veloceautoschacao/",
        nota: "La segunda sede, con su propia cuenta.",
      },
    ],

    // ---------------------------------------------------------------------------
    // Los canales oficiales, tal como los enumera su comunicado fijado.
    //
    // No es relleno: el comunicado existe porque alguien está usando su nombre
    // por ahí. Que la lista viva en la web —y no solo en una imagen que se
    // pierde a las tres publicaciones— es media solución al problema que ellos
    // mismos denunciaron.
    // ---------------------------------------------------------------------------
    canales: [
      {
        etiqueta: "Instagram · Sede Chacao",
        cuenta: "@veloceautoschacao",
        url: "https://www.instagram.com/veloceautoschacao/",
      },
      {
        etiqueta: "Instagram · Sede La Florida",
        cuenta: "@veloce.autos",
        url: "https://www.instagram.com/veloce.autos/",
      },
      {
        etiqueta: "TikTok",
        cuenta: "@veloceautosoficial",
        url: "https://www.tiktok.com/@veloceautosoficial",
      },
      {
        etiqueta: "WhatsApp corporativo",
        cuenta: "+58 424-267-1832",
        url: "https://wa.me/584242671832",
      },
    ],

    // Las dos advertencias del comunicado, resumidas. Se enseñan junto a los
    // canales porque solas no significan nada.
    avisos: [
      {
        titulo: "No hacemos sorteos",
        detalle:
          "Veloce Autos no organiza rifas, concursos ni dinámicas de premios. Si alguien te escribe diciendo que ganaste algo, no somos nosotros.",
      },
      {
        titulo: "Cuidado con los pagos",
        detalle:
          "No compartas datos personales ni códigos de confirmación, y no pagues a cuentas no autorizadas. Ante cualquier duda, verifica en el showroom o por los canales de esta lista.",
      },
    ],
  },

  // Cómo se compra aquí. Son los dos caminos de verdad de este negocio: lo que
  // ya está en el showroom y lo que se trae por encargo.
  compra: {
    pasos: [
      {
        titulo: "Eliges o encargas",
        detalle:
          "Si está en el showroom, lo ves hoy mismo. Si no, se encarga: se busca en Dubái, Europa, China o Estados Unidos con la versión y el color que quieras.",
      },
      {
        titulo: "Se cotiza cerrado",
        detalle:
          "Precio puesto en Venezuela, con flete, nacionalización y documentos incluidos en la cuenta. Sin sorpresas a mitad de camino.",
      },
      {
        titulo: "Se entrega",
        detalle:
          "Recibes la unidad en la sede de La Florida o en Chacao, con sus papeles en regla y el traspaso acompañado hasta que quede a tu nombre.",
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
  // Esta página se le enseña a Veloce Autos antes de vendérsela. Con el modo
  // demo activo se ve casi todo, pero no se puede USAR: hay que pasar una
  // puerta con contraseña, el inventario se corta a mitad y el contacto no
  // sale hacia ningún teléfono real.
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
    precio: "$449",
    // El precio de antes, que sale tachado al lado del de ahora. Vacío = no
    // se enseña ninguna rebaja.
    precioAnterior: "$740",
    precioNota: "Pago único · dominio, montaje y carga del inventario incluidos",

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

    // Lo que se lleva quien lo compre. Sale en el bloque de venta y, sobre
    // todo, en la puerta.
    //
    // Son OCHO y cada línea cabe en dos renglones a propósito. La puerta tiene
    // que caber en una pantalla sin scroll, y ahí esta lista es lo que más
    // crece: con nueve renglones, o con uno que se parta en tres, el botón de
    // entrar se va por debajo del pliegue en un portátil de 800 px. Está
    // medido, no supuesto. Si se añade una, hay que volver a medir.
    incluye: [
      "El enlace oficial para tu bio: una página, no un árbol de enlaces",
      "Tu inventario completo, con ficha propia por unidad",
      "Showroom y encargo separados, como vendes tú",
      "Filtro por procedencia: Dubái, Europa, China y USA",
      "Las dos sedes, cada una con su cuenta y su dirección",
      "Tus canales oficiales publicados, contra quien usa tu nombre",
      "WhatsApp que llega con la unidad ya escrita",
      "Dominio propio, el código es tuyo y sin mensualidad",
    ],
  },
};

export default config;
