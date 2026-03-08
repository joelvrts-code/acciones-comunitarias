import prisma from "@/lib/prisma";

export async function sendMobilizationEmail(campaignId: number) {
  const participants = await prisma.participant.findMany({
    where: {
      campaignId: campaignId,
    },
    select: {
      email: true,
    },
  });

  const emails = participants.map((p) => p.email);

  console.log("Emails para movilización:", emails);

  // aquí luego conectamos el envío real de email
}