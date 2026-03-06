"use server";

import prisma from "@/lib/prisma";

export async function approveCampaign(formData: FormData) {
  const id = Number(formData.get("campaignId"));

  await prisma.campaign.update({
    where: { id },
    data: { status: "activa" },
  });
}

export async function rejectCampaign(formData: FormData) {
  const id = Number(formData.get("campaignId"));

  await prisma.campaign.update({
    where: { id },
    data: { status: "rechazada" },
  });
}