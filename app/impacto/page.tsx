import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function ImpactPage() {
  const campaigns = await prisma.campaign.findMany({
    where: { status: "cerrada" },
    include: {
      _count: {
        select: {
          participants: true,
          emailLogs: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-[#F8FAFC] py-20">
      <div className="max-w-6xl mx-auto px-6">

        <h1 className="text-4xl font-extrabold mb-6 text-center">
          🏆 Impacto Logrado
        </h1>

        <p className="text-center text-gray-600 mb-16">
          Campañas que alcanzaron su meta gracias a la acción ciudadana.
        </p>

        {campaigns.length === 0 && (
          <div className="text-center text-gray-500">
            Aún no hay campañas cerradas.
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-8">
          {campaigns.map((campaign) => {
            const total =
              campaign.type === "email"
                ? campaign._count.emailLogs
                : campaign._count.participants;

            return (
              <div
                key={campaign.id}
                className="bg-white p-6 rounded-2xl shadow hover:shadow-xl transition"
              >
                <div className="mb-3">
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                    🏆 Meta alcanzada
                  </span>
                </div>

                <h2 className="text-xl font-bold mb-3">
                  {campaign.title}
                </h2>

                <p className="text-gray-600 mb-4 line-clamp-3">
                  {campaign.description}
                </p>

                <div className="text-sm mb-4 font-medium text-gray-700">
                  <p>
                    {total} de {campaign.goal} logrados
                  </p>
                </div>

                <Link
                  href={`/campaigns/${campaign.id}`}
                  className="inline-block bg-[#E76F51] text-white px-4 py-2 rounded-lg hover:bg-[#D65A3A] transition"
                >
                  Ver Detalles
                </Link>
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <Link
            href="/"
            className="text-sm text-gray-500 hover:text-[#E76F51]"
          >
            ← Volver al inicio
          </Link>
        </div>

      </div>
    </main>
  );
}