"use client";

import { createUser } from "./actions";
import { useTransition } from "react";
import toast from "react-hot-toast";

export default function CreateUserForm() {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      try {
        await createUser(formData);
        toast.success("Usuario creado correctamente");
      } catch (error: any) {
        toast.error(error.message || "Error al crear usuario");
      }
    });
  };

  return (
    <form
      action={handleSubmit}
      className="grid md:grid-cols-4 gap-4"
    >
      <input
        name="name"
        placeholder="Nombre"
        className="border p-2 rounded-lg"
        required
      />

      <input
        name="email"
        type="email"
        placeholder="Email"
        className="border p-2 rounded-lg"
        required
      />

      <input
        name="password"
        type="password"
        placeholder="Password"
        className="border p-2 rounded-lg"
        required
      />

      <select
        name="role"
        className="border p-2 rounded-lg"
        required
      >
        <option value="editor">Editor</option>
        <option value="admin">Admin</option>
      </select>

      <button
        type="submit"
        disabled={isPending}
        className="md:col-span-4 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
      >
        Crear Usuario
      </button>
    </form>
  );
}