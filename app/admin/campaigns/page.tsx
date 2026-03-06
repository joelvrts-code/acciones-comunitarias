import prisma from "@/lib/prisma";
import Link from "next/link";

import {
  activateCampaign,
  pauseCampaign,
  closeCampaign,
} from "./actions";

export default async function AdminCampaignsPage() {

  const campaigns = await prisma.campaign.findMany({
    include: {
      participants: true,
      emailLogs: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-10">

      <h1 className="text-3xl font-bold mb-8">
        Panel Admin - Campañas
      </h1>

      {campaigns.length === 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          No hay campañas todavía.
        </div>
      )}

      {campaigns.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">

          <table className="w-full">

            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-4">Título</th>
                <th className="p-4">Estado</th>
                <th className="p-4">Meta</th>
                <th className="p-4">Tipo</th>
                <th className="p-4">Firmas</th>
                <th className="p-4">Emails enviados</th>
                <th className="p-4">Acciones</th>
              </tr>
            </thead>

            <tbody>

              {campaigns.map((campaign) => {

                const signatures = campaign.participants.length;
                const emailsSent = campaign.emailLogs.length;

                return (
                  <tr key={campaign.id} className="border-t">

                    {/* TITULO */}
                    <td className="p-4 font-medium">
                      {campaign.title}
                    </td>

                    {/* ESTADO */}
                    <td className="p-4">

                      {campaign.status === "activa" && (
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                          Activa
                        </span>
                      )}

                      {campaign.status === "pendiente" && (
                        <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs">
                          Pendiente
                        </span>
                      )}

                      {campaign.status === "pausada" && (
                        <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs">
                          Pausada
                        </span>
                      )}

                      {campaign.status === "cerrada" && (
                        <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs">
                          Cerrada
                        </span>
                      )}

                    </td>

                    {/* META */}
                    <td className="p-4">
                      {campaign.goal}
                    </td>

                    {/* TIPO */}
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

                    {/* FIRMAS */}
                    <td className="p-4 font-semibold text-blue-600">
                      {signatures}
                    </td>

                    {/* EMAILS ENVIADOS */}
                    <td className="p-4 font-semibold text-purple-600">
                      {emailsSent}
                    </td>

                    {/* ACCIONES */}
                    <td className="p-4 flex gap-2">

                      {/* VER CAMPAÑA */}
                      <Link
                        href={`/campaigns/${campaign.id}`}
                        target="_blank"
                        className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
                      >
                        Ver
                      </Link>

                      {/* ACTIVAR */}
                      <form action={activateCampaign}>
                        <input
                          type="hidden"
                          name="campaignId"
                          value={campaign.id}
                        />
                        <button className="bg-green-500 text-white px-3 py-1 rounded">
                          Activar
                        </button>
                      </form>

                      {/* PAUSAR */}
                      <form action={pauseCampaign}>
                        <input
                          type="hidden"
                          name="campaignId"
                          value={campaign.id}
                        />
                        <button className="bg-yellow-500 text-white px-3 py-1 rounded">
                          Pausar
                        </button>
                      </form>

                      {/* CERRAR */}
                      <form action={closeCampaign}>
                        <input
                          type="hidden"
                          name="campaignId"
                          value={campaign.id}
                        />
                        <button className="bg-red-600 text-white px-3 py-1 rounded">
                          Cerrar
                        </button>
                      </form>

                    </td>

                  </tr>
                );
              })}

            </tbody>

          </table>

        </div>
      )}

    </div>
  );
}