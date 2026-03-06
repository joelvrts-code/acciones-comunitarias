import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      title,
      description,
      goal,
      type,
      creatorName,
      creatorEmail,
      emailTargets,
    } = body;

    // 🛑 Validaciones básicas
    if (
      !title ||
      !description ||
      !goal ||
      !type ||
      !creatorName ||
      !creatorEmail
    ) {
      return NextResponse.json(
        { error: "Todos los campos son obligatorios" },
        { status: 400 }
      );
    }

    if (!["petition", "email", "hybrid"].includes(type)) {
      return NextResponse.json(
        { error: "Tipo de campaña inválido" },
        { status: 400 }
      );
    }

    // 🛑 Anti spam básico (evita duplicados exactos)
    const existing = await prisma.campaign.findFirst({
      where: {
        title,
        creatorEmail,
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Ya enviaste una campaña con este título." },
        { status: 400 }
      );
    }

    // 1️⃣ Crear campaña
    const campaign = await prisma.campaign.create({
      data: {
        title,
        description,
        goal: Number(goal),
        type,
        status: "pendiente",
        creatorName,
        creatorEmail,
      },
    });

    // 2️⃣ Crear destinatarios si aplica
    if ((type === "email" || type === "hybrid") && emailTargets) {
      const lines = emailTargets.split("\n");

      for (const line of lines) {
        const [name, email] = line.split(",");

        if (name && email) {
          await prisma.emailTarget.create({
            data: {
              name: name.trim(),
              email: email.trim(),
              campaignId: campaign.id,
            },
          });
        }
      }
    }

    // 3️⃣ Auditoría
    await prisma.auditLog.create({
      data: {
        action: "CREAR_CAMPAÑA_PUBLICA",
        message: `Nueva campaña enviada: "${campaign.title}"`,
      },
    });

    // 4️⃣ Email confirmación al creador
    await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: creatorEmail,
      subject: "Tu campaña fue recibida",
      html: `
        <h2>Hola ${creatorName},</h2>
        <p>Recibimos tu campaña:</p>
        <strong>${campaign.title}</strong>
        <p>Está pendiente de revisión.</p>
        <p>Te notificaremos cuando sea aprobada o rechazada.</p>
        <br/>
        <p>Equipo Acciones Comunitarias</p>
      `,
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al crear campaña" },
      { status: 500 }
    );
  }
}