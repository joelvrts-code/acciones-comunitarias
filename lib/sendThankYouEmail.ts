import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendThankYouEmail(
  email: string,
  firstName: string,
  campaignTitle: string,
  campaignId: number
) {

  const shareUrl = `https://accionescomunitarias.org/campaigns/${campaignId}`;

  await resend.emails.send({
    from: "Acciones Comunitarias <no-reply@accionescomunitarias.org>",
    to: email,
    subject: "Gracias por apoyar esta campaña",
    html: `
      <h2>Gracias por participar, ${firstName}</h2>

      <p>
        Tu apoyo a la campaña
        <strong>${campaignTitle}</strong>
        ayuda a impulsar cambios reales en nuestras comunidades.
      </p>

      <p>
        Puedes ayudar aún más compartiendo la campaña:
      </p>

      <p>
        <a href="${shareUrl}">
          ${shareUrl}
        </a>
      </p>

      <p>
        Gracias por ser parte del cambio.
      </p>

      <hr>

      <p>
        Acciones Comunitarias
      </p>
    `,
  });

}