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
  let csv = "Nombre,Email,ZipCode,Fecha\n";

  campaign.participants.forEach((p) => {
    csv += `${p.name},${p.email},${p.zipCode ?? ""},${new Date(
      p.createdAt
    ).toLocaleDateString()}\n`;
  });

  // limpiar título para usarlo como nombre de archivo
  const safeTitle = campaign.title.replace(/[^a-z0-9]/gi, "_").toLowerCase();

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${safeTitle}-participantes.csv"`,
    },
  });
}