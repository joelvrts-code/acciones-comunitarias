import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { zipMunicipios } from "@/lib/zipMunicipios";
import { sendThankYouEmail } from "@/lib/sendThankYouEmail";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {

  const campaignId = Number(params.id);
  const formData = await req.formData();

  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const email = formData.get("email") as string;
  const zipCode = formData.get("zipCode") as string | null;

  const subscribe = formData.get("subscribe") === "on";

  const municipio = zipCode
    ? zipMunicipios[zipCode] || null
    : null;

  const campaign = await prisma.campaign.findUnique({
    where: { id: campaignId },
    include: {
      emailTargets: true,
      _count: {
        select: {
          participants: true,
          emailLogs: true,
        },
      },
    },
  });

  if (!campaign) {
    return NextResponse.json(
      { error: "Campaña no encontrada" },
      { status: 404 }
    );
  }

  if (campaign.status === "cerrada") {
    return NextResponse.json(
      { error: "Esta campaña ya alcanzó su meta." },
      { status: 400 }
    );
  }

  try {

    const participant = await prisma.participant.create({
      data: {
        firstName,
        lastName,
        email,
        zipCode,
        municipio,
        subscribed: subscribe,
        campaignId,
        signed: campaign.type !== "email",
        emailed: campaign.type !== "petition",
      },
    });

    try {

      await sendThankYouEmail(
        email,
        firstName,
        campaign.title,
        campaign.id
      );

    } catch (emailError) {

      console.error("Error enviando email:", emailError);

    }

    if (campaign.type === "email" || campaign.type === "both") {

      await prisma.emailLog.create({
        data: {
          participantId: participant.id,
          campaignId,
        },
      });

    }

    const newTotal = campaign._count.participants + 1;

    if (newTotal >= campaign.goal) {

      await prisma.campaign.update({
        where: { id: campaignId },
        data: { status: "cerrada" },
      });

    }

    let mailto: string | null = null;

    if (campaign.type === "email" || campaign.type === "both") {

      const emails = campaign.emailTargets
        .map((t) => t.email)
        .join(",");

      const subject = encodeURIComponent(
        campaign.emailSubject || campaign.title
      );

      const footer = `

—
Este mensaje fue enviado mediante
accionescomunitarias.org`;

      const body = encodeURIComponent(
        `${campaign.emailBody || ""}

Enviado por: ${firstName} ${lastName}
Email: ${email}${footer}`
      );

      mailto = `mailto:?bcc=${emails}&subject=${subject}&body=${body}`;

    }

    return NextResponse.json({
      success: true,
      mailto,
    });

  } catch (error: any) {

    if (error.code === "P2002") {

      return NextResponse.json(
        { error: "Ya has participado en esta campaña." },
        { status: 400 }
      );

    }

    console.error(error);

    return NextResponse.json(
      { error: "Ocurrió un error inesperado." },
      { status: 500 }
    );

  }

}