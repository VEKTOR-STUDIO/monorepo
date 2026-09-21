// -----------------------------------------------------------------------------
// Configuración de DSS Import & Export.
//
// Todo lo de aquí sale de su Instagram, @somosdss (43,2 mil seguidores, 141
// publicaciones), que es lo único que hay del cliente. Las capturas están en
// docs/fuentes/.
//
// ESTE NEGOCIO NO ES UN CONCESIONARIO. Es una financiadora: vende el ACCESO a
// un vehículo o a una moto en cuotas, no el vehículo al contado. Su bio lo dice
// entero —"Planes de créditos para vehículos y motos"— y sus publicaciones no
// anuncian nunca un precio de venta: anuncian una CUOTA.
//
//     "ADQUIERE UN CHEVROLET OPTRA 2009-2011 · CUOTAS DESDE 75 SEMANALES"
//     "ADQUIERE UNA TORO POWER TP180 · LLÉVALA FINANCIADA · DESDE 75$ MENSUAL"
//     "OBTÉN TU VEHÍCULO CON 50% DE INICIAL · ENTREGA SEMANAL"
//     "¡Financiamiento de 2 años! Pagando en cómodas cuotas"
//
// Por eso la web entera antepone la cuota al precio, y el primer corte del
// catálogo es VEHÍCULOS contra MOTOS —los dos productos de su bio— y no la
// condición ni la carrocería.
//
// Una nota de redacción: sus piezas escriben "COUTAS" y "comodas". Aquí se
// escribe "cuotas" y "cómodas". Reproducir la errata de un cliente en su propia
// web no es fidelidad, es copiarle un fallo que él no eligió.
//
// La gráfica es la de sus publicaciones y la de su logotipo: ORO sobre NEGRO.
// Cielo dorado degradado, el perfil de la ciudad recortado al fondo, la unidad
// posada encima y los titulares en condensada muy pesada. El logotipo es un
// sello circular de pan de oro con el monograma S/D calado en negro, así que la
// web usa círculos y pastillas redondas, no esquinas duras.
//
// PENDIENTE (antes de entregarla):
//   · `domainName` / `siteUrl` — no tienen dominio propio todavía.
//   · El WhatsApp: su bio enlaza a beacons.ai/dssimport, que es un índice de
//     enlaces, y el número no se lee en ninguna captura. HAY QUE PEDIRLO.
//   · La dirección exacta de la oficina: sus piezas dicen "contamos con oficina
//     física" y la bio dice Maracay, pero la calle no la publican.
//   · El inventario de data/catalogo.json es EN PARTE de muestra. Ver su
//     `_nota` y el aviso de la portada.
//   · Las fotos: no hay ninguna suya. Instagram limitó las peticiones desde
//     esta IP mientras se hacía la página (tools/instagram), así que cada ficha
//     se dibuja con la plantilla de sus propias publicaciones
//     (components/PlantillaPublicacion.js) hasta que se puedan bajar.
// -----------------------------------------------------------------------------

const config = {
  appName: "DSS Import & Export",
  appDescription:
    "Planes de crédito para vehículos y motos en Maracay, estado Aragua. Cuotas desde 75$ semanales, financiamiento a 2 años y cuotas que se adaptan a tu presupuesto.",
  domainName: "dssimport.com",
  siteUrl:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : process.env.SITE_URL || "https://dssimport.com",

  crisp: {
    id: "",
    onlyShowOnRoutes: ["/"],
  },

  resend: {
    fromNoReply: `DSS Import & Export <noreply@dssimport.com>`,
    fromAdmin: `DSS Import & Export <contacto@dssimport.com>`,
    supportEmail: "",
  },

  colors: {
    // Tema único oscuro, definido en app/globals.css.
    theme: "dss",
    // El oro del sello. Cambiarlo también en --color-primary de globals.css.
    main: "#D9A72C",
  },

  business: {
    nombre: "DSS Import & Export",
    razonSocial: "DSS Import Export, C.A.",

    // PENDIENTE: no publican el número. La bio lleva a beacons.ai/dssimport y
    // de ahí no se puede leer sin abrirlo. Mientras esté vacío, los botones de
    // contacto caen al DM de Instagram, que sí es suyo y sí está publicado.
    whatsapp: "",
    whatsappVisible: "",

    instagram: "somosdss",
    instagramUrl: "https://www.instagram.com/somosdss/",
    enlaces: "https://beacons.ai/dssimport",
    seguidores: "43,2 K",
    publicaciones: "141",

    // Una sola oficina, y ellos la usan como argumento de venta: "contamos con
    // oficina física" es una de sus tres razones. En un negocio de crédito eso
    // no es un detalle de contacto, es la prueba de que existen.
    ciudad: "Maracay",
    estado: "Aragua",
    direccion: "Maracay, estado Aragua",
    direccionLarga: "Oficina física en Maracay, estado Aragua",
    // PENDIENTE: la calle exacta no la publican.
    oficina: "Maracay, estado Aragua",
    horario: "Lunes a viernes · atención también por Instagram y WhatsApp",

    // La frase de su bio, y la que manda en la portada. Ellos la escriben con
    // "Movimiento" en mayúscula; aquí va como frase normal.
    tagline: "Confianza y seguridad en movimiento",
    lema: "Planes de crédito para vehículos y motos",
    // Lo que repiten en casi todas las piezas.
    trayectoria: "Financiamiento de 2 años",
    // Lo que dice el arco de su sello, palabra por palabra.
    arcoLogo: "Import & Export",

    servicios: [
      "Crédito para vehículos",
      "Crédito para motos",
      "Cuotas semanales y mensuales",
      "Financiamiento hasta 2 años",
    ],

    // Las marcas que aparecen en sus publicaciones. No es una lista de deseos:
    // son las que se les han visto entregadas o anunciadas.
    marcasQueMueven: [
      "Chevrolet",
      "Dodge",
      "Toro Power",
      "Empire Keeway",
      "Bera",
      "Toyota",
    ],

    // Las tres razones que ellos mismos publican, tal cual, en la pieza
    // "3 RAZONES PARA SER NUESTRO BENEFICIADO". Van en la portada porque es su
    // propio argumentario y no uno inventado aquí.
    razones: [
      {
        titulo: "Cuotas que se adaptan",
        detalle:
          "Las cuotas se ajustan a tu presupuesto, no al revés. Se arma el plan con lo que puedes pagar cada semana o cada mes.",
      },
      {
        titulo: "Oficina física",
        detalle:
          "No es un perfil y un número: hay una oficina en Maracay donde se firma, se pregunta y se hace seguimiento del crédito.",
      },
      {
        titulo: "Solicitudes atendidas",
        detalle:
          "Un equipo joven pendiente de cada solicitud, para que nadie se quede esperando una respuesta que no llega.",
      },
    ],
  },

  // Las condiciones del crédito, en un solo sitio. Las usan la portada, las
  // fichas y el simulador de cuota: si mañana cambian el plazo o la inicial, se
  // cambia aquí y la página entera se entera.
  credito: {
    plazoMesesMax: 24,
    // "¡Financiamiento de 2 años!" es el sello de casi todas sus piezas.
    plazoTexto: "Hasta 2 años",
    // "OBTÉN TU VEHÍCULO CON 50% DE INICIAL".
    inicialPct: 50,
    // La cuota más baja que anuncian, y el gancho de la portada.
    cuotaDesde: 75,
    cuotaDesdePeriodo: "semanal",
    // La de las motos, que va por mes.
    cuotaMotoDesde: 65,
    cuotaMotoDesdePeriodo: "mensual",
  },

  // Cómo se saca un crédito. Es el recorrido que hoy hacen entre el Instagram,
  // el WhatsApp y la oficina, puesto por escrito.
  compra: {
    pasos: [
      {
        titulo: "Eliges la unidad",
        detalle:
          "Cada ficha lleva la cuota, la inicial y el plazo antes que nada. Sabes lo que vas a pagar por semana antes de escribir.",
      },
      {
        titulo: "Armamos tu plan",
        detalle:
          "Se ajusta la inicial y el plazo hasta que la cuota entre en tu presupuesto. Hasta 2 años, semanal o mensual.",
      },
      {
        titulo: "Firmas y te la llevas",
        detalle:
          "Se firma en la oficina de Maracay y la unidad sale contigo. El seguimiento del crédito se hace con el mismo equipo.",
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
  // Esta página se le enseña a DSS antes de vendérsela. Con el modo demo activo
  // se ve casi todo, pero no se puede USAR: hay que pasar una puerta con
  // contraseña, el catálogo se corta a mitad y el contacto no sale hacia ningún
  // sitio real.
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
    // El precio de antes, que sale tachado al lado del de ahora. Vacío = no se
    // enseña ninguna rebaja.
    precioAnterior: "$740",
    precioNota: "Pago único · dominio, montaje y carga del catálogo incluidos",

    // Hasta cuándo vale el precio rebajado. Es una FECHA REAL, no una cuenta
    // atrás que se reinicia en cada visita: eso último es un truco de tienda
    // barata y quien está evaluando comprar un sistema lo detecta recargando.
    //
    // Cuando la fecha pasa, el contador desaparece solo y el precio se queda
    // sin rebaja. Para alargar la oferta, se mueve esta fecha.
    ofertaHasta: "2026-10-15T23:59:59-04:00",
    // A dónde va el botón de comprar. Mientras esté vacío, los botones llevan a
    // /contacto en vez de a un enlace roto.
    urlCompra: "",
    textoBoton: "Quiero esta página",

    // Cuántas unidades se ven nítidas en /catalogo antes del muro.
    elementosVisibles: 6,

    // Lo que se lleva quien lo compre. Sale en el bloque de venta y en la
    // puerta.
    incluye: [
      "Todo tu catálogo en la web, con ficha propia para cada unidad",
      "La cuota primero, como en tus piezas: semanal o mensual, no el precio",
      "Vehículos y motos separados, que es como vendes tú",
      "Simulador de cuota: el cliente mueve la inicial y ve lo que pagaría",
      "Buscador con filtros por tipo, marca, año y cuota máxima",
      "Cada unidad se comparte con su enlace directo, listo para el post",
      "Botón de WhatsApp que llega con la unidad ya escrita en el mensaje",
      "Formulario de solicitud de crédito que te llega ordenado",
      "Diseño sacado de tus publicaciones: tu oro, tu sello, tu ciudad",
      "Dominio propio, el código es tuyo y no hay mensualidad",
    ],
  },
};

export default config;
