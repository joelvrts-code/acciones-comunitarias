"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  function linkClass(path: string) {
    const isActive =
      pathname === path || pathname.startsWith(path + "/");

    return `flex items-center gap-3 px-4 py-3 rounded-lg transition font-medium ${
      isActive
        ? "bg-blue-600 text-white shadow-sm"
        : "text-gray-700 hover:bg-gray-100"
    }`;
  }

  return (
    <aside className="w-64 bg-white border-r min-h-screen p-6 flex flex-col">
      {/* Logo / Título */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800">
          Admin Panel
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Acciones Comunitarias
        </p>
      </div>

      {/* Navegación */}
      <nav className="flex flex-col gap-2">

        {/* Dashboard */}
        <Link href="/admin" className={linkClass("/admin")}>
          📊 Dashboard
        </Link>

        {/* Campañas */}
        <Link
          href="/admin/campaigns"
          className={linkClass("/admin/campaigns")}
        >
          📁 Campañas
        </Link>

        {/* Campañas Pendientes */}
        <Link
          href="/admin/campaigns/pending"
          className={linkClass("/admin/campaigns/pending")}
        >
          ⏳ Pendientes
        </Link>

        {/* Usuarios */}
        <Link
          href="/admin/users"
          className={linkClass("/admin/users")}
        >
          👥 Usuarios
        </Link>

        {/* Auditoría */}
        <Link
          href="/admin/logs"
          className={linkClass("/admin/logs")}
        >
          📝 Auditoría
        </Link>

      </nav>

      {/* Footer */}
      <div className="mt-auto pt-10 border-t text-xs text-gray-400">
        Sistema Administrativo v1.0
      </div>
    </aside>
  );
}