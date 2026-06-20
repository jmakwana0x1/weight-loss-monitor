import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        background: "#080808",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "7px",
        border: "1px solid rgba(163,230,53,0.25)",
      }}
    >
      <div
        style={{
          fontSize: 18,
          fontWeight: 900,
          color: "#a3e635",
          fontFamily: "sans-serif",
          lineHeight: 1,
          letterSpacing: "-1px",
        }}
      >
        W
      </div>
    </div>,
    { ...size }
  );
}
