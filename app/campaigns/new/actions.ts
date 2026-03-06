"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { put } from "@vercel/blob";

export async function createCampaign(formData: FormData) {

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const goal = Number(formData.get("goal"));
  const creatorName = formData.get("creatorName") as string;
  const creatorEmail = formData.get("creatorEmail") as string;
  const type = formData.get("type") as string;

  const emailSubject = formData.get("emailSubject") as string | null;
  const emailBody = formData.get("emailBody") as string | null;

  const targetNames = formData.getAll("emailTargetNames") as string[];
  const targetEmails = formData.getAll("emailTargetEmails") as string[];

  const file = formData.get("image") as File | null;

  let imageUrl: string | null = null;

  const token = process.env.BLOB_READ_WRITE_TOKEN;

  if (!title || !description || !goal || !creatorName || !creatorEmail || !type) {
    throw new Error("Datos incompletos");
  }

  if ((type === "email" || type === "both") && targetEmails.length === 0) {
    throw new Error("Debes indicar al menos un destinatario de email");
  }

  if (file && file.size > 5_000_000) {
    throw new Error("La imagen debe ser menor de 5MB");
  }

  //////////////////////////////////////////////////////
  // SUBIR IMAGEN
  //////////////////////////////////////////////////////

  if (file && file.size > 0 && token) {

    try {

      const filename = `${Date.now()}-${file.name}`;

      const blob = await put(filename, file, {
        access: "public",
        token
      });

      imageUrl = blob.url;

    } catch (error) {

      console.error("Error subiendo imagen:", error);
      imageUrl = null;

    }

  }

  //////////////////////////////////////////////////////
  // CREAR CAMPAÑA
  //////////////////////////////////////////////////////

  const campaign = await prisma.campaign.create({
    data: {
      title,
      description,
      goal,
      status: "pendiente",
      type,
      creatorName,
      creatorEmail,
      emailSubject: emailSubject || null,
      emailBody: emailBody || null,
      imageUrl: imageUrl || null
    },
  });

  //////////////////////////////////////////////////////
  // GUARDAR EMAIL TARGETS
  //////////////////////////////////////////////////////

  if (type === "email" || type === "both") {

    for (let i = 0; i < targetEmails.length; i++) {

      const email = targetEmails[i];
      const name = targetNames[i];

      if (!email) continue;

      await prisma.emailTarget.create({
        data: {
          name: name || "Destinatario",
          email,
          campaignId: campaign.id
        }
      });

    }

  }

  //////////////////////////////////////////////////////
  // REVALIDAR
  //////////////////////////////////////////////////////

  revalidatePath("/campaigns");
  revalidatePath(`/campaigns/${campaign.id}`);

  //////////////////////////////////////////////////////
  // REDIRECT
  //////////////////////////////////////////////////////

  redirect(`/campaigns/${campaign.id}`);

}