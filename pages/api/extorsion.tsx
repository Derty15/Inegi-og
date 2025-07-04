import { ImageResponse } from '@vercel/og';

export const config = { runtime: 'edge' };

const meses = ["enero","febrero","marzo","abril","mayo","junio",
               "julio","agosto","septiembre","octubre","noviembre","diciembre"];

const fechaLegible = (raw:string) =>
  raw.includes("-")
    ? `${meses[+raw.split("-")[1]-1]} ${raw.split("-")[0]}`
    : raw.includes("T")
      ? `trimestre ${raw.split("T")[1]} de ${raw.split("T")[0]}`
      : raw;

function formatoNumero(numStr = "") {
  const n = parseFloat(numStr);
  const entero = Math.floor(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const dec = n.toFixed(2).split(".")[1];          // dos decimales
  return `${entero}.${dec}`;
}
function fechaLastUpdate(raw: string): string {
  // Reemplazar "a. m." y "p. m." por formatos válidos
  const limpio = raw.replace("a. m.", "AM").replace("p. m.", "PM");

  // Dividir día, mes, año (DD/MM/YYYY HH:MM:SS)
  const [fechaParte] = limpio.split(" ");
  const [dia, mes, anio] = fechaParte.split("/");

  // Devuelve formato legible: "19 de septiembre de 2024"
  const meses = ["enero","febrero","marzo","abril","mayo","junio",
                 "julio","agosto","septiembre","octubre","noviembre","diciembre"];
  return `${parseInt(dia)} de ${meses[parseInt(mes)-1]} de ${anio}`;
}


// URL usando jsonxml y type=json
const URL =
  "https://www.inegi.org.mx/app/api/indicadores/desarrolladores/jsonxml/INDICATOR/6200028410/es/0700/true/BISE/2.0/b55cfc56-efff-64fa-7ab0-88938cd3d197?type=json";

export default async function handler() {
  try {
    const r = await fetch(URL);
    if (!r.ok) throw new Error(`INEGI API error: ${r.status}`);
    const j = await r.json();
    
    const obs = j?.Series?.[0]?.OBSERVATIONS?.[0];
    if (!obs) throw new Error("No hay datos en la estructura esperada");

    const valor = formatoNumero(obs.OBS_VALUE);

    const fecha = fechaLastUpdate(j.Series?.[0]?.LASTUPDATE || "");

    return new ImageResponse(
      <div style={{
        background: "linear-gradient(to bottom, #ffffff, #e8f0fe)",
        width:"100%",height:"100%",
        display:"flex",
        flexDirection:"column",
        justifyContent:"center",
        alignItems:"center",
        fontWeight:"bold",
        color:"#1a1a1a",
        padding:"24px"}}>
        <div style={{display: 'flex', fontSize:32, textAlign:"center", maxWidth:700}}>
          Tasa de incidencia delictiva por extorsión (por cada 100 mil habitantes)
        </div>
        <div style={{display: 'flex', fontSize:64, color:"#1a73e8", margin:"24px 0"}}>{valor}</div>
        <div style={{display: 'flex', fontSize:28, color:"#444"}}>Actualizado a {fecha}</div>
        <div style={{display: 'flex', fontSize:20, color:"#777", marginTop:12}}>Fuente: INEGI</div>
      </div>,
      { width: 800, height: 400 }
    );

  } catch (err:any) {
    return new ImageResponse(
      <div style={{
        width:"100%",height:"100%",display:"flex",justifyContent:"center",
        alignItems:"center",background:"#ffeaea",color:"#b30000",
        fontSize:24,padding:"20px",textAlign:"center"}}>
        Error: {err.message}
      </div>,
      { width: 800, height: 400 }
    );
  }
}
