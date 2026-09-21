// -----------------------------------------------------------------------------
// Configuración de SUSU CARS.
//
// Los datos salen de su propio material:
//
//   · El logotipo (public/marca/susu-logo.jpg), que es lo que manda en toda la
//     página: el trazo de un deportivo dibujado de una línea, "SUSU" en
//     capitales romanas y "CARS" espaciado debajo, todo en oro sobre negro.
//
//   · Su publicación de @susucars, de donde salen el discurso y los datos:
//
//       "SUSUCARS — Vende tu vehículo en tiempo récord y con seguridad.
//        ¡Olvídate de complicaciones!
//        · Consignaciones (Sede Caracas, Av. Casanova)
//        · Seguridad garantizada (máxima exposición y contacto)
//        · Venta rápida (conectamos con el comprador ideal)
//        ¡Contáctanos! 0412 133 5486 · @susucars · @susucarsoficial"
//
// El eje del negocio NO es el de un concesionario que importa: es la
// CONSIGNACIÓN. Ellos no te venden un carro, te venden el vender el tuyo sin
// complicaciones. Por eso la web tiene dos entradas —el que viene a comprar y
// el que viene a dejar su vehículo— y no una sola.
//
// PENDIENTE (antes de entregarla):
//   · `whatsapp` — el número se leyó de una captura de 283 px y no se da por
//     bueno hasta que el cliente lo confirme. Ver el comentario de abajo.
//   · `seguidores` / `publicaciones` — Instagram estaba limitando las
//     peticiones cuando se montó esto; las cifras se rellenan al leer el
//     perfil con tools/instagram.
//   · `domainName` / `siteUrl` — no tienen dominio propio todavía.
//   · El catálogo de data/vehiculos.json es DE MUESTRA. Ver el README.
// -----------------------------------------------------------------------------

const config = {
  appName: "SUSU CARS",
  appDescription:
    "Compra, venta y consignación de vehículos en Caracas. Publicamos tu vehículo, lo exponemos y lo conectamos con el comprador ideal. SUSU CARS, Av. Casanova.",
  domainName: "susucars.com",
  siteUrl:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : process.env.SITE_URL || "https://susucars.com",

  crisp: {
    id: "",
    onlyShowOnRoutes: ["/"],
  },

  resend: {
    fromNoReply: `SUSU CARS <noreply@susucars.com>`,
    fromAdmin: `SUSU CARS <contacto@susucars.com>`,
    supportEmail: "",
  },

  colors: {
    // Tema único oscuro, definido en app/globals.css.
    theme: "susu",
    // El oro del logotipo. Cambiarlo también en --color-primary de globals.css.
    main: "#C9A24A",
  },

  business: {
    nombre: "SUSU CARS",
    razonSocial: "SUSU CARS",
    // PENDIENTE DE CONFIRMAR. En su publicación se lee "0412 133 5486", que en
    // formato internacional sería 584121335486, pero la captura de la que se
    // sacó tiene 283 px de ancho y un dígito mal transcrito manda a un
    // desconocido al teléfono de otra persona. Mientras esté vacío, los
    // botones caen al DM de Instagram, que es por donde hoy entra todo el
    // mundo. Se rellena en cuanto el cliente lo diga en voz alta.
    whatsapp: "",
    whatsappVisible: "",
    instagram: "susucars",
    instagramUrl: "https://www.instagram.com/susucars/",
    // La segunda cuenta que anuncian en la misma publicación.
    instagramSecundario: "susucarsoficial",
    // Vacíos hasta leer el perfil: una cifra inventada en la portada de un
    // cliente se descubre en la primera reunión. La portada los omite sola.
    seguidores: "",
    publicaciones: "",
    ciudad: "Caracas",
    estado: "Distrito Capital",
    direccion: "Avenida Casanova",
    direccionLarga: "Avenida Casanova, Caracas",
    horario: "Lunes a sábado · atención en la sede y por WhatsApp",
    // Las dos frases de su publicación. La primera es el titular de la
    // portada; la segunda, la promesa.
    tagline: "Vende tu vehículo en tiempo récord y con seguridad",
    lema: "Olvídate de complicaciones",
    servicios: ["Consignaciones", "Seguridad garantizada", "Venta rápida"],
  },

  // -----------------------------------------------------------------------
  // Consignar: lo que de verdad vende esta casa.
  //
  // Los tres puntos son suyos, de su publicación, con el paréntesis que cada
  // uno lleva al lado. Lo único añadido es el desarrollo de cada uno, que en
  // una imagen de Instagram no cabe y en una web sí.
  // -----------------------------------------------------------------------
  consignacion: {
    titular: "Deja tu vehículo con nosotros",
    pilares: [
      {
        titulo: "Consignaciones",
        apunte: "Sede Caracas, Av. Casanova",
        detalle:
          "Tú traes el vehículo, nosotros lo recibimos, lo fotografiamos y lo publicamos. No adelantas nada y sigue siendo tuyo hasta que se venda.",
      },
      {
        titulo: "Seguridad garantizada",
        apunte: "Máxima exposición y contacto",
        detalle:
          "Filtramos a quien escribe, atendemos las visitas y acompañamos el traspaso. No tienes que darle tu teléfono a un desconocido ni recibir gente en tu casa.",
      },
      {
        titulo: "Venta rápida",
        apunte: "Conectamos con el comprador ideal",
        detalle:
          "Tu vehículo entra en el catálogo con su ficha, su precio y su enlace propio, y sale en cada publicación hasta que se vende.",
      },
    ],
  },

  // Cómo se cierra una compra. Es el recorrido que hoy se hace entre el
  // Instagram, el WhatsApp y la sede, puesto por escrito.
  compra: {
    pasos: [
      {
        titulo: "Eliges el vehículo",
        detalle:
          "Cada ficha lleva año, kilometraje, motor y papeles. Sabes a qué atenerte antes de escribir.",
      },
      {
        titulo: "Lo ves en la sede",
        detalle:
          "Avenida Casanova, Caracas. Se prueba, se revisa y se lleva al taller de tu confianza.",
      },
      {
        titulo: "Se cierra el trato",
        detalle:
          "Acompañamos el pago y el traspaso hasta que el vehículo queda a tu nombre. Esa es la parte que aquí no se improvisa.",
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
  // Esta página se le enseña al dueño de SUSU CARS antes de vendérsela. Con el
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
      "Tu catálogo completo en la web, con ficha propia para cada vehículo",
      "Formulario de consignación: quien quiere dejar su carro te llega con los datos ya escritos",
      "Buscador con filtros por tipo, marca, año y precio",
      "Cada vehículo se comparte con su enlace directo, listo para el post",
      "Botón de WhatsApp que llega con el vehículo ya escrito en el mensaje",
      "Precio en dólares con su equivalente en bolívares a la tasa del BCV",
      "Diseño hecho a partir de tu logotipo: tu oro, tu negro, tu trazo",
      "Dominio propio, el código es tuyo y no hay mensualidad",
    ],
  },
};

export default config;
