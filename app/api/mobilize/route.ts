import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {

  const { subject, message, url } = await req.json();

  try {

    const participants = await prisma.participant.findMany({
      where: {
        subscribed: true
      },
      distinct: ["email"],
      select: {
        email: true,
        firstName: true
      }
    });

    for (const user of participants) {

      await resend.emails.send({
        from: "Acciones Comunitarias <no-reply@accionescomunitarias.org>",
        to: user.email,
        subject,
        html: `
          <h2>${subject}</h2>

          <p>Hola ${user.firstName},</p>

          <p>${message}</p>

          <p>
            <a href="${url}">
              Participar ahora
            </a>
          </p>

          <hr>

          <p>
            Acciones Comunitarias
          </p>
        `,
      });

    }

    return NextResponse.json({
      success: true
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      { success: false },
      { status: 500 }
    );

  }

}