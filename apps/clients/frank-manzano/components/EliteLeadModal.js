"use client";

import { useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import toast from "react-hot-toast";

const EliteLeadModal = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    current_fitness_level: "",
    goals: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/elite-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al enviar");
      toast.success("Enviado (demo).");
      setForm({ name: "", phone: "", current_fitness_level: "", goals: "" });
      onClose();
    } catch (err) {
      toast.error(err.message || "Error al enviar. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-base-content/80" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Panel className="w-full max-w-lg bg-base-100 border border-base-300 p-6 md:p-8 rounded-md shadow-sm">
                <div className="flex justify-between items-start mb-6">
                  <Dialog.Title className="text-xl font-bold text-base-content">Formulario demo</Dialog.Title>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm btn-square rounded-md"
                    onClick={onClose}
                    aria-label="Cerrar"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                      <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                    </svg>
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="elite-name" className="block text-xs text-base-content/70 mb-1 font-medium">
                      Input 1
                    </label>
                    <input
                      id="elite-name"
                      name="name"
                      type="text"
                      required
                      value={form.name}
                      onChange={handleChange}
                      className="input input-bordered w-full rounded-md border border-base-300 bg-base-100"
                      placeholder="Placeholder"
                    />
                  </div>
                  <div>
                    <label htmlFor="elite-phone" className="block text-xs text-base-content/70 mb-1 font-medium">
                      Input 2
                    </label>
                    <input
                      id="elite-phone"
                      name="phone"
                      type="tel"
                      required
                      value={form.phone}
                      onChange={handleChange}
                      className="input input-bordered w-full rounded-md border border-base-300 bg-base-100"
                      placeholder="Placeholder"
                    />
                  </div>
                  <div>
                    <label htmlFor="elite-level" className="block text-xs text-base-content/70 mb-1 font-medium">
                      Input 3
                    </label>
                    <input
                      id="elite-level"
                      name="current_fitness_level"
                      type="text"
                      value={form.current_fitness_level}
                      onChange={handleChange}
                      className="input input-bordered w-full rounded-md border border-base-300 bg-base-100"
                      placeholder="Placeholder"
                    />
                  </div>
                  <div>
                    <label htmlFor="elite-goals" className="block text-xs text-base-content/70 mb-1 font-medium">
                      Input 4
                    </label>
                    <textarea
                      id="elite-goals"
                      name="goals"
                      rows={3}
                      value={form.goals}
                      onChange={handleChange}
                      className="textarea textarea-bordered w-full rounded-md border border-base-300 bg-base-100"
                      placeholder="Placeholder"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary w-full rounded-md border border-primary/80 shadow-sm mt-4"
                  >
                    {loading ? "Enviando…" : "Enviar"}
                  </button>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default EliteLeadModal;
