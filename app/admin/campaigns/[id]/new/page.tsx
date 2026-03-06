import Link from "next/link";

export default function NewCampaignPage() {
  return (
    <main className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow p-8">

        <Link
          href="/admin"
          className="text-blue-600 hover:underline"
        >
          ← Volver al Dashboard
        </Link>

        <h1 className="text-3xl font-bold mt-4 mb-8">
          Crear Nueva Campaña
        </h1>

        <form
          action="/api/admin/campaigns"
          method="POST"
          className="space-y-6"
        >

          <div>
            <label className="block mb-2 font-medium">
              Título
            </label>
            <input
              type="text"
              name="title"
              required
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Descripción
            </label>
            <textarea
              name="description"
              required
              rows={4}
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Meta (cantidad de firmas)
            </label>
            <input
              type="number"
              name="goal"
              required
              min="1"
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              URL de Imagen (opcional)
            </label>
            <input
              type="text"
              name="imageUrl"
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-700 text-white py-4 rounded-xl font-semibold hover:bg-green-800 transition"
          >
            Crear Campaña
          </button>

        </form>
      </div>
    </main>
  );
}