import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const campaignId = Number(params.id);

  if (!campaignId) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  await prisma.campaign.update({
    where: { id: campaignId },
    data: { status: "cerrada" },
  });

  return NextResponse.json({ success: true });
}