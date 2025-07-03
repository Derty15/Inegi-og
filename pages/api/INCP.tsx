import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

const meses = ["enero","febrero","marzo","abril","mayo","junio",
               "julio","agosto","septiembre","octubre","noviembre","diciembre"];

/* Convierte "2024-06" → "junio 2024" o "2024-T1" → "trimestre 1 de 2024" */
function fechaLegible(raw: string) {
  if (raw.includes("-")) {
    const [año, mes] = raw.split("-");
    const idx = parseInt(mes, 10) - 1;
    return `${meses[idx]} ${año}`;
  }
  if (raw.includes("T")) {
    const [año, trimestre] = raw.split("T");
    return `trimestre ${trimestre} de ${año}`;
  }
  return raw;
}

export default async function handler() {
  const res = await fetch("https://www.inegi.org.mx/app/api/indicadores/desarrolladores/jsonxml/INDICATOR/910427/es/0700/true/BIE/2.0/b55cfc56-efff-64fa-7ab0-88938cd3d197?type=json");
  const json = await res.json();

  const serie = json.Series?.[0]?.OBSERVATIONS?.[0];
  const valor = Number(serie?.OBS_VALUE).toLocaleString("es-MX");
  const fecha = fechaLegible(serie?.TIME_PERIOD || "");

  return new ImageResponse(
    (
      <div
        style={{
          background: '#f0f0f0',
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: 36,
          fontWeight: 'bold',
          color: '#222',
          textAlign: 'center',
          padding: '20px'
        }}
      >
        <div style={{ fontSize: 32, marginBottom: 10 }}>
          Índice Nacional de Precios al Consumidor
        </div>
        <div style={{ fontSize: 60, color: '#1a73e8', margin: '10px 0' }}>
          {valor}
        </div>
        <div style={{ fontSize: 24, color: '#555' }}>
          Actualizado a {fecha}
        </div>
        <div style={{ fontSize: 20, color: '#777', marginTop: 20 }}>
          Fuente: INEGI
        </div>
      </div>
    ),
    {
      width: 800,
      height: 400,
    }
  );
}
