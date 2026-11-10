import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = (searchParams.get("title") || "Crack Your Next Developer Interview").slice(0, 110);
  const eyebrow = (searchParams.get("eyebrow") || "Practical React interview preparation").slice(0, 70);

  return new ImageResponse(
    (
      <div style={{
        width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between",
        padding: "64px 76px", color: "#f7f8ff", background: "linear-gradient(135deg, #101326 0%, #1e2051 58%, #36338b 100%)",
        fontFamily: "Arial, sans-serif", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", width: 470, height: 470, right: -70, top: -185, borderRadius: 235, border: "1px solid rgba(184,181,255,.26)", display: "flex" }} />
        <div style={{ position: "absolute", width: 340, height: 340, right: -4, top: -120, borderRadius: 170, border: "1px solid rgba(184,181,255,.2)", display: "flex" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 26, fontWeight: 700 }}>
          <div style={{ width: 48, height: 48, borderRadius: 16, background: "#7772ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, color: "white" }}>R</div>
          <span>{siteConfig.name}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 22, maxWidth: 990 }}>
          <div style={{ color: "#b7b4ff", fontSize: 22, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase" }}>{eyebrow}</div>
          <div style={{ fontSize: title.length > 76 ? 52 : 66, fontWeight: 750, lineHeight: 1.08, letterSpacing: -2 }}>{title}</div>
          <div style={{ width: 118, height: 7, borderRadius: 8, background: "#8e8aff", display: "flex", marginTop: 6 }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", color: "#c6c8df", fontSize: 20 }}>
          <span>Clear explanations · Practical examples · Free guides</span>
          <span>interview-ready</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
