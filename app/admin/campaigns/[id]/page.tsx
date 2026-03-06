import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"

interface Props {
  params: { id: string }
}

export default async function AdminCampaignPage({ params }: Props) {

  const campaign = await prisma.campaign.findUnique({
    where: {
      id: Number(params.id)
    },
    include: {
      _count: {
        select: {
          participants: true,
          emailLogs: true
        }
      }
    }
  })

  if (!campaign) return notFound()

  return (
    <div className="p-10 max-w-4xl">

      <h1 className="text-3xl font-bold mb-6">
        {campaign.title}
      </h1>

      {/* Imagen */}
      {campaign.imageUrl && (
        <img
          src={campaign.imageUrl}
          className="rounded-lg mb-6 w-full"
        />
      )}

      {/* Estado */}
      <div className="mb-6">
        <strong>Estado:</strong> {campaign.status}
      </div>

      {/* Meta */}
      <div className="mb-6">
        <strong>Meta:</strong> {campaign.goal}
      </div>

      {/* Tipo */}
      <div className="mb-6">
        <strong>Tipo:</strong> {campaign.type}
      </div>

      {/* Descripción */}
      {campaign.description && (
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-2">
            Descripción
          </h2>

          <p className="text-gray-700 leading-relaxed">
            {campaign.description}
          </p>
        </div>
      )}

      {/* Estadísticas */}
      <div className="bg-gray-100 p-6 rounded-lg">

        <h2 className="text-xl font-semibold mb-4">
          Estadísticas
        </h2>

        <div className="space-y-2">

          <div>
            Firmas: <strong>{campaign._count.participants}</strong>
          </div>

          <div>
            Emails enviados: <strong>{campaign._count.emailLogs}</strong>
          </div>

        </div>

      </div>

    </div>
  )
}