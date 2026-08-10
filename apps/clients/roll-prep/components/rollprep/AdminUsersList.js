"use client";

import { useMemo, useState, useTransition } from "react";
import toast from "react-hot-toast";
import AcademyBadge from "@/components/rollprep/AcademyBadge";
import BeltBadge from "@/components/rollprep/BeltBadge";
import { deleteUser, updateUser } from "@/app/dashboard/admin/actions";
import { formatXp, getRank } from "@/libs/gamification";

function formatDate(value) {
  if (!value) return "Nunca";
  return new Date(value).toLocaleDateString("es-VE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function EditForm({ user, academies, onDone }) {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData) => {
    startTransition(async () => {
      const result = await updateUser(formData);

      if (result?.error) {
        toast.error(result.error);
        return;
      }

      toast.success("Usuario actualizado");
      onDone?.();
    });
  };

  return (
    <form action={handleSubmit} className="space-y-3 border-t border-base-300 p-4">
      <input type="hidden" name="id" value={user.id} />

      <label className="block w-full">
        <span className="mb-1 block text-xs font-bold uppercase tracking-widest opacity-70">
          Nombre de peleador
        </span>
        <input
          name="full_name"
          required
          maxLength={80}
          defaultValue={user.full_name ?? ""}
          className="input input-bordered w-full"
        />
      </label>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block w-full">
          <span className="mb-1 block text-xs font-bold uppercase tracking-widest opacity-70">
            Rol
          </span>
          <select
            name="role"
            defaultValue={user.role}
            className="select select-bordered w-full"
          >
            <option value="student">Alumno</option>
            <option value="admin">Profesor</option>
          </select>
        </label>

        {academies.length > 0 && (
          <label className="block w-full">
            <span className="mb-1 block text-xs font-bold uppercase tracking-widest opacity-70">
              Academia
            </span>
            <select
              name="academy_id"
              defaultValue={user.academy_id ?? ""}
              className="select select-bordered w-full"
            >
              <option value="">Sin academia</option>
              {academies.map((academy) => (
                <option key={academy.id} value={academy.id}>
                  {academy.name}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      <div className="flex gap-2">
        <button type="button" className="btn btn-ghost btn-sm" onClick={onDone}>
          Cancelar
        </button>
        <button className="btn btn-primary btn-sm flex-1" disabled={isPending}>
          {isPending && <span className="loading loading-spinner loading-xs" />}
          Guardar cambios
        </button>
      </div>
    </form>
  );
}

function DeleteButton({ user, isSelf }) {
  const [isArmed, setIsArmed] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (isSelf) return null;

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteUser(user.id);

      if (result?.error) {
        toast.error(result.error);
        setIsArmed(false);
        return;
      }

      toast.success("Cuenta eliminada");
    });
  };

  if (!isArmed) {
    return (
      <button
        type="button"
        onClick={() => setIsArmed(true)}
        className="btn btn-ghost btn-xs text-error"
      >
        Eliminar
      </button>
    );
  }

  return (
    <span className="flex items-center gap-1">
      <button
        type="button"
        onClick={handleDelete}
        disabled={isPending}
        className="btn btn-error btn-xs"
      >
        {isPending && <span className="loading loading-spinner loading-xs" />}
        Sí, borrar
      </button>
      <button
        type="button"
        onClick={() => setIsArmed(false)}
        className="btn btn-ghost btn-xs"
      >
        No
      </button>
    </span>
  );
}

// Lista completa de usuarios del gym: buscar, editar (nombre, rol, academia)
// y eliminar cuentas.
export default function AdminUsersList({ users, academies, currentUserId }) {
  const [query, setQuery] = useState("");
  const [academyFilter, setAcademyFilter] = useState("all");
  const [editingId, setEditingId] = useState(null);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return users.filter((user) => {
      const matchesQuery =
        !needle ||
        (user.full_name ?? "").toLowerCase().includes(needle) ||
        (user.email ?? "").toLowerCase().includes(needle);

      const matchesAcademy =
        academyFilter === "all" ||
        (academyFilter === "none" && !user.academy_id) ||
        user.academy_id === academyFilter;

      return matchesQuery && matchesAcademy;
    });
  }, [users, query, academyFilter]);

  return (
    <div>
      <div className="flex flex-col gap-2 border-b border-base-300 p-4 sm:flex-row">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por nombre o correo"
          className="input input-bordered input-sm w-full"
        />
        {academies.length > 0 && (
          <select
            value={academyFilter}
            onChange={(e) => setAcademyFilter(e.target.value)}
            className="select select-bordered select-sm w-full sm:w-56"
          >
            <option value="all">Todas las academias</option>
            {academies.map((academy) => (
              <option key={academy.id} value={academy.id}>
                {academy.name}
              </option>
            ))}
            <option value="none">Sin academia</option>
          </select>
        )}
      </div>

      {!visible.length && (
        <p className="p-6 text-sm opacity-60">
          Nadie coincide con la búsqueda.
        </p>
      )}

      <ul className="divide-y divide-base-300">
        {visible.map((user) => {
          const isEditing = editingId === user.id;
          const isSelf = user.id === currentUserId;
          const { belt } = getRank(user.total_points);

          return (
            <li key={user.id}>
              <div className="flex items-start gap-3 p-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold">
                      {user.full_name || "Sin nombre"}
                    </p>
                    {user.role === "admin" && (
                      <span className="tag-skew bg-primary px-2 py-0.5 text-[0.6rem] text-primary-content">
                        <span>Profesor</span>
                      </span>
                    )}
                    {isSelf && (
                      <span className="text-[0.6rem] font-bold uppercase tracking-widest text-primary">
                        (tú)
                      </span>
                    )}
                  </div>

                  <p className="mt-0.5 truncate text-xs opacity-60">
                    {user.email ?? "Correo no disponible"}
                  </p>

                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <AcademyBadge academy={user.academy} size="xs" showEmpty />
                    <BeltBadge rank={belt} size="xs" />
                    <span className="text-[0.6rem] font-bold uppercase tracking-widest opacity-50">
                      {formatXp(user.total_points)} XP · {user.classes_completed}{" "}
                      clases · últ. sesión {formatDate(user.last_sign_in_at)}
                    </span>
                  </div>
                </div>

                <div className="flex shrink-0 flex-col gap-1 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => setEditingId(isEditing ? null : user.id)}
                    className="btn btn-ghost btn-xs"
                  >
                    {isEditing ? "Cerrar" : "Editar"}
                  </button>
                  <DeleteButton user={user} isSelf={isSelf} />
                </div>
              </div>

              {isEditing && (
                <EditForm
                  user={user}
                  academies={academies}
                  onDone={() => setEditingId(null)}
                />
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
