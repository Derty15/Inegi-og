import { ImageResponse } from "@vercel/og";

export const config = { runtime: "edge" };

const meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio",
               "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

const fechaMX = (raw = "") => {
  const [d, m, a] = raw.split("/");
  return `${parseInt(d, 10)} de ${meses[parseInt(m, 10) - 1]} de ${a}`;
};

const num4Dec = (n = "") =>
  parseFloat(n).toFixed(4).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const URL =
  "https://www.banxico.org.mx/SieAPIRest/service/v1/series/SF43718/datos/oportuno?token=2cf9846d904329700f8531bc09651a40dcc00194870ab13a7cda12e58ea867dc";

export default async function handler() {
  try {
    const r = await fetch(URL);
    if (!r.ok) throw new Error(`Banxico API error: ${r.status}`);
    const xml = await r.text();

    const datoMatch = xml.match(/<dato>\s*([^<]+?)\s*<\/dato>/i);
    const fechaMatch = xml.match(/<fecha>\s*([^<]+?)\s*<\/fecha>/i);

    if (!datoMatch || !fechaMatch) {
      console.error("XML recibido:", xml); // Este log te ayuda a debuggear
      throw new Error("Estructura XML inesperada. No se encontraron <dato> o <fecha>.");
    }

    const valor = num4Dec(datoMatch[1]);
    const fecha = fechaMX(fechaMatch[1]);

    return new ImageResponse(
      <div style={{
        background: "linear-gradient(to bottom, #ffffff, #e8f0fe)",
        width: "100%", height: "100%",
        display: "flex", flexDirection: "column",
        justifyContent: "center", alignItems: "center",
        fontWeight: "bold", color: "#1a1a1a",
        padding: "24px", textAlign: "center"
      }}>
        <div style={{ display: "flex", fontSize: 32, marginBottom: 10 }}>
          Tipo de cambio FIX (MXN / USD)
        </div>
        <div style={{ display: "flex", fontSize: 64, color: "#1a73e8", margin: "20px 0" }}>
          {valor}
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#444" }}>
          Actualizado a {fecha}
        </div>
        <div style={{ display: "flex", fontSize: 20, color: "#777", marginTop: 16 }}>
          Fuente: Banxico
        </div>
      </div>,
      { width: 800, height: 400 }
    );

  } catch (err: any) {
    return new ImageResponse(
      <div style={{
        width: "100%", height: "100%",
        display: "flex", justifyContent: "center", alignItems: "center",
        background: "#ffeaea", color: "#b30000",
        fontSize: 24, padding: "20px", textAlign: "center"
      }}>
        Error: {err.message}
      </div>,
      { width: 800, height: 400 }
    );
  }
}
