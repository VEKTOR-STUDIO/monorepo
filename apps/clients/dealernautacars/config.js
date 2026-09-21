// -----------------------------------------------------------------------------
// Configuración de DealerNauta Cars.
//
// Todo lo de aquí sale de sus DOS cuentas de Instagram, que es lo único que
// mandó el cliente:
//
//   · @dealernautacars (68,4 mil seguidores, 1.107 publicaciones)
//       "Concesionario | Venta | Compra | Consignación | Camiones"
//       "Camiones usados y nuevos · N.º 1 en venta de camiones a nivel
//        nacional · San Antonio de los Altos - Miranda"
//       Enlace de la bio: wa.me/584142097517
//
//   · @dealernautacarsccs — la sede de Caracas, Los Chaguaramos.
//       Sus publicaciones repiten tres frases: "Tu dealer de vehículos y
//       camiones", "Tu vehículo soñado convertido en realidad" y "+6 años
//       siendo el N.º 1 en el mercado". Contacto: 0424-1388112.
//
// La gráfica de la casa es la de esas publicaciones y la del logotipo:
// NARANJA sobre NEGRO, con la plata del emblema como tercer color; cielo
// naranja degradado, el perfil de la ciudad recortado al fondo, asfalto abajo
// y titulares en condensada muy pesada. El logo son dos alas cruzadas con el
// perfil de un deportivo dentro, así que la web usa arcos y no esquinas duras.
//
// PENDIENTE (antes de entregarla):
//   · `domainName` / `siteUrl` — no tienen dominio propio todavía.
//   · El correo que aparece en sus publicaciones no se lee bien en la captura;
//     hay que pedírselo antes de publicarlo.
//   · El inventario de data/vehiculos.json es EN PARTE de muestra y todos los
//     precios son de referencia: Instagram no deja leer las publicaciones una
//     a una. Ver data/vehiculos.json y el aviso de la portada.
//   · Las fotos: no hay ninguna. Cada ficha se dibuja con la plantilla de sus
//     propias publicaciones (components/PlantillaPublicacion.js) hasta que
//     carguen las suyas.
// -----------------------------------------------------------------------------

const config = {
  appName: "DealerNauta Cars",
  appDescription:
    "Concesionario en Caracas y San Antonio de los Altos: vehículos 0 km, usados en perfectas condiciones y camiones nuevos y usados. Venta, compra y consignación.",
  domainName: "dealernautacars.com",
  siteUrl:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : process.env.SITE_URL || "https://dealernautacars.com",

  crisp: {
    id: "",
    onlyShowOnRoutes: ["/"],
  },

  resend: {
    fromNoReply: `DealerNauta Cars <noreply@dealernautacars.com>`,
    fromAdmin: `DealerNauta Cars <contacto@dealernautacars.com>`,
    supportEmail: "",
  },

  colors: {
    // Tema único oscuro, definido en app/globals.css.
    theme: "dealernauta",
    // El naranja del emblema. Cambiarlo también en --color-primary de
    // globals.css.
    main: "#F07423",
  },

  business: {
    nombre: "DealerNauta Cars",
    razonSocial: "DealerNauta Cars",

    // El WhatsApp que ellos mismos publican en el enlace de la bio de
    // @dealernautacars. En modo demo NO se usa: libs/demo.js lo corta para que
    // un desconocido probando la página no le escriba al negocio real.
    whatsapp: "584142097517",
    whatsappVisible: "0414-2097517",

    // La cuenta grande manda; la de Caracas va como segunda.
    instagram: "dealernautacars",
    instagramUrl: "https://www.instagram.com/dealernautacars/",
    instagramCaracas: "dealernautacarsccs",
    instagramCaracasUrl: "https://www.instagram.com/dealernautacarsccs/",
    seguidores: "68,4 K",
    publicaciones: "1.107",

    // Dos sedes, y es lo que de verdad los distingue: una para vehículos en
    // Caracas y otra para camiones en los Altos mirandinos. Cada una tiene su
    // cuenta de Instagram y su teléfono, así que la web las separa igual.
    sedes: [
      {
        slug: "caracas",
        nombre: "Caracas",
        zona: "Los Chaguaramos",
        estado: "Distrito Capital",
        direccion: "Los Chaguaramos, Caracas",
        telefono: "0424-1388112",
        // Mismo número en formato internacional, para wa.me.
        whatsapp: "584241388112",
        instagram: "dealernautacarsccs",
        instagramUrl: "https://www.instagram.com/dealernautacarsccs/",
        resumen:
          "El salón de vehículos: 0 km recién llegados y usados en perfectas condiciones, revisados antes de salir a la venta.",
      },
      {
        slug: "san-antonio",
        nombre: "San Antonio de los Altos",
        zona: "San Antonio de los Altos",
        estado: "Miranda",
        direccion: "San Antonio de los Altos, Miranda",
        telefono: "0414-2097517",
        whatsapp: "584142097517",
        instagram: "dealernautacars",
        instagramUrl: "https://www.instagram.com/dealernautacars/",
        resumen:
          "La sede de camiones: unidades nuevas y usadas, el flanco con el que son el N.º 1 a nivel nacional.",
      },
    ],

    // Se conservan por compatibilidad con el esquema de SEO y el pie, que
    // necesitan una sola dirección. Apuntan a la sede principal.
    ciudad: "Caracas",
    estado: "Distrito Capital",
    direccion: "Los Chaguaramos, Caracas",
    direccionLarga: "Los Chaguaramos, Caracas · San Antonio de los Altos, Miranda",
    horario: "Lunes a sábado · atención en las dos sedes y por WhatsApp",

    // La frase que más repiten en sus publicaciones, y la que manda en la
    // portada.
    tagline: "Tu vehículo soñado convertido en realidad",
    lema: "Tu dealer de vehículos y camiones",
    // El sello que llevan impreso en casi todas las piezas.
    trayectoria: "+6 años siendo el N.º 1 en el mercado",
    // Lo que dice el arco del logotipo, palabra por palabra.
    arcoLogo: "Compra · Venta · Consignación",

    servicios: [
      "Venta de vehículos 0 km y usados",
      "Camiones nuevos y usados",
      "Compra de tu vehículo",
      "Consignación",
    ],

    // Las marcas que desfilan en la cabecera de sus publicaciones.
    marcasQueMueven: [
      "Toyota",
      "Chevrolet",
      "Ford",
      "Mitsubishi",
      "Mack",
      "Iveco",
      "Suzuki",
    ],
  },

  // Cómo se cierra una compra. Es el recorrido que hoy hacen entre el
  // Instagram, el WhatsApp y las dos sedes, puesto por escrito.
  compra: {
    pasos: [
      {
        titulo: "Eliges la unidad",
        detalle:
          "Cada ficha lleva año, kilometraje, motor y condición. Sabes si es 0 km, usado o camión antes de escribir.",
      },
      {
        titulo: "La ves en la sede",
        detalle:
          "Vehículos en Los Chaguaramos, Caracas. Camiones en San Antonio de los Altos. Se prueba, se revisa y se lleva al taller de tu confianza.",
      },
      {
        titulo: "Se cierra el trato",
        detalle:
          "Compra directa, parte de pago con tu vehículo o consignación. Acompañamiento en el traspaso hasta que quede a tu nombre.",
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
  // Esta página se le enseña a DealerNauta Cars antes de vendérsela. Con el
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

    // Cuántos vehículos se ven nítidos en /vehiculos antes del muro.
    elementosVisibles: 6,

    // Lo que se lleva quien lo compre. Sale en el bloque de venta.
    incluye: [
      "Tu inventario completo en la web, con ficha propia para cada unidad",
      "Vehículos y camiones separados, que es como vendes tú en tus dos cuentas",
      "Tus dos sedes con su teléfono y su Instagram, cada una en su sitio",
      "Buscador con filtros por tipo, condición, marca, año y precio",
      "Cada unidad se comparte con su enlace directo, listo para el post",
      "Botón de WhatsApp que llega con la unidad ya escrita en el mensaje",
      "Precio en dólares con su equivalente en bolívares a la tasa del BCV",
      "Diseño sacado de tus publicaciones: tu naranja, tu emblema, tu asfalto",
      "Dominio propio, el código es tuyo y no hay mensualidad",
    ],
  },
};

export default config;
