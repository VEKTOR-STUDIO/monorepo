"use client";

import toast from "react-hot-toast";
import FighterCard from "@/components/FighterCard";
import { createClient } from "@/libs/supabase/client";
import { getFighterCompletion } from "@/libs/fighterCompletion";
import {
  STATUS_LABELS,
  BJJ_BELTS,
  STANCES,
  FIGHTING_STYLES,
  VE_BANKS,
  BANK_ACCOUNT_TYPES,
} from "@/data/fighterOptions";

const calcAge = (birthDate) => {
  if (!birthDate) return null;
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
};

const labelOf = (options, value) =>
  options.find((o) => o.value === value)?.label || null;

const Stat = ({ label, value }) => (
  <div className="border border-base-content/10 bg-base-200 p-4">
    <p className="text-[0.6rem] tracking-[0.25em] uppercase text-base-content/40 font-bold">
      {label}
    </p>
    <p className="font-display text-xl md:text-2xl text-base-content mt-1">
      {value ?? "—"}
    </p>
  </div>
);

/**
 * FighterProfileView — ficha de peleador estilo UFC (récord, divisiones, stats).
 * Muestra también el % de completado del perfil y qué datos faltan, para que el
 * peleador sepa qué actualizar (incluso cuando Legión agregue campos nuevos).
 */
export default function FighterProfileView({ fighter, payment = null, onEdit }) {
  const supabase = createClient();
  const status = STATUS_LABELS[fighter.status] || STATUS_LABELS.pendiente;

  const hasPaymentInfo =
    payment &&
    (payment.bank_code ||
      payment.bank_account_number ||
      payment.pago_movil_phone ||
      payment.bank_account_holder);
  const bankLabel = payment?.bank_code
    ? labelOf(VE_BANKS, payment.bank_code) || payment.bank_code
    : null;
  const accountTypeLabel = labelOf(BANK_ACCOUNT_TYPES, payment?.bank_account_type);
  const age = calcAge(fighter.birth_date);
  const totalWins = fighter.wins || 0;
  const finishes = (fighter.wins_ko || 0) + (fighter.wins_sub || 0);
  const finishRate = totalWins > 0 ? Math.round((finishes / totalWins) * 100) : null;

  const { percent, completed, total, missing } = getFighterCompletion(fighter);

  const hasAmateurRecord =
    (fighter.amateur_wins || 0) +
      (fighter.amateur_losses || 0) +
      (fighter.amateur_draws || 0) >
    0;

  const hasLegionRecord =
    (fighter.legion_wins || 0) +
      (fighter.legion_losses || 0) +
      (fighter.legion_draws || 0) >
    0;
  const hasOtherOrgRecord =
    (fighter.other_org_wins || 0) +
      (fighter.other_org_losses || 0) +
      (fighter.other_org_draws || 0) >
    0;

  const disciplineLabel =
    { mma: "MMA", bjj: "BJJ / Grappling", ambas: "MMA + BJJ" }[fighter.discipline] ||
    fighter.discipline;

  // La cédula vive en un bucket privado: generamos una URL firmada al momento.
  const viewIdDocument = async () => {
    try {
      const { data, error } = await supabase.storage
        .from("fighter-documents")
        .createSignedUrl(fighter.id_document_url, 60);
      if (error) throw error;
      window.open(data.signedUrl, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error(error);
      toast.error("No se pudo abrir el documento");
    }
  };

  return (
    <div className="space-y-6">
      {/* Avance del perfil */}
      <div className="border border-primary/30 bg-base-200 p-5">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[0.65rem] tracking-[0.25em] uppercase text-base-content/50 font-bold">
            Perfil completado
          </p>
          <p className="font-display text-2xl text-primary tabular-nums">{percent}%</p>
        </div>
        <progress
          className="progress progress-primary w-full h-2"
          value={percent}
          max="100"
        />
        <p className="text-[0.65rem] tracking-[0.15em] uppercase text-base-content/40 mt-2">
          {completed} de {total} datos completados
        </p>

        {missing.length > 0 && (
          <details className="mt-3 group">
            <summary className="cursor-pointer text-xs text-primary font-bold tracking-wide list-none flex items-center gap-2">
              <span className="group-open:rotate-90 transition-transform">›</span>
              Te falta completar {missing.length}{" "}
              {missing.length === 1 ? "dato" : "datos"}
            </summary>
            <div className="mt-3 flex flex-wrap gap-2">
              {missing.map((m) => (
                <span
                  key={m.key}
                  className="badge badge-sm border border-base-content/20 text-base-content/60 text-[0.65rem] tracking-wide"
                >
                  {m.label}
                </span>
              ))}
            </div>
            {onEdit && (
              <button
                className="btn btn-primary btn-sm mt-4"
                onClick={onEdit}
              >
                Completar ahora
              </button>
            )}
          </details>
        )}
      </div>

      <div className="grid md:grid-cols-[minmax(0,320px)_1fr] gap-6 md:gap-8 items-start">
        {/* Retrato */}
        <FighterCard
          name={fighter.full_name}
          nickname={fighter.nickname}
          record={`${fighter.wins}-${fighter.losses}-${fighter.draws}`}
          weightClass={fighter.weight_class}
          country={fighter.nationality}
          hometown={[fighter.city, fighter.state].filter(Boolean).join(", ")}
          photo={fighter.photo_url}
          side="red"
          size="lg"
        />

        <div className="space-y-6">
          {/* Estado dentro de la liga */}
          <div className="flex items-center justify-between border border-primary/30 bg-base-200 p-4">
            <p className="text-[0.65rem] tracking-[0.25em] uppercase text-base-content/50 font-bold">
              Estado en la liga
            </p>
            <span className={`badge ${status.badge} badge-sm md:badge-md tracking-wider uppercase text-[0.6rem] font-bold`}>
              {status.label}
            </span>
          </div>

          {/* Récord profesional grande estilo UFC */}
          <div className="border border-primary/30 bg-base-200 p-6 text-center">
            <p className="text-[0.65rem] tracking-[0.3em] uppercase text-primary font-bold mb-2">
              Récord profesional MMA
            </p>
            <p className="font-display text-5xl md:text-6xl text-base-content tabular-nums">
              {fighter.wins}
              <span className="text-primary mx-2">-</span>
              {fighter.losses}
              <span className="text-primary mx-2">-</span>
              {fighter.draws}
            </p>
            <div className="flex justify-center gap-6 mt-4 text-[0.65rem] tracking-[0.2em] uppercase text-base-content/50 font-bold">
              <span>{fighter.wins_ko || 0} KO/TKO</span>
              <span>{fighter.wins_sub || 0} SUM</span>
              <span>{fighter.wins_dec || 0} DEC</span>
              {finishRate !== null && (
                <span className="text-primary">{finishRate}% finalización</span>
              )}
            </div>
            {(hasLegionRecord || hasOtherOrgRecord) && (
              <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 text-[0.65rem] tracking-[0.2em] uppercase text-base-content/50 font-bold mt-4 pt-3 border-t border-base-content/10">
                {hasLegionRecord && (
                  <span>
                    <span className="text-primary">En Legión:</span>{" "}
                    {fighter.legion_wins || 0}-{fighter.legion_losses || 0}-
                    {fighter.legion_draws || 0}
                  </span>
                )}
                {hasOtherOrgRecord && (
                  <span>
                    Otras orgs: {fighter.other_org_wins || 0}-
                    {fighter.other_org_losses || 0}-{fighter.other_org_draws || 0}
                  </span>
                )}
              </div>
            )}
            {hasAmateurRecord && (
              <p className="text-[0.65rem] tracking-[0.2em] uppercase text-base-content/40 font-bold mt-4 pt-3 border-t border-base-content/10">
                Récord amateur: {fighter.amateur_wins || 0}-
                {fighter.amateur_losses || 0}-{fighter.amateur_draws || 0}
              </p>
            )}
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <Stat label="Disciplina" value={disciplineLabel} />
            <Stat label="Estilo de combate" value={labelOf(FIGHTING_STYLES, fighter.fighting_style)} />
            <Stat label="División" value={fighter.weight_class} />
            <Stat label="Edad" value={age ? `${age} años` : null} />
            <Stat
              label="Peso"
              value={fighter.weight_kg ? `${Number(fighter.weight_kg)} kg` : null}
            />
            <Stat
              label="Estatura"
              value={fighter.height_cm ? `${Number(fighter.height_cm)} cm` : null}
            />
            <Stat
              label="Alcance"
              value={fighter.reach_cm ? `${Number(fighter.reach_cm)} cm` : null}
            />
            <Stat label="Guardia" value={labelOf(STANCES, fighter.stance)} />
            {fighter.bjj_belt && (
              <Stat label="Cinturón BJJ" value={labelOf(BJJ_BELTS, fighter.bjj_belt)} />
            )}
            <Stat label="Academia / Equipo" value={fighter.team} />
          </div>

          {/* Tallas de uniforme */}
          {(fighter.short_size ||
            fighter.shirt_size ||
            fighter.glove_size ||
            fighter.coach_shirt_size) && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Stat label="Talla short" value={fighter.short_size} />
              <Stat label="Talla franela" value={fighter.shirt_size} />
              <Stat label="Talla guante" value={fighter.glove_size} />
              <Stat label="Franela coach" value={fighter.coach_shirt_size} />
            </div>
          )}

          {/* Detalles secundarios */}
          <div className="border border-base-content/10 bg-base-200 p-4 space-y-1 text-sm text-base-content/60">
            {fighter.id_document_number && (
              <p>
                <span className="text-base-content/40 uppercase text-[0.6rem] tracking-[0.2em] font-bold mr-2">Cédula / Pasaporte</span>
                {fighter.id_document_number}
              </p>
            )}
            {fighter.coach_name && (
              <p>
                <span className="text-base-content/40 uppercase text-[0.6rem] tracking-[0.2em] font-bold mr-2">Coach</span>
                {fighter.coach_name}
              </p>
            )}
            {fighter.years_training != null && (
              <p>
                <span className="text-base-content/40 uppercase text-[0.6rem] tracking-[0.2em] font-bold mr-2">Experiencia</span>
                {fighter.years_training} años entrenando
              </p>
            )}
            {fighter.instagram && (
              <p>
                <span className="text-base-content/40 uppercase text-[0.6rem] tracking-[0.2em] font-bold mr-2">Instagram</span>
                @{fighter.instagram}
              </p>
            )}
            {fighter.id_document_url && (
              <button
                onClick={viewIdDocument}
                className="btn btn-ghost btn-xs border border-primary/30 text-primary mt-2"
              >
                Ver foto de la cédula
              </button>
            )}
          </div>

          {/* Datos de pago (privados: dueño + admin) */}
          <div className="border border-primary/20 bg-base-200 p-4">
            <p className="text-[0.6rem] tracking-[0.25em] uppercase text-primary font-bold mb-3">
              Datos de pago
            </p>
            {hasPaymentInfo ? (
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-base-content/70">
                {bankLabel && (
                  <p>
                    <span className="text-base-content/40 uppercase text-[0.6rem] tracking-[0.2em] font-bold block">Banco</span>
                    {bankLabel}
                  </p>
                )}
                {accountTypeLabel && (
                  <p>
                    <span className="text-base-content/40 uppercase text-[0.6rem] tracking-[0.2em] font-bold block">Tipo de cuenta</span>
                    {accountTypeLabel}
                  </p>
                )}
                {payment.bank_account_number && (
                  <p>
                    <span className="text-base-content/40 uppercase text-[0.6rem] tracking-[0.2em] font-bold block">N° de cuenta</span>
                    {payment.bank_account_number}
                  </p>
                )}
                {payment.bank_account_holder && (
                  <p>
                    <span className="text-base-content/40 uppercase text-[0.6rem] tracking-[0.2em] font-bold block">Titular</span>
                    {payment.bank_account_holder}
                  </p>
                )}
                {payment.bank_account_holder_id && (
                  <p>
                    <span className="text-base-content/40 uppercase text-[0.6rem] tracking-[0.2em] font-bold block">Cédula / RIF</span>
                    {payment.bank_account_holder_id}
                  </p>
                )}
                {payment.pago_movil_phone && (
                  <p>
                    <span className="text-base-content/40 uppercase text-[0.6rem] tracking-[0.2em] font-bold block">Pago Móvil</span>
                    {payment.pago_movil_phone}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-base-content/50">
                Aún no has cargado tus datos de pago.{" "}
                {onEdit && (
                  <button onClick={onEdit} className="text-primary font-bold underline">
                    Agrégalos aquí
                  </button>
                )}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
