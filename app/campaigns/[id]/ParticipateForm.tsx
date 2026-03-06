"use client"

import { useState } from "react"

interface Campaign {
  id: number
  type: string
}

export default function ParticipateForm({ campaign }: { campaign?: Campaign }) {

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {

    e.preventDefault()

    if (!campaign) {
      setError("Campaña no disponible")
      return
    }

    setLoading(true)
    setMessage(null)
    setError(null)

    const formData = new FormData(e.currentTarget)

    try {

      const res = await fetch(`/api/participate/${campaign.id}`, {
        method: "POST",
        body: formData
      })

      let data: any = {}

      try {
        data = await res.json()
      } catch {
        data = {}
      }

      if (!res.ok) {
        setError(data.error || "Ocurrió un error")
        setMessage(null)
        return
      }

      // éxito
      setError(null)
      setMessage("¡Gracias por participar en esta campaña!")

      // abrir email si existe mailto
      if (data.mailto) {
        window.location.href = data.mailto
      }

      e.currentTarget.reset()

    } catch (err) {

      setMessage(null)
      setError("Error de conexión")

    } finally {

      setLoading(false)

    }
  }

  if (!campaign) {
    return (
      <div className="bg-yellow-100 text-yellow-700 p-4 rounded-lg">
        Cargando campaña...
      </div>
    )
  }

  return (
    <div className="space-y-6">

      {message && (
        <div className="bg-green-100 text-green-700 p-4 rounded-lg">
          {message}
        </div>
      )}

      {!message && error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          name="firstName"
          placeholder="Nombre"
          required
          className="w-full border p-3 rounded-lg"
        />

        <input
          name="lastName"
          placeholder="Apellido"
          required
          className="w-full border p-3 rounded-lg"
        />

        <input
          name="email"
          type="email"
          placeholder="Correo electrónico"
          required
          className="w-full border p-3 rounded-lg"
        />

        <input
          name="zipCode"
          placeholder="ZIP Code"
          className="w-full border p-3 rounded-lg"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#E76F51] text-white py-4 rounded-lg font-semibold hover:bg-[#D65A3A] transition"
        >
          {loading
            ? "Procesando..."
            : campaign.type === "petition"
            ? "Firmar Petición"
            : campaign.type === "email"
            ? "Enviar Email"
            : "Firmar y Enviar Email"}
        </button>

      </form>

    </div>
  )
}