import prisma from "@/lib/prisma"
import Link from "next/link"

export default async function CampaignsPage() {

  const campaigns = await prisma.campaign.findMany({
    where: {
      status: "activa"
    },
    orderBy: {
      createdAt: "desc"
    }
  })

  return (
    <main>

      {/* HERO */}
      <section className="bg-[#0B1B35] text-white py-20">
        <div className="max-w-5xl mx-auto px-6 flex justify-between items-center">

          <h1 className="text-5xl font-bold">
            Campañas
          </h1>

          <Link
            href="/campaigns/new"
            className="bg-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Crear campaña
          </Link>

        </div>
      </section>


      {/* LISTA DE CAMPAÑAS */}
      <section className="max-w-5xl mx-auto py-12 px-6">

        {campaigns.length === 0 && (
          <p className="text-gray-500">
            No hay campañas activas todavía.
          </p>
        )}

        <div className="grid md:grid-cols-2 gap-8">

          {campaigns.map((campaign) => (

            <Link
              key={campaign.id}
              href={`/campaigns/${campaign.id}`}
              className="bg-white shadow rounded-xl overflow-hidden hover:shadow-lg transition"
            >

              {campaign.imageUrl && (
                <img
                  src={campaign.imageUrl}
                  className="w-full h-48 object-cover"
                />
              )}

              <div className="p-6">

                <h2 className="text-2xl font-bold mb-2">
                  {campaign.title}
                </h2>

                <p className="text-gray-600 line-clamp-3">
                  {campaign.description}
                </p>

              </div>

            </Link>

          ))}

        </div>

      </section>


      {/* INVITACIÓN A APOYAR MÁS CAMPAÑAS */}
      <section className="bg-gray-100 py-16">

        <div className="max-w-4xl mx-auto text-center px-6">

          <h2 className="text-3xl font-bold mb-4">
            ✊ Apoya otras campañas
          </h2>

          <p className="text-gray-600">
            Tu apoyo puede generar cambios reales. Explora las campañas activas
            y ayuda a lograr impacto en tu comunidad.
          </p>

        </div>

      </section>

    </main>
  )
}