import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function LogsPage() {
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

  const logs = await prisma.auditLog.findMany({
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">
        Auditoría del Sistema
      </h1>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 text-left text-sm text-gray-600">
            <tr>
              <th className="p-4">Acción</th>
              <th className="p-4">Descripción</th>
              <th className="p-4">Usuario</th>
              <th className="p-4">Fecha</th>
            </tr>
          </thead>

          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="border-t hover:bg-gray-50">
                <td className="p-4 font-semibold">
                  {log.action}
                </td>

                <td className="p-4 text-gray-600">
                  {log.message}
                </td>

                <td className="p-4">
                  {log.user?.name || "Sistema"}
                </td>

                <td className="p-4 text-gray-500 text-sm">
                  {new Date(log.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {logs.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No hay registros aún.
          </div>
        )}
      </div>
    </div>
  );
}