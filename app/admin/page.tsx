import prisma from "@/lib/prisma";
import DashboardChart from "./DashboardChart";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Link from "next/link";

export default async function AdminDashboard() {
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
    include: {
      participants: true,
      emailLogs: true,
    },
  });

  const totalCampaigns = campaigns.length;

  const activeCampaigns = campaigns.filter(
    (c) => c.status === "activa"
  ).length;

  const pendingCampaigns = campaigns.filter(
    (c) => c.status === "pendiente"
  ).length;

  const rejectedCampaigns = campaigns.filter(
    (c) => c.status === "rechazada"
  ).length;

  const totalParticipants = campaigns.reduce(
    (acc, c) => acc + c.participants.length,
    0
  );

  const totalEmailsSent = campaigns.reduce(
    (acc, c) => acc + c.emailLogs.length,
    0
  );

  const chartData = [
    { name: "Activas", value: activeCampaigns },
    { name: "Pendientes", value: pendingCampaigns },
    { name: "Rechazadas", value: rejectedCampaigns },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-10">

      <h1 className="text-4xl font-bold">
        Dashboard Admin
      </h1>

      {/* BOTONES RÁPIDOS */}

      <div className="flex gap-4">

        <Link
          href="/campaigns/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Nueva campaña
        </Link>

        <Link
          href="/admin/movilizar"
          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
        >
          Movilizar ciudadanos
        </Link>

      </div>

      {/* MÉTRICAS */}

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">

        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-500 text-sm">Total Campañas</p>
          <p className="text-3xl font-bold mt-2">
            {totalCampaigns}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-500 text-sm">Activas</p>
          <p className="text-3xl font-bold mt-2 text-green-600">
            {activeCampaigns}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-500 text-sm">Pendientes</p>
          <p className="text-3xl font-bold mt-2 text-yellow-600">
            {pendingCampaigns}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-500 text-sm">
            Firmas
          </p>
          <p className="text-3xl font-bold mt-2 text-blue-600">
            {totalParticipants}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-500 text-sm">
            Emails enviados
          </p>
          <p className="text-3xl font-bold mt-2 text-purple-600">
            {totalEmailsSent}
          </p>
        </div>

      </div>

      <DashboardChart data={chartData} />

    </div>
  );
}