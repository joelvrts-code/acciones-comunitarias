import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { approveCampaign, rejectCampaign } from "../actions";
import Link from "next/link";

export default async function PendingCampaignsPage() {

  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    return (
      <div className="max-w-4xl mx-auto mt-20 text-center">
        <h1 className="text-2xl font-bold text-red-600">
          No autorizado
        </h1>
      </div>
    );
  }

  const campaigns = await prisma.campaign.findMany({
    where: {
      status: "pendiente",
    },
    include: {
      createdBy: true,
      participants: true,
      emailLogs: true
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="max-w-7xl mx-auto">

      <h1 className="text-3xl font-bold mb-8">
        Campañas Pendientes
      </h1>

      <div className="bg-white rounded-xl shadow overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100 text-left text-sm text-gray-600">
            <tr>
              <th className="p-4">Título</th>
              <th className="p-4">Tipo</th>
              <th className="p-4">Meta</th>
              <th className="p-4">Firmas</th>
              <th className="p-4">Emails enviados</th>
              <th className="p-4">Creador</th>
              <th className="p-4">Fecha</th>
              <th className="p-4">Acciones</th>
            </tr>
          </thead>

          <tbody>

            {campaigns.map((campaign) => {

              const signatures = campaign.participants.length;
              const emailsSent = campaign.emailLogs.length;

              return (
                <tr
                  key={campaign.id}
                  className="border-t hover:bg-gray-50"
                >

                  <td className="p-4 font-medium">
                    {campaign.title}
                  </td>

                  {/* Tipo */}
                  <td className="p-4">

                    {campaign.type === "petition" && (
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                        Petición
                      </span>
                    )}

                    {campaign.type === "email" && (
                      <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs">
                        Email
                      </span>
                    )}

                    {campaign.type === "both" && (
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                        Petición + Email
                      </span>
                    )}

                  </td>

                  <td className="p-4">
                    {campaign.goal}
                  </td>

                  {/* Firmas */}
                  <td className="p-4 font-semibold text-blue-600">
                    {signatures}
                  </td>

                  {/* Emails enviados */}
                  <td className="p-4 font-semibold text-purple-600">
                    {emailsSent}
                  </td>

                  {/* Creador */}
                  <td className="p-4 text-gray-600">
                    {campaign.createdBy?.name ?? campaign.creatorName}
                  </td>

                  {/* Fecha */}
                  <td className="p-4 text-gray-500 text-sm">
                    {new Date(campaign.createdAt).toLocaleDateString()}
                  </td>

                  {/* Acciones */}
                  <td className="p-4 flex gap-2">

                    <Link
                      href={`/campaigns/${campaign.id}`}
                      target="_blank"
                      className="bg-gray-200 px-3 py-1 rounded-lg text-sm hover:bg-gray-300"
                    >
                      Ver
                    </Link>

                    <form action={approveCampaign}>
                      <input
                        type="hidden"
                        name="campaignId"
                        value={campaign.id}
                      />
                      <button
                        type="submit"
                        className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-700"
                      >
                        Aprobar
                      </button>
                    </form>

                    <form action={rejectCampaign}>
                      <input
                        type="hidden"
                        name="campaignId"
                        value={campaign.id}
                      />
                      <button
                        type="submit"
                        className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-700"
                      >
                        Rechazar
                      </button>
                    </form>

                  </td>

                </tr>
              );
            })}

          </tbody>

        </table>

        {campaigns.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No hay campañas pendientes.
          </div>
        )}

      </div>

    </div>
  );
}