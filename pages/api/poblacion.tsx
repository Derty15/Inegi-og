import { ImageResponse } from '@vercel/og';

export const config = { runtime: 'edge' };

const meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio",
               "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
const fechaLegible = (raw: string) =>
  raw.includes("-")
    ? `${meses[+raw.split("-")[1] - 1]} ${raw.split("-")[0]}`
    : raw.includes("T")
    ? `trimestre ${raw.split("T")[1]} de ${raw.split("T")[0]}`
    : raw;

const sepMiles = (n: string) => n.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const URL =
  "https://www.inegi.org.mx/app/api/indicadores/desarrolladores/jsonxml/" +
  "INDICATOR/6200028409/es/0700/true/BISE/2.0/b55cfc56-efff-64fa-7ab0-88938cd3d197?type=json";

export default async function handler() {
  try {
    const r = await fetch(URL);
    if (!r.ok) throw new Error(`INEGI API error: ${r.status}`);
    const j = await r.json();
    const obs = j?.Series?.[0]?.OBSERVATIONS?.[0];
    if (!obs) throw new Error("No hay datos en la estructura esperada");

    const valor = sepMiles(obs.OBS_VALUE);
    const fecha = fechaLegible(obs.TIME_PERIOD);

    return new ImageResponse(
      (
        <div
          style={{
            background: "linear-gradient(to bottom, #ffffff, #e8f0fe)",
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            fontWeight: "bold",
            color: "#1a1a1a",
            padding: "24px",
            textAlign: "center",
          }}
        >
          <div style={{
            fontSize: 32,
            maxWidth: 680,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center"
          }}>
            <span>Tasa de robo o asalto</span>
            <span>en calle o transporte público</span>
            <span>(por cada 100&nbsp;000 habitantes)</span>
          </div>
          <div style={{ fontSize: 64, color: "#1a73e8", margin: "24px 0" }}>{valor}</div>
          <div style={{ fontSize: 28, color: "#444" }}>Actualizado a {fecha}</div>
          <div style={{ fontSize: 20, color: "#777", marginTop: 12 }}>Fuente: INEGI</div>
        </div>
      ),
      { width: 800, height: 400 }
    );
  } catch (err: any) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "#ffeaea",
            color: "#b30000",
            fontSize: 24,
            padding: "20px",
            textAlign: "center",
          }}
        >
          Error: {err.message}
        </div>
      ),
      { width: 800, height: 400 }
    );
  }
}
