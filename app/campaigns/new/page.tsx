"use client";

import { createCampaign } from "./actions";
import Link from "next/link";
import { useState } from "react";

export default function NewCampaignPage() {

  const [type, setType] = useState("");
  const [targets, setTargets] = useState([{ name: "", email: "" }]);

  const showEmailFields = type === "email" || type === "both";

  function addTarget() {
    setTargets([...targets, { name: "", email: "" }]);
  }

  function updateTarget(index: number, field: string, value: string) {
    const updated = [...targets];
    updated[index] = { ...updated[index], [field]: value };
    setTargets(updated);
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">

      {/* HERO */}
      <section className="bg-[#0F172A] text-white py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">

          <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
            Inicia una acción ciudadana
          </h1>

          <p className="text-gray-300 text-lg leading-relaxed">
            Tu campaña puede movilizar personas, presionar instituciones
            y generar cambios reales en Puerto Rico.
          </p>

        </div>
      </section>

      {/* EXPLICACIÓN */}
      <section className="py-16 bg-white border-b">
        <div className="max-w-5xl mx-auto px-6 text-center">

          <h2 className="text-2xl font-bold mb-6">
            ¿Qué impacto puede tener tu campaña?
          </h2>

          <p className="text-gray-600 max-w-3xl mx-auto">
            Una campaña bien estructurada puede recopilar cientos o miles de firmas,
            generar presión institucional mediante correos directos y visibilizar
            problemas que afectan a tu comunidad.
          </p>

          <div className="mt-10 bg-[#FFF4EC] p-6 rounded-xl border">

            <p className="font-semibold mb-2">Ejemplo real:</p>

            <p className="text-sm text-gray-700">
              “Solicitamos reparación inmediata del puente del barrio X.
              En 3 semanas logramos 850 firmas y más de 400 correos enviados
              al municipio, lo que obligó a las autoridades a responder.”
            </p>

          </div>

        </div>
      </section>

      {/* FORMULARIO */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto bg-white p-10 rounded-2xl shadow border">

          <h2 className="text-2xl font-bold mb-8 text-center">
            Información de la Campaña
          </h2>

          <form action={createCampaign} className="space-y-6">

            {/* TIPO */}
            <div>

              <label className="block font-semibold mb-4">
                Tipo de campaña
              </label>

              <div className="grid md:grid-cols-3 gap-4">

                <label className="border rounded-xl p-4 cursor-pointer hover:border-[#E76F51] transition">

                  <input
                    type="radio"
                    name="type"
                    value="petition"
                    onChange={(e) => setType(e.target.value)}
                    required
                  />

                  <div className="font-semibold mt-1">
                    ✍ Firmar petición
                  </div>

                </label>

                <label className="border rounded-xl p-4 cursor-pointer hover:border-[#E76F51] transition">

                  <input
                    type="radio"
                    name="type"
                    value="email"
                    onChange={(e) => setType(e.target.value)}
                  />

                  <div className="font-semibold mt-1">
                    📧 Enviar emails
                  </div>

                </label>

                <label className="border rounded-xl p-4 cursor-pointer hover:border-[#E76F51] transition">

                  <input
                    type="radio"
                    name="type"
                    value="both"
                    onChange={(e) => setType(e.target.value)}
                  />

                  <div className="font-semibold mt-1">
                    🚀 Firmar y enviar emails
                  </div>

                </label>

              </div>

            </div>

            {/* EMAIL CONFIG */}
            {showEmailFields && (

              <div className="bg-[#F1F5F9] p-6 rounded-lg border space-y-6">

                <h3 className="font-semibold text-lg">
                  Configuración del Email
                </h3>

                {targets.map((target, index) => (

                  <div key={index} className="grid md:grid-cols-2 gap-4">

                    <input
                      placeholder="Nombre del funcionario"
                      value={target.name}
                      onChange={(e) =>
                        updateTarget(index, "name", e.target.value)
                      }
                      className="w-full border p-3 rounded-lg"
                    />

                    <input
                      placeholder="Email del funcionario"
                      value={target.email}
                      onChange={(e) =>
                        updateTarget(index, "email", e.target.value)
                      }
                      className="w-full border p-3 rounded-lg"
                    />

                    {/* hidden inputs para enviar al server */}
                    <input
                      type="hidden"
                      name="emailTargetNames"
                      value={target.name}
                    />

                    <input
                      type="hidden"
                      name="emailTargetEmails"
                      value={target.email}
                    />

                  </div>

                ))}

                <button
                  type="button"
                  onClick={addTarget}
                  className="text-sm text-blue-600 font-medium"
                >
                  + Añadir otro destinatario
                </button>

                {/* SUBJECT */}
                <div>

                  <label className="block font-semibold mb-2">
                    Asunto del email
                  </label>

                  <input
                    name="emailSubject"
                    placeholder="Ej: Solicitud de acción urgente"
                    className="w-full border p-3 rounded-lg"
                  />

                </div>

                {/* BODY */}
                <div>

                  <label className="block font-semibold mb-2">
                    Mensaje del email
                  </label>

                  <textarea
                    name="emailBody"
                    rows={6}
                    placeholder="Escribe el mensaje que se enviará a los funcionarios..."
                    className="w-full border p-3 rounded-lg"
                  />

                </div>

              </div>

            )}

            {/* IMAGEN */}
            <div>

              <label className="block font-semibold mb-2">
                Imagen de la campaña (opcional)
              </label>

              <input
                type="file"
                name="image"
                accept="image/*"
                className="w-full border p-3 rounded-lg"
              />

              <p className="text-xs text-gray-500 mt-2">
                Puedes subir una imagen que represente el problema o la causa.
              </p>

            </div>

            {/* TÍTULO */}
            <input
              name="title"
              placeholder="Título de la campaña"
              className="w-full border p-3 rounded-lg"
              required
            />

            {/* DESCRIPCIÓN */}
            <textarea
              name="description"
              placeholder="Describe el problema y la acción que solicitas"
              className="w-full border p-3 rounded-lg"
              rows={4}
              required
            />

            {/* META */}
            <input
              type="number"
              name="goal"
              placeholder="Meta de apoyo (ej. 500)"
              className="w-full border p-3 rounded-lg"
              required
            />

            {/* NOMBRE */}
            <input
              name="creatorName"
              placeholder="Tu Nombre"
              className="w-full border p-3 rounded-lg"
              required
            />

            {/* EMAIL */}
            <input
              type="email"
              name="creatorEmail"
              placeholder="Tu Email"
              className="w-full border p-3 rounded-lg"
              required
            />

            {/* BOTÓN */}
            <button
              type="submit"
              className="w-full bg-[#E76F51] text-white py-4 rounded-lg font-semibold hover:bg-[#D65A3A] transition"
            >
              Enviar para Revisión
            </button>

          </form>

          {/* VOLVER */}
          <div className="mt-6 text-center">

            <Link
              href="/"
              className="text-sm text-gray-500 hover:text-[#E76F51]"
            >
              ← Volver
            </Link>

          </div>

        </div>
      </section>

    </main>
  );
}