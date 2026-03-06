"use client";

import {
  changeUserRole,
  toggleUserStatus,
  resetUserPassword,
} from "./actions";
import { useTransition } from "react";
import toast from "react-hot-toast";

interface Props {
  userId: number;
  role: string;
  isCurrentUser: boolean;
  isActive: boolean;
}

export default function UserActions({
  userId,
  role,
  isCurrentUser,
  isActive,
}: Props) {
  const [isPending, startTransition] = useTransition();

  // 🚫 No permitir acciones sobre el usuario actual
  if (isCurrentUser) {
    return (
      <span className="text-gray-400 text-sm">
        Usuario actual
      </span>
    );
  }

  // 🔄 Cambiar Rol
  const handleRoleChange = () => {
    startTransition(async () => {
      try {
        await changeUserRole(userId, role);
        toast.success("Rol actualizado correctamente");
      } catch {
        toast.error("Error al cambiar rol");
      }
    });
  };

  // 🔐 Reset Password
  const handleResetPassword = () => {
    const newPassword = prompt(
      "Ingrese la nueva contraseña (mínimo 6 caracteres):"
    );

    if (!newPassword) return;

    if (newPassword.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    startTransition(async () => {
      try {
        await resetUserPassword(userId, newPassword);
        toast.success("Contraseña actualizada correctamente");
      } catch (error: any) {
        toast.error(
          error.message || "Error al actualizar contraseña"
        );
      }
    });
  };

  // 🔥 Activar / Desactivar usuario
  const handleToggleStatus = () => {
    const confirmed = confirm(
      isActive
        ? "¿Deseas desactivar este usuario?"
        : "¿Deseas activar este usuario?"
    );

    if (!confirmed) return;

    startTransition(async () => {
      try {
        await toggleUserStatus(userId);
        toast.success(
          isActive
            ? "Usuario desactivado correctamente"
            : "Usuario activado correctamente"
        );
      } catch {
        toast.error("Error al actualizar estado del usuario");
      }
    });
  };

  return (
    <div className="flex gap-2 flex-wrap">
      {/* Cambiar Rol */}
      <button
        onClick={handleRoleChange}
        disabled={isPending}
        className="bg-yellow-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-yellow-600 transition disabled:opacity-50"
      >
        Cambiar Rol
      </button>

      {/* Reset Password */}
      <button
        onClick={handleResetPassword}
        disabled={isPending}
        className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-700 transition disabled:opacity-50"
      >
        Reset Pass
      </button>

      {/* Activar / Desactivar */}
      <button
        onClick={handleToggleStatus}
        disabled={isPending}
        className={`px-3 py-1 rounded-lg text-sm text-white transition disabled:opacity-50 ${
          isActive
            ? "bg-gray-600 hover:bg-gray-700"
            : "bg-green-600 hover:bg-green-700"
        }`}
      >
        {isActive ? "Desactivar" : "Activar"}
      </button>
    </div>
  );
}