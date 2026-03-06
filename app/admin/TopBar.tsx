"use client";

import { useSession, signOut } from "next-auth/react";

export default function TopBar() {
  const { data: session } = useSession();

  if (!session) return null;

  const initials =
    session.user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U";

  return (
    <div className="flex justify-between items-center bg-white px-8 py-4 shadow-sm border-b">
      <div>
        <h2 className="text-lg font-semibold">
          Bienvenido, {session.user?.name}
        </h2>
        <p className="text-sm text-gray-500">
          {session.user?.email}
        </p>
      </div>

      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
          {initials}
        </div>

        {/* Logout */}
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition text-sm"
        >
          Logout
        </button>
      </div>
    </div>
  );
}