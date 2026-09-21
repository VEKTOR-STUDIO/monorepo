// -----------------------------------------------------------------------------
// Configuración de Kings Cars.
//
// Todo lo de aquí sale de lo único que hay del cliente: su cuenta de Instagram
// @kingscars.ccct y su foto de perfil.
//
//   · @kingscars.ccct — 902 publicaciones, 6.567 seguidores, 459 seguidos.
//       "KINGS CARS | CONCESIONARIO DE VEHÍCULOS - CARROS"
//       "¿Comprar o vender tu vehículo? Para eso estamos."
//       "Publica tu vehículo gratis."
//       "📍 Caracas | C.C.C.T"
//       "Previa cita. Agenda ⬇"
//       Categoría declarada: Concesionaria de automóviles. Facebook: KINGS CARS.
//       Destacadas: Clientes · Info · Ofertas · Detailing · Contacto · Ubicación.
//
// LA MARCA ES MONOCROMA. Su emblema —public/marca/kings-cars.jpg— es una corona
// geométrica BLANCA calada sobre una piedra oscura veteada, con "KING CARS"
// debajo en una tipografía cuadrada de esquinas biseladas y la "A" sustituida
// por el frente de un carro. No hay un solo color en el logotipo, así que la
// web tampoco lo inventa: blanco sobre pizarra.
//
// EL ROJO ES LO ÚNICO QUE SEÑALA. En sus piezas el rojo aparece contadas veces
// y siempre para apuntar: la palabra "CARRO" en el post de "¿vas a vender tu
// carro?", la aguja del velocímetro en la tarjeta de kilometraje. Aquí hace lo
// mismo: precio, condición y llamada a la acción. Nada más.
//
// LA FICHA DE CADA UNIDAD ES SUYA, no una invención: sus posts rematan la foto
// con un rótulo blanco —"TOYOTA COROLLA GLI / 2006"— y tres tarjetas blancas de
// esquinas redondeadas con Kilometraje, Transmisión y Precio $. Esa fila de
// tres es la pieza que más se repite en toda la cuenta y aquí es
// `.tarjeta-dato` (app/globals.css) y `components/PlantillaPublicacion.js`.
//
// PENDIENTE (antes de entregarla):
//   · `business.whatsapp` — NO SE SABE. Su bio manda a un enlace de agenda que
//     no se lee en la captura y en ninguna pieza publican un número. Mientras
//     esté vacío, los botones de contacto caen al DM de Instagram, que es el
//     canal que ellos mismos usan. Hay que pedírselo.
//   · `domainName` / `siteUrl` — no tienen dominio propio todavía.
//   · El correo: tampoco publican ninguno.
//   · El inventario de data/vehiculos.json es CASI TODO DE MUESTRA. Instagram
//     limitó las peticiones desde esta IP mientras se montaba la página, así
//     que solo se pudo leer UNA unidad suya de verdad (el Corolla GLI 2006, con
//     su kilometraje y su precio tal como los publica). Ver data/vehiculos.json
//     y el aviso de la portada.
//   · Las fotos: no hay ninguna suya. Cada ficha se dibuja con la plantilla de
//     sus propias publicaciones hasta que carguen las suyas.
// -----------------------------------------------------------------------------

const config = {
  appName: "Kings Cars",
  appDescription:
    "Concesionario de vehículos en el C.C.C.T., Caracas. Compra y venta de carros usados y nuevos, previa cita. Publica tu vehículo gratis: avalúo, fotos, promoción y seguimiento de venta.",
  domainName: "kingscars.com.ve",
  siteUrl:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : process.env.SITE_URL || "https://kingscars.com.ve",

  crisp: {
    id: "",
    onlyShowOnRoutes: ["/"],
  },

  resend: {
    fromNoReply: `Kings Cars <noreply@kingscars.com.ve>`,
    fromAdmin: `Kings Cars <contacto@kingscars.com.ve>`,
    supportEmail: "",
  },

  colors: {
    // Tema único oscuro, definido en app/globals.css.
    theme: "kingscars",
    // El rojo que señala. Cambiarlo también en --color-primary de globals.css.
    //
    // Ojo: NO es el color de la marca —la marca es blanca y no tiene color—,
    // es el color del acento. Lo lee `viewport.themeColor` y el navegador lo
    // usa para la barra del móvil, que es justo donde interesa que se vea algo
    // de la casa y no un gris.
    main: "#E11B2C",
  },

  business: {
    nombre: "Kings Cars",
    razonSocial: "Kings Cars",
    // Lo que dice el emblema, palabra por palabra, que no es lo mismo que el
    // nombre de la cuenta: el logotipo lleva "KING CARS" en singular.
    rotuloEmblema: "King Cars",

    // NO SE SABE. En ninguna de sus piezas ni en su bio aparece un número: la
    // bio manda a un enlace de agenda. Mientras esté vacío, libs/demo.js cae al
    // DM de Instagram, que es el canal por el que hoy los contactan de verdad.
    whatsapp: "",
    whatsappVisible: "",

    instagram: "kingscars.ccct",
    instagramUrl: "https://www.instagram.com/kingscars.ccct/",
    facebook: "KINGS CARS",
    seguidores: "6.567",
    publicaciones: "902",
    seguidos: "459",

    // Una sola sede, y muy concreta: el C.C.C.T. Es parte del nombre de la
    // cuenta, así que no es un dato de contacto cualquiera, es identidad.
    ciudad: "Caracas",
    estado: "Distrito Capital",
    centro: "C.C.C.T.",
    centroLargo: "Centro Comercial Ciudad Tamanaco",
    direccion: "C.C.C.T., Caracas",
    direccionLarga: "Centro Comercial Ciudad Tamanaco (C.C.C.T.), Chuao, Caracas",

    // Lo que más repiten y lo que gobierna cómo se pide una visita: aquí no se
    // cae de sorpresa.
    horario: "Previa cita · se agenda por Instagram",
    previaCita: true,

    // Las dos frases de su bio, tal cual.
    tagline: "¿Comprar o vender tu vehículo? Para eso estamos",
    lema: "Publica tu vehículo gratis",
    descriptor: "Concesionario de vehículos",

    // Lo que hacen por quien pone su carro a la venta con ellos, tal como lo
    // enumera su publicación fijada. Es GRATIS y es su mejor argumento, así que
    // la web lo trata como servicio principal y no como letra pequeña.
    publicarGratis: [
      {
        titulo: "Avalúo",
        detalle:
          "Te decimos en cuánto se vende de verdad tu vehículo hoy, no en cuánto te gustaría venderlo.",
      },
      {
        titulo: "Fotos y videos",
        detalle:
          "Lo fotografiamos y grabamos nosotros, con la gráfica de la casa. Es lo que hace que un anuncio se mire.",
      },
      {
        titulo: "Promoción",
        detalle:
          "Se publica y se promociona en nuestra cuenta, delante de los 6.567 que ya nos siguen.",
      },
      {
        titulo: "Seguimiento",
        detalle:
          "Atendemos a los interesados, filtramos y te acompañamos hasta que el trato se cierre.",
      },
    ],

    // Sus destacadas de Instagram, que son el índice de lo que ofrecen.
    servicios: [
      "Venta de vehículos usados y nuevos",
      "Compra de tu vehículo",
      "Publicación y venta en consignación, gratis",
      "Detailing",
    ],

    // Las marcas que hay HOY en data/vehiculos.json, que no es lo mismo que las
    // que ellos mueven: diecisiete de las dieciocho unidades son de muestra. Se
    // confirman al cargar el inventario real desde su Instagram.
    marcasQueMueven: [
      "Toyota",
      "Chevrolet",
      "Hyundai",
      "Kia",
      "Ford",
      "Jeep",
      "Mitsubishi",
      "Volkswagen",
      "Chery",
      "Changan",
    ],
  },

  // Cómo se cierra una compra. Es el recorrido que hoy hacen entre el Instagram
  // y la cita en el C.C.C.T., puesto por escrito.
  compra: {
    pasos: [
      {
        titulo: "Eliges la unidad",
        detalle:
          "Cada ficha lleva año, kilometraje, transmisión y precio, que es exactamente lo que dicen tus publicaciones. Se sabe todo antes de escribir.",
      },
      {
        titulo: "Agendas tu cita",
        detalle:
          "Aquí se atiende con cita previa. Se aparta la hora, la unidad está lista y no se pierde la mañana esperando.",
      },
      {
        titulo: "La ves en el C.C.C.T.",
        detalle:
          "Se prueba, se revisa y se puede llevar al taller de tu confianza. Después, compra directa, parte de pago con tu carro o consignación.",
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
  // Esta página se le enseña a Kings Cars antes de vendérsela. Con el modo demo
  // activo se ve casi todo, pero no se puede USAR: hay que pasar una puerta con
  // contraseña, el inventario se corta a mitad y ningún formulario sale hacia
  // ellos.
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
      "La ficha calcada de tus posts: rótulo, kilometraje, transmisión y precio",
      "Página de «publica tu vehículo gratis» con su formulario de avalúo",
      "Buscador con filtros por condición, carrocería, marca, año y precio",
      "Cada unidad se comparte con su enlace directo, listo para la historia",
      "Botón de contacto que llega con la unidad ya escrita en el mensaje",
      "Precio en dólares con su equivalente en bolívares a la tasa del BCV",
      "Diseño sacado de tu propia gráfica: tu corona, tu blanco, tu rojo",
      "Dominio propio, el código es tuyo y no hay mensualidad",
    ],
  },
};

export default config;
