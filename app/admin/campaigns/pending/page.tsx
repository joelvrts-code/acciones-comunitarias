import prisma from "@/lib/prisma";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { approveCampaign, rejectCampaign } from "../actions";

export default async function PendingCampaignsPage() {

  const session = await getServerSession(authOptions);

  // 🔐 Verificar admin
  if (!session || (session.user as any)?.role !== "admin") {
    return (
      <div className="max-w-4xl mx-auto mt-20 text-center">
        <h1 className="text-2xl font-bold text-red-600">
          No autorizado
        </h1>
      </div>
    );
  }

  const campaigns = await prisma.campaign.findMany({
    where: { status: "pendiente" },
    include: {
      createdBy: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-6xl mx-auto p-10">

      <h1 className="text-3xl font-bold mb-8">
        Campañas Pendientes
      </h1>

      <div className="grid gap-6">

        {campaigns.map((campaign) => (
          <div
            key={campaign.id}
            className="bg-white p-6 rounded-xl shadow"
          >

            <h2 className="text-xl font-semibold">
              {campaign.title}
            </h2>

            <p className="text-gray-600 mt-2">
              {campaign.description}
            </p>

            <p className="text-sm text-gray-500 mt-2">
              Creada por: {campaign.createdBy?.email ?? "Anónimo"}
            </p>

            <div className="flex gap-4 mt-4">

              {/* APROBAR */}
              <form action={approveCampaign}>
                <input
                  type="hidden"
                  name="campaignId"
                  value={campaign.id}
                />
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg">
                  Aprobar
                </button>
              </form>

              {/* RECHAZAR */}
              <form action={rejectCampaign}>
                <input
                  type="hidden"
                  name="campaignId"
                  value={campaign.id}
                />
                <button className="bg-red-600 text-white px-4 py-2 rounded-lg">
                  Rechazar
                </button>
              </form>

              {/* VER */}
              <Link
                href={`/campaigns/${campaign.id}`}
                className="bg-gray-300 px-4 py-2 rounded-lg"
              >
                Ver
              </Link>

            </div>

          </div>
        ))}

        {campaigns.length === 0 && (
          <div className="text-gray-500">
            No hay campañas pendientes.
          </div>
        )}

      </div>

    </div>
  );
}