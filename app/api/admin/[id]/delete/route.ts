import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const campaignId = Number(params.id);

  if (!campaignId) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  // Primero borrar participantes relacionados
  await prisma.participant.deleteMany({
    where: { campaignId },
  });

  // Luego borrar campaña
  await prisma.campaign.delete({
    where: { id: campaignId },
  });

  return NextResponse.json({ success: true });
}