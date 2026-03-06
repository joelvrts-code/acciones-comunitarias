import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const campaignId = Number(params.id);

  const campaign = await prisma.campaign.findUnique({
    where: { id: campaignId },
    include: { participants: true },
  });

  if (!campaign) {
    return NextResponse.json({ error: "No encontrada" }, { status: 404 });
  }

  const csvHeader = "Nombre,Apellido,Email,ZipCode,Fecha\n";

  const csvRows = campaign.participants
    .map((p) => {
      return `${p.firstName},${p.lastName},${p.email},${p.zipCode},${p.createdAt.toISOString()}`;
    })
    .join("\n");

  const csvContent = csvHeader + csvRows;

  return new NextResponse(csvContent, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="campaign-${campaignId}-participants.csv"`,
    },
  });
}