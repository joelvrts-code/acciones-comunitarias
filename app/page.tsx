import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function HomePage() {

  const campaigns = await prisma.campaign.findMany({
    where: {
      status: "activa"
    },
    take: 6,
    orderBy: {
      createdAt: "desc"
    },
    include: {
      _count: {
        select: {
          participants: true
        }
      }
    }
  });

  return (

    <main className="max-w-6xl mx-auto px-4">

      {/* HERO */}

      <section className="text-center py-20">

        <h1 className="text-5xl font-bold mb-6 leading-tight">
          Organiza y apoya campañas comunitarias
          <br />
          en Puerto Rico
        </h1>

        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
          Acciones Comunitarias conecta ciudadanos, comunidades
          y organizaciones para impulsar cambios reales.
        </p>

        <div className="flex justify-center gap-4">

          <Link
            href="/campaigns"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
          >
            Ver campañas
          </Link>

          <Link
            href="/campaigns/new"
            className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition font-medium"
          >
            Crear campaña
          </Link>

        </div>

      </section>

      {/* CAMPAÑAS DESTACADAS */}

      <section className="py-12">

        <h2 className="text-2xl font-bold mb-10 text-center">
          Campañas activas
        </h2>

        <div className="grid md:grid-cols-3 gap-8">

          {campaigns.map((campaign) => {

            const signatures = campaign._count.participants;

            const progress = Math.min(
              Math.round((signatures / campaign.goal) * 100),
              100
            );

            return (

              <div
                key={campaign.id}
                className="bg-white border rounded-xl overflow-hidden shadow-md hover:shadow-lg transition"
              >

                {campaign.imageUrl && (

                  <img
                    src={campaign.imageUrl}
                    className="w-full h-48 object-cover"
                  />

                )}

                <div className="p-5">

                  <h3 className="font-semibold text-lg mb-3">
                    {campaign.title}
                  </h3>

                  <p className="text-sm text-gray-700 mb-4 font-medium">
                    {signatures} firmas
                  </p>

                  {/* PROGRESS BAR */}

                  <div className="w-full bg-gray-200 h-2 rounded mb-2">

                    <div
                      className="bg-blue-600 h-2 rounded"
                      style={{ width: `${progress}%` }}
                    />

                  </div>

                  <p className="text-xs text-gray-500 mb-5">
                    Meta: {campaign.goal}
                  </p>

                  <Link
                    href={`/campaigns/${campaign.id}`}
                    className="block text-center bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition font-medium"
                  >
                    Firmar campaña
                  </Link>

                </div>

              </div>

            );

          })}

        </div>

      </section>

      {/* COMO FUNCIONA */}

      <section className="py-20">

        <h2 className="text-2xl font-bold text-center mb-12">
          Cómo funciona
        </h2>

        <div className="grid md:grid-cols-3 gap-10 text-center">

          <div>

            <h3 className="font-semibold text-lg mb-3">
              1. Crea una campaña
            </h3>

            <p className="text-gray-600">
              Describe el problema que quieres resolver
              y establece una meta de firmas.
            </p>

          </div>

          <div>

            <h3 className="font-semibold text-lg mb-3">
              2. Comparte con tu comunidad
            </h3>

            <p className="text-gray-600">
              Invita a ciudadanos y organizaciones
              a apoyar la causa y compartirla.
            </p>

          </div>

          <div>

            <h3 className="font-semibold text-lg mb-3">
              3. Genera presión pública
            </h3>

            <p className="text-gray-600">
              Las firmas y mensajes ayudan a impulsar
              cambios ante autoridades y organizaciones.
            </p>

          </div>

        </div>

      </section>

      {/* IMPACTO */}

      <section className="py-20 text-center bg-white border rounded-xl shadow-sm">

        <h2 className="text-2xl font-bold mb-10">
          Impacto ciudadano
        </h2>

        <div className="grid md:grid-cols-3 gap-10">

          <div>

            <p className="text-4xl font-bold text-blue-600">
              {campaigns.reduce((a, c) => a + c._count.participants, 0)}
            </p>

            <p className="text-gray-600 mt-2">
              Firmas ciudadanas
            </p>

          </div>

          <div>

            <p className="text-4xl font-bold text-blue-600">
              {campaigns.length}
            </p>

            <p className="text-gray-600 mt-2">
              Campañas activas
            </p>

          </div>

          <div>

            <p className="text-4xl font-bold text-blue-600">
              Puerto Rico
            </p>

            <p className="text-gray-600 mt-2">
              Participación comunitaria
            </p>

          </div>

        </div>

      </section>

    </main>

  );

}