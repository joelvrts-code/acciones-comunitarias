import prisma from "@/lib/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendMobilizationEmail(
  subject: string,
  message: string,
  campaignUrl: string
) {

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
          <a href="${campaignUrl}">
            Participar ahora
          </a>
        </p>

        <hr>

        <p>Acciones Comunitarias</p>
      `,
    });

  }

}