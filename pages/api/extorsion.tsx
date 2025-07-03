import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default async function handler() {
  const res = await fetch("https://www.inegi.org.mx/app/api/indicadores/desarrolladores/jsonxml/INDICATOR/6200028410/es/0700/true/BISE/2.0/b55cfc56-efff-64fa-7ab0-88938cd3d197?type=json");
  const json = await res.json();
  const poblacion = Number(json.Series[0].OBSERVATIONS[0].OBS_VALUE).toLocaleString("es-MX");

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
          fontSize: 42,
          fontWeight: 'bold',
          color: '#222',
        }}
      >
        <div>Tasa de incidencia delictiva por extorsión por cada cien mil habitantes</div>
        <div>{poblacion}</div>
      </div>
    ),
    {
      width: 800,
      height: 400,
    }
  );
}
