import { prisma } from "./prisma";

export async function createCampaign(
  title: string,
  description: string,
  goal: number
) {
  return prisma.campaign.create({
    data: {
      title,
      description,
      goal,
      status: "activa",
    },
  });
}

export async function getCampaignById(id: number) {
  return prisma.campaign.findUnique({
    where: { id },
    include: {
      participants: true,
      _count: {
        select: { participants: true },
      },
    },
  });
}

export async function getAllCampaigns() {
  return prisma.campaign.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { participants: true },
      },
    },
  });
}