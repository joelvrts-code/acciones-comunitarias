"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function AdminLoginPage() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e: React.FormEvent) {

    e.preventDefault();

    await signIn("credentials", {
      email,
      password,
      callbackUrl: "/admin"
    });

  }

  return (

    <main className="max-w-md mx-auto py-20 px-4">

      <h1 className="text-2xl font-bold mb-6">
        Acceso administrador
      </h1>

      <form onSubmit={handleLogin} className="space-y-4">

        <div>
          <label className="text-sm">Email</label>

          <input
            type="email"
            required
            className="w-full border rounded px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm">Contraseña</label>

          <input
            type="password"
            required
            className="w-full border rounded px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="w-full bg-blue-600 text-white py-2 rounded-lg">
          Entrar
        </button>

      </form>

    </main>

  );

}