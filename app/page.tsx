export default function Home() {
  return (
    <main style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      background: "#f4f4f4",
      fontFamily: "Arial, sans-serif",
      textAlign: "center",
      padding: "2rem"
    }}>
      
      <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>
        Acciones Comunitarias
      </h1>

      <p style={{ 
        fontSize: "1.2rem", 
        maxWidth: "600px", 
        marginBottom: "2rem",
        lineHeight: "1.6"
      }}>
        Plataforma digital para que los ciudadanos de Puerto Rico 
        organicen, propongan y logren cambios reales.
      </p>

      <button style={{
        padding: "1rem 2rem",
        fontSize: "1rem",
        background: "#000",
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer"
      }}>
        Crear una Acción
      </button>

    </main>
  );
}
