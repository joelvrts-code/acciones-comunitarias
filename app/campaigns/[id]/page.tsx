import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function CampaignPage({
  params,
}: {
  params: { id: string };
}) {

  const campaign = await prisma.campaign.findFirst({
    where: {
      id: Number(params.id),
      status: "activa",
    },
    include: {
      _count: {
        select: {
          participants: true,
        },
      },
    },
  });

  if (!campaign) {
    notFound();
  }

  const signatures = campaign._count.participants;

  const progress = Math.min(
    Math.round((signatures / campaign.goal) * 100),
    100
  );

  const shareUrl = `http://localhost:3000/campaigns/${campaign.id}`;

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">

      {/* VOLVER */}

      <Link
        href="/campaigns"
        className="text-sm text-blue-600 hover:underline mb-6 block"
      >
        ← Volver a campañas
      </Link>

      {/* TITULO */}

      <h1 className="text-3xl font-bold mb-6">
        {campaign.title}
      </h1>

      {/* IMAGEN */}

      {campaign.imageUrl && (
        <img
          src={campaign.imageUrl}
          className="w-full rounded-lg mb-6"
        />
      )}

      {/* CONTADOR */}

      <div className="mb-6">

        <p className="text-4xl font-bold text-blue-600">
          {signatures}
        </p>

        <p className="text-gray-600">
          personas han firmado esta campaña
        </p>

      </div>

      {/* PROGRESS */}

      <div className="mb-8">

        <div className="w-full bg-gray-200 h-3 rounded">

          <div
            className="bg-blue-600 h-3 rounded"
            style={{ width: `${progress}%` }}
          />

        </div>

        <p className="text-sm text-gray-600 mt-2">
          Meta: {campaign.goal} firmas
        </p>

      </div>

      {/* DESCRIPCION */}

      <div className="prose max-w-none mb-10">
        <p>{campaign.description}</p>
      </div>

      {/* BOTON FIRMAR */}

      <div className="mb-10">

        <a
          href={`#participate`}
          className="block text-center bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition font-medium text-lg"
        >
          Firmar esta campaña
        </a>

      </div>

      {/* COMPARTIR */}

      <div className="mb-12">

        <p className="font-semibold mb-3">
          Comparte esta campaña
        </p>

        <div className="flex gap-3">

          <a
            href={`https://wa.me/?text=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            WhatsApp
          </a>

          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
            target="_blank"
            className="bg-blue-700 text-white px-4 py-2 rounded"
          >
            Facebook
          </a>

          <a
            href={`https://twitter.com/intent/tweet?url=${shareUrl}`}
            target="_blank"
            className="bg-black text-white px-4 py-2 rounded"
          >
            Twitter
          </a>

        </div>

      </div>

      {/* FORMULARIO */}

      <div id="participate" className="border rounded-xl p-6 bg-white shadow-sm">

        <h2 className="text-xl font-semibold mb-4">
          Firma esta campaña
        </h2>

        <form
          action={`/api/participate/${campaign.id}`}
          method="POST"
          className="space-y-4"
        >

          <div>
            <label className="block text-sm mb-1">
              Nombre
            </label>

            <input
              name="firstName"
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">
              Apellido
            </label>

            <input
              name="lastName"
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">
              Email
            </label>

            <input
              name="email"
              type="email"
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">
              Zip Code
            </label>

            <input
              name="zipCode"
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* MOVILIZACIÓN CIUDADANA */}

          <div className="flex items-center gap-2">

            <input
              type="checkbox"
              name="subscribe"
              defaultChecked
            />

            <label className="text-sm text-gray-600">
              Quiero recibir alertas sobre nuevas campañas ciudadanas
            </label>

          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition font-medium"
          >
            Firmar campaña
          </button>

        </form>

      </div>

    </main>
  );
}