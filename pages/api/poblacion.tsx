import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

function formatearFecha(fecha: string) {
  const meses = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
  ];
  if (fecha.includes("-")) {
    const [año, mes] = fecha.split("-");
    const m = parseInt(mes, 10);
    if (!isNaN(m)) {
      return `${meses[m - 1]} ${año}`;
    }
  } else if (fecha.includes("T")) {
    const [año, trimestre] = fecha.split("T");
    return `trimestre ${trimestre} de ${año}`;
  }
  return fecha;
}

function formatearNumero(numStr: string) {
  const partes = numStr.split(".");
  const entero = partes[0];
  const decimal = partes[1] ? `.${partes[1]}` : "";
  return entero.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + decimal;
}

export default async function handler() {
  const res = await fetch("https://www.inegi.org.mx/app/api/indicadores/desarrolladores/json/INDICATOR/6200042410/es/00000/false/BIE/2.0/?token=b55cfc56-efff-64fa-7ab0-88938cd3d197");
  const json = await res.json();
  const obs = json.Series[0].OBSERVATIONS[0];
  const poblacion = formatearNumero(obs.OBS_VALUE);
  const fecha = formatearFecha(obs.TIME_PERIOD);

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(to bottom, #ffffff, #e8f0fe)',
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: 40,
          fontWeight: 'bold',
          color: '#1a1a1a',
          padding: '20px',
        }}
      >
        <div>Población estimada en México</div>
        <div style={{ fontSize: 64, margin: '20px 0', color: '#1a73e8' }}>{poblacion}</div>
        <div style={{ fontSize: 28, color: '#444' }}>Actualizado a {fecha}</div>
        <div style={{ fontSize: 20, marginTop: 20, color: '#777' }}>Fuente: INEGI</div>
      </div>
    ),
    {
      width: 800,
      height: 400,
    }
  );
}
