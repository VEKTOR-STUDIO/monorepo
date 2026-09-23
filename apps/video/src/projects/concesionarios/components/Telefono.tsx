import React from "react";
import { Img, interpolate, staticFile } from "remotion";
import { FAMILIAS } from "../fonts";
import { INVENTARIO } from "../inventario";
import type { Tipo, Unidad } from "../types";
import { alfa } from "./Fondo";
import { LogoMini } from "./Logo";
import { Silueta } from "./Silueta";
import { dolares, useMarca } from "./Tipos";

const WHATSAPP = "#25D366";

const NOMBRE_TIPO: Record<Tipo, string> = {
  suv: "Camionetas",
  sedan: "Sedanes",
  pickup: "Pick-ups",
  camion: "Camiones",
  furgon: "Furgonetas",
  moto: "Motos",
};

const SINGULAR: Record<Tipo, string> = {
  suv: "Camioneta",
  sedan: "Sedán",
  pickup: "Pick-up",
  camion: "Camión",
  furgon: "Furgoneta",
  moto: "Moto",
};

export type TelefonoProps = {
  /** Alto del aparato en px. El ancho sale solo (proporción de un móvil). */
  alto: number;
  /** 0 → portada; 1 → la rejilla del inventario. */
  scroll: number;
  /** 0 → cerrada; 1 → la ficha de la primera unidad, encima de todo. */
  ficha: number;
  /** Pulso del botón de WhatsApp de la ficha, 0–1. */
  pulso?: number;
  /** Índice del filtro activo (0 = Todos). */
  filtro?: number;
  /** Toque sobre la primera tarjeta (onda), 0–1. */
  toque?: number;
  style?: React.CSSProperties;
};

/**
 * La web del cliente, dentro de un teléfono. No es una captura: se dibuja con
 * sus colores, su tipografía de titulares, su logo y sus unidades, así que cada
 * video enseña SU página y no una plantilla.
 *
 * Todo se mide en `p` = 1% del ancho de la pantalla del teléfono.
 */
export const Telefono: React.FC<TelefonoProps> = ({
  alto,
  scroll,
  ficha,
  pulso = 0,
  filtro = 0,
  toque = 0,
  style,
}) => {
  const marca = useMarca();
  const { colores, display, claro } = marca;
  const unidades = INVENTARIO[marca.id] ?? [];

  const ancho = alto * 0.49;
  const bisel = ancho * 0.035;
  const pantallaAncho = ancho - bisel * 2;
  const pantallaAlto = alto - bisel * 2;
  const p = pantallaAncho / 100;

  const titulo: React.CSSProperties = {
    fontFamily: `"${display.family}", sans-serif`,
    fontWeight: display.weight,
    fontStyle: display.italic ? "italic" : "normal",
    letterSpacing: display.tracking,
    textTransform: "uppercase",
    lineHeight: 1,
  };
  const cuerpo: React.CSSProperties = { fontFamily: `"${FAMILIAS.questrial}", sans-serif` };

  const tipos = Array.from(new Set(unidades.map((u) => u.tipo))).slice(0, 3);
  const filtros = ["Todos", ...tipos.map((t) => NOMBRE_TIPO[t])];

  // Recorrido del contenido: de la portada a la rejilla.
  const desplazamiento = scroll * 78 * p;

  return (
    <div
      style={{
        width: ancho,
        height: alto,
        borderRadius: ancho * 0.13,
        padding: bisel,
        background: "linear-gradient(145deg, #3a3b3f, #0c0c0e 40%, #1b1c1f)",
        boxShadow: `0 ${alto * 0.04}px ${alto * 0.09}px rgba(0,0,0,${claro ? 0.28 : 0.6}), 0 0 0 ${bisel * 0.18}px #55575c inset`,
        ...style,
      }}
    >
      <div
        style={{
          position: "relative",
          width: pantallaAncho,
          height: pantallaAlto,
          borderRadius: ancho * 0.1,
          overflow: "hidden",
          backgroundColor: colores.fondo,
          color: colores.tinta,
        }}
      >
        {/* ——— Contenido que se desplaza ——— */}
        <div style={{ position: "absolute", inset: 0, transform: `translateY(${-desplazamiento}px)` }}>
          {/* Cabecera */}
          <div
            style={{
              height: 26 * p,
              paddingTop: 12 * p,
              paddingInline: 5 * p,
              display: "flex",
              alignItems: "center",
              gap: 3 * p,
              borderBottom: `${0.3 * p}px solid ${colores.linea}`,
            }}
          >
            <LogoMini px={9 * p} />
            <div style={{ ...titulo, fontSize: 4.4 * p, flex: 1, whiteSpace: "nowrap", overflow: "hidden" }}>
              {marca.nombreCorto ?? marca.nombre}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 1.1 * p }}>
              {[0, 1, 2].map((i) => (
                <div key={i} style={{ width: 5.5 * p, height: 0.7 * p, borderRadius: p, backgroundColor: colores.tinta }} />
              ))}
            </div>
          </div>

          {/* Portada */}
          <div
            style={{
              height: 80 * p,
              paddingInline: 6 * p,
              paddingTop: 9 * p,
              background: `radial-gradient(ellipse at 70% 20%, ${alfa(colores.primario, claro ? 0.12 : 0.28)}, transparent 65%)`,
            }}
          >
            <div style={{ ...cuerpo, fontSize: 2.8 * p, color: colores.primario, letterSpacing: "0.2em", textTransform: "uppercase" }}>
              {marca.ciudad}
            </div>
            <div style={{ ...titulo, fontSize: 9.4 * p, marginTop: 3 * p, lineHeight: 1.02 }}>
              {marca.tagline}
            </div>
            <div
              style={{
                ...cuerpo,
                display: "inline-block",
                marginTop: 6 * p,
                padding: `${2.6 * p}px ${6 * p}px`,
                borderRadius: 1.6 * p,
                backgroundColor: colores.primario,
                color: colores.sobrePrimario,
                fontSize: 3.6 * p,
                fontWeight: 700,
              }}
            >
              Ver inventario →
            </div>
          </div>

          {/* Filtros */}
          <div style={{ paddingInline: 5 * p, marginTop: 2 * p }}>
            <div style={{ ...titulo, fontSize: 5.4 * p, marginBottom: 3 * p }}>Inventario</div>
            <div style={{ display: "flex", gap: 2 * p, flexWrap: "nowrap" }}>
              {filtros.map((f, i) => (
                <div
                  key={f}
                  style={{
                    ...cuerpo,
                    fontSize: 2.9 * p,
                    padding: `${1.6 * p}px ${3.4 * p}px`,
                    borderRadius: 10 * p,
                    whiteSpace: "nowrap",
                    border: `${0.3 * p}px solid ${i === filtro ? colores.primario : colores.linea}`,
                    backgroundColor: i === filtro ? colores.primario : "transparent",
                    color: i === filtro ? colores.sobrePrimario : colores.humo,
                  }}
                >
                  {f}
                </div>
              ))}
            </div>
          </div>

          {/* Rejilla */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 3 * p,
              padding: `${4 * p}px ${5 * p}px`,
            }}
          >
            {unidades.map((u, i) => (
              <Tarjeta key={i} unidad={u} p={p} titulo={titulo} cuerpo={cuerpo} toque={i === 0 ? toque : 0} />
            ))}
          </div>
        </div>

        {/* Barra de estado, fija */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 10 * p,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingInline: 8 * p,
            backgroundColor: colores.fondo,
            ...cuerpo,
            fontSize: 3.2 * p,
            fontWeight: 700,
          }}
        >
          <span>9:41</span>
          <div style={{ width: 26 * p, height: 6.5 * p, borderRadius: 4 * p, backgroundColor: "#000" }} />
          <span style={{ letterSpacing: "0.1em" }}>●●● ▮</span>
        </div>

        {/* Botón flotante de WhatsApp */}
        <div
          style={{
            position: "absolute",
            right: 5 * p,
            bottom: 5 * p,
            width: 13 * p,
            height: 13 * p,
            borderRadius: "50%",
            backgroundColor: WHATSAPP,
            boxShadow: `0 ${p}px ${3 * p}px rgba(0,0,0,0.35)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: 1 - ficha,
          }}
        >
          <IconoWhatsApp size={7 * p} />
        </div>

        {/* Ficha de la primera unidad */}
        {ficha > 0 && unidades[0] ? (
          <Ficha unidad={unidades[0]} p={p} progreso={ficha} pulso={pulso} titulo={titulo} cuerpo={cuerpo} alto={pantallaAlto} />
        ) : null}
      </div>
    </div>
  );
};

/** Lo que va en grande en una tarjeta: la cuota si vende a crédito, si no el precio. */
const precioPrincipal = (u: Unidad) =>
  u.cuota ? `${dolares(u.cuota)} /${u.periodo === "semanal" ? "sem" : "mes"}` : dolares(u.precio);

const detalle = (u: Unidad) =>
  [
    u.anio,
    u.millas != null ? `${u.millas.toLocaleString("de-DE")} mi` : u.km != null ? (u.km === 0 ? "0 km" : `${u.km.toLocaleString("de-DE")} km`) : null,
  ]
    .filter(Boolean)
    .join(" · ");

const Foto: React.FC<{ unidad: Unidad; alto: number }> = ({ unidad, alto }) => {
  const { colores, claro } = useMarca();

  if (unidad.foto) {
    return (
      <Img
        src={staticFile(unidad.foto)}
        style={{ width: "100%", height: alto, objectFit: "cover", display: "block" }}
      />
    );
  }

  return (
    <div
      style={{
        height: alto,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        paddingBottom: alto * 0.1,
        background: `linear-gradient(180deg, ${alfa(colores.primario, claro ? 0.18 : 0.35)}, ${colores.superficie} 75%)`,
      }}
    >
      <Silueta tipo={unidad.tipo} color={claro ? colores.tinta : "#F4F4F4"} style={{ width: "86%", height: alto * 0.7 }} />
    </div>
  );
};

const Tarjeta: React.FC<{
  unidad: Unidad;
  p: number;
  titulo: React.CSSProperties;
  cuerpo: React.CSSProperties;
  toque: number;
}> = ({ unidad, p, titulo, cuerpo, toque }) => {
  const { colores } = useMarca();
  const onda = toque > 0 && toque < 1;

  return (
    <div
      style={{
        position: "relative",
        borderRadius: 2.4 * p,
        overflow: "hidden",
        backgroundColor: colores.superficie,
        border: `${0.3 * p}px solid ${colores.linea}`,
        transform: `scale(${1 - Math.sin(toque * Math.PI) * 0.04})`,
      }}
    >
      <Foto unidad={unidad} alto={30 * p} />
      <div style={{ padding: `${2.4 * p}px ${2.8 * p}px ${3 * p}px` }}>
        <div style={{ ...titulo, fontSize: 3.6 * p, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {unidad.marca} {unidad.modelo}
        </div>
        <div style={{ ...cuerpo, fontSize: 2.6 * p, color: colores.humo, marginTop: 1 * p }}>{detalle(unidad)}</div>
        <div style={{ ...titulo, fontSize: 4.4 * p, color: colores.primario, marginTop: 1.6 * p }}>
          {precioPrincipal(unidad)}
        </div>
      </div>
      {onda ? (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "35%",
            width: 60 * p * toque,
            height: 60 * p * toque,
            marginLeft: -30 * p * toque,
            marginTop: -30 * p * toque,
            borderRadius: "50%",
            backgroundColor: alfa(colores.tinta, 0.25 * (1 - toque)),
          }}
        />
      ) : null}
    </div>
  );
};

const Ficha: React.FC<{
  unidad: Unidad;
  p: number;
  progreso: number;
  pulso: number;
  titulo: React.CSSProperties;
  cuerpo: React.CSSProperties;
  alto: number;
}> = ({ unidad, p, progreso, pulso, titulo, cuerpo, alto }) => {
  const { colores } = useMarca();
  const y = interpolate(progreso, [0, 1], [alto, 0]);

  const filas: Array<[string, string]> = [
    ["Año", unidad.anio ? String(unidad.anio) : "—"],
    [unidad.millas != null ? "Millas" : "Kilometraje", detalle(unidad).split(" · ").pop() ?? "—"],
    ["Carrocería", SINGULAR[unidad.tipo]],
    unidad.cuota ? ["Precio de contado", dolares(unidad.precio)] : ["Estado", "Disponible"],
  ];

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        transform: `translateY(${y}px)`,
        backgroundColor: colores.fondo,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ height: 10 * p }} />
      <div style={{ position: "relative" }}>
        <Foto unidad={unidad} alto={62 * p} />
        <div
          style={{
            ...cuerpo,
            position: "absolute",
            left: 4 * p,
            top: 4 * p,
            fontSize: 3 * p,
            padding: `${1.2 * p}px ${3 * p}px`,
            borderRadius: 10 * p,
            backgroundColor: alfa("#000000", 0.55),
            color: "#fff",
          }}
        >
          ← Inventario
        </div>
      </div>
      <div style={{ padding: `${5 * p}px ${6 * p}px`, flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ ...titulo, fontSize: 7.4 * p }}>
          {unidad.marca} {unidad.modelo}
        </div>
        <div style={{ ...titulo, fontSize: 8.4 * p, color: colores.primario, marginTop: 2.4 * p }}>
          {precioPrincipal(unidad)}
        </div>
        <div style={{ marginTop: 4 * p, borderTop: `${0.3 * p}px solid ${colores.linea}` }}>
          {filas.map(([k, v]) => (
            <div
              key={k}
              style={{
                ...cuerpo,
                display: "flex",
                justifyContent: "space-between",
                fontSize: 3.4 * p,
                padding: `${2.4 * p}px 0`,
                borderBottom: `${0.3 * p}px solid ${colores.linea}`,
              }}
            >
              <span style={{ color: colores.humo }}>{k}</span>
              <span>{v}</span>
            </div>
          ))}
        </div>
        <div style={{ flex: 1 }} />
        <div
          style={{
            ...cuerpo,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 2.4 * p,
            padding: `${3.6 * p}px 0`,
            borderRadius: 2.4 * p,
            backgroundColor: WHATSAPP,
            color: "#fff",
            fontSize: 3.8 * p,
            fontWeight: 700,
            transform: `scale(${1 + Math.sin(pulso * Math.PI) * 0.06})`,
            boxShadow: `0 0 0 ${pulso * 3 * p}px ${alfa(WHATSAPP, 0.35 * (1 - pulso))}`,
          }}
        >
          <IconoWhatsApp size={5 * p} />
          Preguntar por esta unidad
        </div>
        <div style={{ height: 4 * p }} />
      </div>
    </div>
  );
};

const IconoWhatsApp: React.FC<{ size: number }> = ({ size }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="#fff">
    <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 2s.8 2.3.9 2.5c.1.2 1.6 2.5 4 3.5 1.5.6 2 .7 2.8.6.4-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2 0-.1-.2-.2-.4-.3Z" />
  </svg>
);
