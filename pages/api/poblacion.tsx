import { ImageResponse } from '@vercel/og';

export const config = { runtime: 'edge' };

/* Convierte “2024-06” → “junio 2024” o “2024-T4” → “trimestre 4 de 2024” */
function fechaLegible(raw: string) {
  const m = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
  if (raw.includes("-")) {
    const [a, mes] = raw.split("-");
    const idx = parseInt(mes, 10) - 1;
    return `${m[idx]} ${a}`;
  }
  if (raw.includes("T")) {
    const [a, t] = raw.split("T");
    return `trimestre ${t} de ${a}`;
  }
  return raw;
}

/* Añade separadores de miles (sin usar Intl) */
const sepMiles = (num: string) =>
  num.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const URL = "https://www.inegi.org.mx/app/api/indicadores/desarrolladores/jsonxml/INDICATOR/6200028409/es/0700/true/BISE/2.0/b55cfc56-efff-64fa-7ab0-88938cd3d197?type=json";

export default async function handler() {
  try {
    const r = await fetch(URL);
    if (!r.ok) throw new Error(`INEGI API error: ${r.status}`);
    const j = await r.json();

    const obs = j.Series?.[0]?.OBSERVATIONS?.[0];
    if (!obs) throw new Error("Estructura de respuesta inesperada");

    const poblacion = sepMiles(obs.OBS_VALUE);
    const fecha     = fechaLegible(obs.TIME_PERIOD);

    return new ImageResponse(
      <div style={{
        background: "linear-gradient(#fff,#e8f0fe)",
        width:"100%",height:"100%",
        display:"flex",flexDirection:"column",
        justifyContent:"center",alignItems:"center",
        fontWeight:"bold",color:"#1a1a1a",padding:"24px"}}
      >
        <div>Población estimada en México</div>
        <div style={{fontSize:64,color:"#1a73e8",margin:"20px 0"}}>{poblacion}</div>
        <div style={{fontSize:28,color:"#444"}}>Actualizado a {fecha}</div>
        <div style={{fontSize:20,color:"#777",marginTop:16}}>Fuente: INEGI</div>
      </div>,
      { width: 800, height: 400 }
    );

  } catch (err:any) {
    /* Imagen de fallback con el mensaje de error */
    return new ImageResponse(
      <div style={{
        width:"100%",height:"100%",display:"flex",
        justifyContent:"center",alignItems:"center",
        background:"#ffeaea",color:"#b30000",
        fontSize:24,fontFamily:"sans-serif",padding:"20px",
        textAlign:"center"}}>
        Error: {err.message}
      </div>,
      { width: 800, height: 400 }
    );
  }
}

