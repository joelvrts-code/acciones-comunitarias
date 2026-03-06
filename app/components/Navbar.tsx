"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export default function Navbar() {

  const { data: session } = useSession();

  return (
    <header className="bg-white border-b shadow-sm">
      <div className="max-w-6xl mx-auto px-4">

        <div className="flex items-center justify-between h-16">

          {/* LOGO */}

          <Link
            href="/"
            className="text-xl font-bold text-blue-600 tracking-tight"
          >
            Acciones Comunitarias
          </Link>

          {/* MENU */}

          <nav className="flex items-center gap-6 text-sm">

            <Link
              href="/campaigns"
              className="text-gray-700 hover:text-blue-600 transition"
            >
              Campañas
            </Link>

            <Link
              href="/campaigns/new"
              className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition"
            >
              Crear campaña
            </Link>

            {/* ADMIN */}

            {session?.user?.role === "admin" && (
              <Link
                href="/admin"
                className="text-gray-700 hover:text-blue-600 transition"
              >
                Admin
              </Link>
            )}

            {/* LOGIN */}

            {!session && (
              <Link
                href="/admin/login"
                className="text-gray-700 hover:text-blue-600"
              >
                Login
              </Link>
            )}

            {/* LOGOUT */}

            {session && (
              <button
                onClick={() => signOut()}
                className="text-gray-700 hover:text-red-600"
              >
                Salir
              </button>
            )}

          </nav>

        </div>

      </div>
    </header>
  );
}