"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export default function MovilizarPage() {

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMobilization(e: React.FormEvent) {

    e.preventDefault();

    setLoading(true);

    const res = await fetch("/api/admin/mobilize", {
      method: "POST",
      body: JSON.stringify({
        subject,
        message,
        url,
      }),
    });

    const data = await res.json();

    setLoading(false);

    if (data.success) {
      toast.success("Alerta enviada a ciudadanos");
      setSubject("");
      setMessage("");
      setUrl("");
    } else {
      toast.error("Error enviando alerta");
    }

  }

  return (

    <main className="max-w-2xl mx-auto px-4 py-12">

      <h1 className="text-3xl font-bold mb-8">
        Enviar alerta ciudadana
      </h1>

      <form onSubmit={sendMobilization} className="space-y-6">

        <div>

          <label className="block text-sm mb-1">
            Asunto
          </label>

          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            className="w-full border rounded px-3 py-2"
          />

        </div>

        <div>

          <label className="block text-sm mb-1">
            Mensaje
          </label>

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={5}
            className="w-full border rounded px-3 py-2"
          />

        </div>

        <div>

          <label className="block text-sm mb-1">
            Link de campaña
          </label>

          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            className="w-full border rounded px-3 py-2"
          />

        </div>

        <button
          disabled={loading}
          className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600"
        >
          {loading ? "Enviando..." : "Enviar alerta ciudadana"}
        </button>

      </form>

    </main>

  );

}