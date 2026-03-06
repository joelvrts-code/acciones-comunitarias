import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  const existingAdmin = await prisma.user.findUnique({
    where: { email: "admin@accionescomunitarias.org" },
  })

  if (existingAdmin) {
    console.log("Admin ya existe")
    return
  }

  const hashedPassword = await bcrypt.hash("Admin123!", 10)

  await prisma.user.create({
    data: {
      name: "Administrador",
      email: "admin@accionescomunitarias.org",
      password: hashedPassword,
      role: "admin",
      isActive: true,
    },
  })

  console.log("✅ Admin creado correctamente")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })