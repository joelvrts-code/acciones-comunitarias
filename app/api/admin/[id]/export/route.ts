import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { zipMunicipios } from "@/lib/zipMunicipios";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const campaignId = Number(params.id);

  const campaign = await prisma.campaign.findUnique({
    where: { id: campaignId },
    include: {
      participants: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  if (!campaign) {
    return NextResponse.json({ error: "Campaña no encontrada" }, { status: 404 });
  }

  // eliminar emails duplicados
  const uniqueParticipants = Array.from(
    new Map(campaign.participants.map((p) => [p.email, p])).values()
  );

  const header = "name;email;zipCode;municipio;createdAt";

  const csvRows = uniqueParticipants
    .map((p) => {
      const municipio = zipMunicipios[p.zipCode ?? ""] ?? "";

      return `${p.name};${p.email};${p.zipCode ?? ""};${municipio};${p.createdAt.toISOString()}`;
    })
    .join("\n");

  const csv = header + "\n" + csvRows;

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="campaign-${campaignId}-participants.csv`,
    },
  });
}