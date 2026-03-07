import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"

export default async function AdminLogsPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "admin") {
    return (
      <div className="max-w-4xl mx-auto mt-20 text-center">
        <h1 className="text-2xl font-bold text-red-600">
          Acceso restringido
        </h1>
        <p className="mt-4">
          No tienes permisos para ver esta página.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto mt-20">
      <h1 className="text-3xl font-bold mb-6">
        Logs del sistema
      </h1>

      <p className="text-gray-600">
        Aquí aparecerán los registros del sistema.
      </p>
    </div>
  )
}