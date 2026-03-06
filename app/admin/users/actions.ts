"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

async function ensureAdmin() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    throw new Error("No autorizado");
  }

  return session;
}

export async function changeUserRole(
  userId: number,
  currentRole: string
) {
  await ensureAdmin();

  const newRole =
    currentRole === "admin" ? "editor" : "admin";

  await prisma.user.update({
    where: { id: userId },
    data: { role: newRole },
  });

  revalidatePath("/admin/users");
}

export async function toggleUserStatus(userId: number) {
  await ensureAdmin();

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("Usuario no encontrado");
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      isActive: !user.isActive,
    },
  });

  revalidatePath("/admin/users");
}
export async function createUser(formData: FormData) {
  await ensureAdmin();

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as string;

  if (!name || !email || !password || !role) {
    throw new Error("Todos los campos son obligatorios");
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("El email ya está registrado");
  }

  const bcrypt = await import("bcrypt");

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role,
    },
  });

  revalidatePath("/admin/users");
}

export async function resetUserPassword(
  userId: number,
  newPassword: string
) {
  await ensureAdmin();

  if (!newPassword || newPassword.length < 6) {
    throw new Error("La contraseña debe tener al menos 6 caracteres");
  }

  const bcrypt = await import("bcrypt");

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });

  revalidatePath("/admin/users");
}