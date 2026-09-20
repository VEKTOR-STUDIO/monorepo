// -----------------------------------------------------------------------------
// Configuración de HB Inversiones.
//
// Los datos salen de dos sitios, los dos del propio cliente:
//
//   · El Instagram @hb_inversiones_12 (10,2 mil seguidores, 423 publicaciones).
//     La bio dice, literalmente:
//
//       "IMPORTAMOS Y VENDEMOS EL AUTO DE TUS SUEÑOS 📍
//        «Visítanos para encontrar la mejor opción para ti». ✨
//        HB INVERSIONES C.A., Barquisimeto 3001"
//
//   · El «CATÁLOGO DE VEHÍCULOS HB» en PDF (13 fichas), de donde salen los
//     vehículos, sus fotos y la dirección del local.
//
// La gráfica de la casa es la de ese catálogo: rojo, negro y blanco cortados
// en diagonal, titulares en itálica condensada y las fotos siempre del
// vehículo entero, de tres cuartos y sobre el corte diagonal.
//
// PENDIENTE (antes de entregarla):
//   · `whatsapp` — hoy está vacío y los botones caen al DM de Instagram.
//   · `domainName` / `siteUrl` — no tienen dominio propio todavía; aquí hay
//     uno de trabajo.
//   · Los precios del catálogo son provisionales: el PDF no publica ninguno.
//     Ver data/vehiculos.json y el aviso de la portada.
// -----------------------------------------------------------------------------

const config = {
  appName: "HB Inversiones",
  appDescription:
    "Importación y venta de vehículos en Barquisimeto: 0 km financiados y usados verificados, con su ficha completa y precio a la vista. HB Inversiones C.A.",
  domainName: "hbinversiones.com",
  siteUrl:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : process.env.SITE_URL || "https://hbinversiones.com",

  crisp: {
    id: "",
    onlyShowOnRoutes: ["/"],
  },

  resend: {
    fromNoReply: `HB Inversiones <noreply@hbinversiones.com>`,
    fromAdmin: `HB Inversiones <contacto@hbinversiones.com>`,
    supportEmail: "",
  },

  colors: {
    // Tema único oscuro, definido en app/globals.css.
    theme: "hb",
    // El rojo del catálogo. Cambiarlo también en --color-primary de globals.css.
    main: "#E11019",
  },

  business: {
    nombre: "HB Inversiones",
    razonSocial: "HB Inversiones C.A.",
    // PENDIENTE: número real. Vacío → los botones llevan al DM de Instagram.
    whatsapp: "",
    whatsappVisible: "",
    instagram: "hb_inversiones_12",
    instagramUrl: "https://www.instagram.com/hb_inversiones_12/",
    seguidores: "10,2 K",
    publicaciones: "423",
    ciudad: "Barquisimeto",
    estado: "Lara",
    // Tal como aparece al pie de las trece fichas del catálogo.
    direccion: "Avenida Venezuela con calle 11 y 12",
    direccionLarga: "Avenida Venezuela con calle 11 y 12, Barquisimeto, Lara",
    horario: "Lunes a sábado · atención en el local y por WhatsApp",
    // La frase de la bio, que es la que manda en la portada.
    tagline: "Importamos y vendemos el auto de tus sueños",
    lema: "Visítanos para encontrar la mejor opción para ti",
    servicios: [
      "Importación de vehículos 0 km",
      "Venta de vehículos usados verificados",
      "Financiamiento",
    ],
  },

  // Cómo se cierra una compra. Es el recorrido que hoy se hace entre el
  // Instagram, el WhatsApp y el local, puesto por escrito.
  compra: {
    pasos: [
      {
        titulo: "Eliges el vehículo",
        detalle:
          "Cada ficha lleva año, kilometraje, motor y condición. Sabes si es 0 km importado o usado antes de escribir.",
      },
      {
        titulo: "Lo ves en el local",
        detalle:
          "Avenida Venezuela con calle 11 y 12, Barquisimeto. Se prueba, se revisa y se lleva al taller de tu confianza.",
      },
      {
        titulo: "Se cierra el trato",
        detalle:
          "De contado o financiado. Acompañamiento en el traspaso y los documentos hasta que quede a tu nombre.",
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
  // Esta página se le enseña al dueño de HB Inversiones antes de vendérsela.
  // Con el modo demo activo se ve casi todo, pero no se puede USAR: hay que
  // pasar una puerta con contraseña, el inventario se corta a mitad y el
  // contacto no sale hacia ningún teléfono real.
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
      "Tu catálogo completo en la web, con ficha propia para cada vehículo",
      "Separación entre 0 km importados y usados, que es como vendes tú",
      "Buscador con filtros por condición, tipo, marca, año y precio",
      "Cada vehículo se comparte con su enlace directo, listo para el post",
      "Botón de WhatsApp que llega con el vehículo ya escrito en el mensaje",
      "Precio en dólares con su equivalente en bolívares a la tasa del BCV",
      "Diseño hecho a partir de tu catálogo: tu rojo, tus diagonales, tu logo",
      "Dominio propio, el código es tuyo y no hay mensualidad",
    ],
  },
};

export default config;
