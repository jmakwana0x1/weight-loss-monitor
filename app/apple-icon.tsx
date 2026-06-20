import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        background: "#080808",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "40px",
        border: "3px solid rgba(163,230,53,0.3)",
      }}
    >
      <div
        style={{
          fontSize: 96,
          fontWeight: 900,
          color: "#a3e635",
          fontFamily: "sans-serif",
          lineHeight: 1,
          letterSpacing: "-4px",
        }}
      >
        W
      </div>
    </div>,
    { ...size }
  );
}
