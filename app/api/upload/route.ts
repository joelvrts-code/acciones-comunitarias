import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function POST(request: Request) {

  try {

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    //////////////////////////////////////
    // Validar tipo de archivo
    //////////////////////////////////////

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Solo se permiten imágenes" },
        { status: 400 }
      );
    }

    //////////////////////////////////////
    // Límite 5MB
    //////////////////////////////////////

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "La imagen excede 5MB" },
        { status: 400 }
      );
    }

    //////////////////////////////////////
    // Nombre único seguro
    //////////////////////////////////////

    const extension = file.name.split(".").pop();
    const filename = `${crypto.randomUUID()}.${extension}`;

    //////////////////////////////////////
    // Subir a Vercel Blob
    //////////////////////////////////////

    const blob = await put(filename, file, {
      access: "public",
    });

    return NextResponse.json({
      url: blob.url,
    });

  } catch (error) {

    console.error("Upload error:", error);

    return NextResponse.json(
      { error: "Error subiendo imagen" },
      { status: 500 }
    );

  }

}