"use client";

import { useRouter } from "next/navigation";

interface Props {
  campaignId: number;
  status: string;
}

export default function CampaignActions({
  campaignId,
  status,
}: Props) {
  const router = useRouter();

  const closeCampaign = async () => {
    if (!confirm("¿Cerrar esta campaña?")) return;

    await fetch(`/api/admin/campaigns/${campaignId}/close`, {
      method: "POST",
    });

    router.refresh();
  };

  const deleteCampaign = async () => {
    if (!confirm("¿Eliminar esta campaña? Esto no se puede deshacer.")) return;

    await fetch(`/api/admin/campaigns/${campaignId}/delete`, {
      method: "DELETE",
    });

    router.refresh();
  };

  const exportCSV = () => {
    window.open(
      `/api/admin/campaigns/${campaignId}/export`,
      "_blank"
    );
  };

  return (
    <div className="flex gap-2 flex-wrap">
      {status === "activa" && (
        <button
          onClick={closeCampaign}
          className="bg-yellow-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-yellow-600 transition"
        >
          Cerrar
        </button>
      )}

      <button
        onClick={exportCSV}
        className="bg-indigo-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-indigo-700 transition"
      >
        Exportar
      </button>

      <button
        onClick={deleteCampaign}
        className="bg-red-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-red-700 transition"
      >
        Eliminar
      </button>
    </div>
  );
}