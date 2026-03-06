"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function approveCampaign(formData: FormData) {
  const id = Number(formData.get("campaignId"));

  await prisma.campaign.update({
    where: { id },
    data: { status: "aprobada" },
  });

  revalidatePath("/admin/campaigns/pending");
  revalidatePath("/campaigns");
}

export async function rejectCampaign(formData: FormData) {
  const id = Number(formData.get("campaignId"));

  await prisma.campaign.update({
    where: { id },
    data: { status: "rechazada" },
  });

  revalidatePath("/admin/campaigns/pending");
}