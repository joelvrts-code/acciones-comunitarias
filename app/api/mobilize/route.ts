import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { campaignId, subject, message } = await request.json();

  if (!campaignId || !subject || !message) {
    return NextResponse.json(
      { error: "Faltan datos requeridos" },
      { status: 400 }
    );
  }

  const participants = await prisma.participant.findMany({
    where: {
      campaignId: Number(campaignId),
      subscribed: true
    },
    select: {
      email: true,
      name: true
    }
  });

  if (participants.length === 0) {
    return NextResponse.json({
      message: "No hay participantes para enviar correo"
    });
  }

  // Aquí normalmente enviarías los emails
  // (ejemplo simplificado)

  const recipients = participants.map((p) => ({
    email: p.email,
    name: p.name
  }));

  return NextResponse.json({
    success: true,
    totalRecipients: recipients.length
  });
}