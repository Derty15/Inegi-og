import { ImageResponse } from '@vercel/og';

export const config = { runtime: 'edge' };

export default async function handler() {
  return new ImageResponse(
    (
      <div style={{
        width: "100%", height: "100%",
        display: "flex", justifyContent: "center", alignItems: "center",
        fontSize: 48, background: "white", color: "black"
      }}>
        Prueba INEGI OG
      </div>
    ),
    { width: 800, height: 400 }
  );
}
