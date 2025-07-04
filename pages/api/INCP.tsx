import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

const meses = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
];

function formatearFecha(raw: string = "") {
  if (raw.includes("-")) {
    const [año, mes] = raw.split("-");
    return `${meses[parseInt(mes) - 1]} ${año}`;
  }
  if (raw.includes("T")) {
    const [año, trimestre] = raw.split("T");
    return `trimestre ${trimestre} de ${año}`;
  }
  return raw;
}

function sepMiles(n: string = "") {
  return n.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default async function handler() {
  const res = await fetch("https://www.inegi.org.mx/app/api/indicadores/desarrolladores/jsonxml/INDICATOR/910427/es/0700/true/BIE/2.0/b55cfc56-efff-64fa-7ab0-88938cd3d197?type=json");
  const json = await res.json();

  const serie = json.Series?.[0]?.OBSERVATIONS?.[0];
  const valor = sepMiles(serie?.OBS_VALUE);
  const fecha = formatearFecha(serie?.TIME_PERIOD);

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
          padding: '20px',
          color: '#222',
          textAlign: 'center',
          fontFamily: 'sans-serif'
        }}
      >
        <div style={{ display: 'flex', fontSize: 34 }}>Índice Nacional de Precios al Consumidor</div>
        <div style={{ display: 'flex', fontSize: 60, color: '#1a73e8', margin: '20px 0' }}>{valor}</div>
        <div style={{ display: 'flex', fontSize: 24 }}>Actualizado a {fecha}</div>
        <div style={{ display: 'flex', fontSize: 20, marginTop: 16, color: '#555' }}>Fuente: INEGI</div>
      </div>
    ),
    {
      width: 800,
      height: 400,
    }
  );
}
