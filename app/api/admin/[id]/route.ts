import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

interface Props {
  params: { id: string };
}

export async function GET(
  request: Request,
  { params }: Props
) {
  const campaignId = Number(params.id);

  const campaign = await prisma.campaign.findUnique({
    where: { id: campaignId },
    include: { participants: true },
  });

  if (!campaign) {
    return NextResponse.json(
      { error: "Campaña no encontrada" },
      { status: 404 }
    );
  }

  // Cabecera CSV
  let csv = "Nombre,Apellido,Email,ZipCode,Fecha\n";

  campaign.participants.forEach((p) => {
    csv += `${p.firstName},${p.lastName},${p.email},${p.zipCode},${new Date(
      p.createdAt
    ).toLocaleDateString()}\n`;
  });

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="${campaign.title}-participantes.csv"`,
    },
  });
}