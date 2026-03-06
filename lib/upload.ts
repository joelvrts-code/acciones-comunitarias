import { randomUUID } from "crypto"
import { writeFile } from "fs/promises"
import path from "path"

const MAX_SIZE = 5 * 1024 * 1024

export async function saveImage(file: File) {

  if (!file) return null

  if (file.size > MAX_SIZE) {
    throw new Error("La imagen no puede superar 5MB")
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const extension = file.name.split(".").pop()

  const filename = `${randomUUID()}.${extension}`

  const filepath = path.join(
    process.cwd(),
    "public/uploads",
    filename
  )

  await writeFile(filepath, buffer)

  return `/uploads/${filename}`
}