import prisma from "@/lib/prisma";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { approveCampaign, rejectCampaign } from "../actions";

export default async function PendingCampaignsPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    return <div className="p-10">No autorizado</div>;
  }

  const campaigns = await prisma.campaign.findMany({
    where: { status: "pendiente" },
    include: { createdBy: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-6xl mx-auto">
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
              Creada por: {campaign.createdBy.email}
            </p>

            <div className="flex gap-4 mt-4">
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