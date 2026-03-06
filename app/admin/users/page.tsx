import prisma from "@/lib/prisma";
import UserActions from "./UserActions";
import CreateUserForm from "./CreateUserForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function UsersPage() {
  const session = await getServerSession(authOptions);

  // 🔐 Solo admin puede entrar
  if (!session || session.user.role !== "admin") {
    return (
      <div className="max-w-4xl mx-auto mt-20 text-center">
        <h1 className="text-2xl font-bold text-red-600">
          No autorizado
        </h1>
      </div>
    );
  }

  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">
        Gestión de Usuarios
      </h1>

      {/* 🔥 FORMULARIO CREAR USUARIO */}
      <div className="bg-white rounded-xl shadow p-6 mb-10">
        <h2 className="text-lg font-semibold mb-4">
          Crear Nuevo Usuario
        </h2>

        <CreateUserForm />
      </div>

      {/* 🔥 TABLA */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 text-left text-sm text-gray-600">
            <tr>
              <th className="p-4">Nombre</th>
              <th className="p-4">Email</th>
              <th className="p-4">Rol</th>
              <th className="p-4">Estado</th>
              <th className="p-4">Creado</th>
              <th className="p-4">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-t hover:bg-gray-50"
              >
                {/* Nombre */}
                <td className="p-4 font-medium">
                  {user.name}
                </td>

                {/* Email */}
                <td className="p-4 text-gray-600">
                  {user.email}
                </td>

                {/* Rol */}
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      user.role === "admin"
                        ? "bg-red-100 text-red-600"
                        : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>

                {/* Estado */}
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      user.isActive
                        ? "bg-green-100 text-green-600"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {user.isActive ? "Activo" : "Inactivo"}
                  </span>
                </td>

                {/* Fecha */}
                <td className="p-4 text-gray-500 text-sm">
                  {new Date(
                    user.createdAt
                  ).toLocaleDateString()}
                </td>

                {/* Acciones */}
                <td className="p-4">
                  <UserActions
                    userId={user.id}
                    role={user.role}
                    isCurrentUser={
                      session.user.email === user.email
                    }
                    isActive={user.isActive}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No hay usuarios registrados.
          </div>
        )}
      </div>
    </div>
  );
}