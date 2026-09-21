// -----------------------------------------------------------------------------
// Configuración de Top Miami Cars.
//
// Lo que hay de ellos son DOS cosas, y nada más:
//
//   · Su logotipo (public/marca/unnamed.webp, el archivo tal cual llegó; la
//     web usa public/marca/top-miami-cars.webp, que es el mismo con el margen
//     transparente recortado).
//   · Su ficha de Google: "Top Miami Cars · Concesionario de automóviles
//     usados en Caracas, Venezuela · 1050 Av. Los Mangos, Caracas 1050,
//     Distrito Capital · +58 414-1198290 · 4,0 (1 opinión)".
//
// La gráfica de la casa sale entera del logotipo, porque es lo único gráfico
// que tienen publicado:
//
//   · FONDO BLANCO. El logo está hecho para blanco: "TOP MIAMI" va en blanco
//     con filete azul, y sobre un fondo oscuro la línea del carro desaparece.
//   · AZUL MARINO (#001478), que es el del filete, el de "CARS" y el de la
//     línea del deportivo.
//   · ACERO CEPILLADO, el del escudo: bandas de gris oscuro, plata y blanco.
//   · LA LETRA: ancha, pesada, de esquinas redondeadas, con filete y una sombra
//     gris dura caída abajo a la derecha. Russo One es la misma familia de
//     formas y es libre.
//   · EL ESCUDO y LA LÍNEA DEL CARRO, que son los dos gestos del emblema.
//
// PENDIENTE (antes de entregarla):
//   · `domainName` / `siteUrl` — no tienen dominio; el de aquí es un supuesto.
//   · El WhatsApp: el +58 414-1198290 es el teléfono de su ficha de Google. Es
//     un móvil, así que casi seguro atiende WhatsApp, pero hay que confirmarlo.
//   · Instagram: no mandaron ninguna cuenta y no se inventa una. Mientras
//     `instagram` esté vacío, la web no enseña ningún enlace a Instagram.
//   · El horario: Google dice "Agrega el horario completo", o sea que no lo
//     han cargado. Se deja vacío y la web no lo enseña.
//   · El lema y los textos de la portada son MÍOS, no suyos: no publican
//     ninguno. Se cambian aquí.
//   · El inventario de data/vehiculos.json es ENTERO de muestra y todos los
//     precios son de referencia. Ver el `_nota` de ese archivo y el README.
//   · Las fotos: no hay ninguna. Cada ficha se dibuja con su escudo y su línea
//     (components/PlantillaPublicacion.js) hasta que carguen las suyas.
// -----------------------------------------------------------------------------

const config = {
  appName: "Top Miami Cars",
  appDescription:
    "Concesionario de automóviles usados en Caracas: camionetas, sedanes y pick-ups revisados, cada uno con su ficha completa y su precio a la vista.",
  domainName: "topmiamicars.com",
  siteUrl:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : process.env.SITE_URL || "https://topmiamicars.com",

  crisp: {
    id: "",
    onlyShowOnRoutes: ["/"],
  },

  resend: {
    fromNoReply: `Top Miami Cars <noreply@topmiamicars.com>`,
    fromAdmin: `Top Miami Cars <contacto@topmiamicars.com>`,
    supportEmail: "",
  },

  colors: {
    // Tema único claro, definido en app/globals.css.
    theme: "topmiami",
    // El azul del filete y de "CARS". Cambiarlo también en --color-primary de
    // globals.css.
    main: "#001478",
  },

  business: {
    nombre: "Top Miami Cars",
    razonSocial: "Top Miami Cars",

    // El teléfono de su ficha de Google. En modo demo NO se usa: libs/demo.js
    // lo corta para que un desconocido probando la página no le escriba al
    // negocio real.
    whatsapp: "584141198290",
    whatsappVisible: "0414-1198290",
    telefonoInternacional: "+58 414-1198290",

    // No mandaron cuenta de Instagram. Vacío = la web no enseña el enlace.
    instagram: "",
    instagramUrl: "",

    // Una sola sede. Se deja como lista porque el resto del sitio —el botón de
    // WhatsApp, el esquema de SEO— pregunta "a qué sede le toca esta unidad", y
    // así el día que abran otra se añade aquí sin tocar nada más.
    sedes: [
      {
        slug: "caracas",
        nombre: "Caracas",
        zona: "Av. Los Mangos",
        estado: "Distrito Capital",
        direccion: "Av. Los Mangos, Caracas 1050",
        codigoPostal: "1050",
        telefono: "0414-1198290",
        // Mismo número en formato internacional, para wa.me.
        whatsapp: "584141198290",
        instagram: "",
        instagramUrl: "",
        resumen:
          "El salón de Top Miami Cars: los usados se ven, se prueban y se revisan aquí, con cita previa por WhatsApp.",
      },
    ],

    ciudad: "Caracas",
    estado: "Distrito Capital",
    direccion: "Av. Los Mangos, Caracas 1050",
    direccionLarga: "1050 Av. Los Mangos, Caracas 1050, Distrito Capital, Venezuela",
    // Google no tiene su horario cargado. Vacío = no se enseña.
    horario: "",

    // Cómo los describe Google, palabra por palabra.
    categoria: "Concesionario de automóviles usados",

    // Estos dos son míos: no publican lema. Se sustituyen por el suyo.
    tagline: "Usados top, listos para rodar",
    lema: "Tu concesionario de usados en Caracas",

    servicios: [
      "Venta de vehículos usados",
      "Recibimos tu carro en parte de pago",
      "Revisión mecánica antes de publicar",
      "Acompañamiento en el traspaso",
    ],
  },

  // Cómo se cierra una compra. Es el recorrido normal de un concesionario de
  // usados en Caracas, puesto por escrito; se ajusta con ellos.
  compra: {
    pasos: [
      {
        titulo: "Eliges la unidad",
        detalle:
          "Cada ficha lleva año, kilometraje, motor y transmisión. Sabes qué estás viendo antes de escribir.",
      },
      {
        titulo: "La ves en el salón",
        detalle:
          "En la Av. Los Mangos, Caracas. Se prueba, se revisa y se lleva al taller de tu confianza.",
      },
      {
        titulo: "Se cierra el trato",
        detalle:
          "Compra directa o con tu carro en parte de pago. Acompañamiento en el traspaso hasta que quede a tu nombre.",
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
  // Esta página se le enseña a Top Miami Cars antes de vendérsela. Con el
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
      "Camionetas, sedanes y pick-ups separados, que es como pregunta la gente",
      "Buscador con filtros por carrocería, marca, año y precio",
      "Cada unidad se comparte con su enlace directo, listo para WhatsApp",
      "Botón de WhatsApp que llega con la unidad ya escrita en el mensaje",
      "Precio en dólares con su equivalente en bolívares a la tasa del BCV",
      "Panel para subir, cambiar precios y marcar vendidos desde el teléfono",
      "Diseño sacado de tu logo: tu azul, tu escudo de acero, tu letra",
      "Dominio propio, el código es tuyo y no hay mensualidad",
    ],
  },
};

export default config;
