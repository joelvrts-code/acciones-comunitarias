"use client";

import { useState } from "react";

export default function JoinCampaign({ campaignId }: { campaignId: number }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [zipCode, setZipCode] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await fetch("/api/participants", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        zipCode,
        campaignId,
      }),
    });

    window.location.reload();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Unirse a la campaña</h3>

      <input
        placeholder="Nombre"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        required
      />
      <br />

      <input
        placeholder="Apellido"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        required
      />
      <br />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <br />

      <input
        placeholder="Zip Code"
        value={zipCode}
        onChange={(e) => setZipCode(e.target.value)}
        required
      />
      <br />

      <button type="submit">Unirme</button>
    </form>
  );
}