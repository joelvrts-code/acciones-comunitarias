import Providers from "../providers";
import TopBar from "./TopBar";
import Sidebar from "./Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <div className="flex min-h-screen bg-gray-100">
        {/* Sidebar */}
        <Sidebar />

        {/* Área derecha */}
        <div className="flex-1 flex flex-col">
          <TopBar />

          <main className="flex-1 p-8">
            {children}
          </main>
        </div>
      </div>
    </Providers>
  );
}