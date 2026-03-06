import Link from "next/link";

export default function PublicNavbar() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">

        <Link
          href="/"
          className="text-xl font-bold tracking-tight"
        >
          ACCIONES COMUNITARIAS
        </Link>

        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link href="/campaigns" className="hover:text-blue-600 transition">
            Campañas
          </Link>

          <Link
            href="/campaigns/new"
            className="hover:text-blue-600 transition"
          >
            Crear Campaña
          </Link>

          <Link
            href="/login"
            className="text-gray-600 hover:text-blue-600 transition"
          >
            Login
          </Link>
        </nav>

      </div>
    </header>
  );
}