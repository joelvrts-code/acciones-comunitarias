"use server";

import prisma from "@/lib/prisma";
import { saveImage } from "@/lib/upload";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

//////////////////////////////////////////////////////
// 🔐 Verificar admin
//////////////////////////////////////////////////////

async function requireAdmin() {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "admin") {
    throw new Error("No autorizado");
  }

  return session;
}

//////////////////////////////////////////////////////
// 📜 Crear audit log
//////////////////////////////////////////////////////

async function createAuditLog(
  action: string,
  message: string,
  userId?: number
) {
  try {
    await prisma.auditLog.create({
      data: {
        action,
        message,
        userId: Number(userId ?? 0),
      },
    });
  } catch (error) {
    console.error("Error creando audit log:", error);
  }
}

//////////////////////////////////////////////////////
// 🆕 CREAR CAMPAÑA (PÚBLICO)
//////////////////////////////////////////////////////

export async function createCampaign(formData: FormData) {

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const creatorName = String(formData.get("creatorName") ?? "").trim();
  const creatorEmail = String(formData.get("creatorEmail") ?? "").trim();

  const type = String(formData.get("type") ?? "petition");
  const goal = Number(formData.get("goal") ?? 100);

  const emailSubject = formData.get("emailSubject")?.toString() || null;
  const emailBody = formData.get("emailBody")?.toString() || null;

  const imageFile = formData.get("image") as File | null;

  if (!title || !description) {
    throw new Error("Faltan datos obligatorios");
  }

  let imageUrl: string | null = null;

  //////////////////////////////////////
  // Subir imagen
  //////////////////////////////////////

  if (imageFile && imageFile.size > 0) {
    try {
      imageUrl = await saveImage(imageFile);
    } catch (error) {
      console.error("Error subiendo imagen:", error);
    }
  }

  //////////////////////////////////////
  // Crear campaña
  //////////////////////////////////////

  const campaign = await prisma.campaign.create({
    data: {
      title,
      description,
      creatorName,
      creatorEmail,
      imageUrl,

      type,
      goal,

      emailSubject,
      emailBody,

      status: "pendiente",
    },
  });

  //////////////////////////////////////
  // Crear Email Targets
  //////////////////////////////////////

  const names = formData.getAll("emailTargetNames");
  const emails = formData.getAll("emailTargetEmails");

  if (names.length && emails.length) {

    for (let i = 0; i < emails.length; i++) {

      const name = String(names[i] || "");
      const email = String(emails[i] || "");

      if (email) {
        await prisma.emailTarget.create({
          data: {
            name,
            email,
            campaignId: campaign.id,
          },
        });
      }

    }

  }

  //////////////////////////////////////
  // Redirección
  //////////////////////////////////////

  redirect("/campaigns/pending");
}

//////////////////////////////////////////////////////
// ✅ APROBAR CAMPAÑA (ADMIN)
//////////////////////////////////////////////////////

export async function approveCampaign(formData: FormData) {

  const session = await requireAdmin();

  const campaignId = Number(formData.get("campaignId"));

  const campaign = await prisma.campaign.update({
    where: { id: campaignId },
    data: { status: "activa" },
  });

  await createAuditLog(
    "APROBAR_CAMPAÑA",
    `La campaña "${campaign.title}" fue aprobada`,
    session.user?.id
  );

  revalidatePath("/admin/campaigns/pending");
  revalidatePath("/campaigns");
}

//////////////////////////////////////////////////////
// ❌ RECHAZAR CAMPAÑA (ADMIN)
//////////////////////////////////////////////////////

export async function rejectCampaign(formData: FormData) {

  const session = await requireAdmin();

  const campaignId = Number(formData.get("campaignId"));

  const campaign = await prisma.campaign.update({
    where: { id: campaignId },
    data: { status: "rechazada" },
  });

  await createAuditLog(
    "RECHAZAR_CAMPAÑA",
    `La campaña "${campaign.title}" fue rechazada`,
    session.user?.id
  );

  revalidatePath("/admin/campaigns/pending");
}