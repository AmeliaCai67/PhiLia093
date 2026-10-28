import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { P2, FONT_MONO } from "../v2/palette2";
import { DUR_SEC, FPS } from "./script3";
import { Viz3 } from "./Viz3";
import { Terminal3 } from "./Terminal3";

/** PhiliaV3 —— 精华段 0:00–3:33 全本（215s），无声出画面，配原声播放 */
export const PhiliaV3: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const fadeOut = interpolate(frame, [DUR_SEC * FPS - 45, DUR_SEC * FPS - 6], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeIn = interpolate(frame, [0, 14], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: P2.bg, opacity: Math.min(fadeIn, fadeOut) }}>
      <div
        style={{
          height: 46,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 28px",
          borderBottom: `1px solid ${P2.border}`,
          fontFamily: FONT_MONO,
          fontSize: 18,
          color: P2.ivoryDim,
          letterSpacing: 2,
        }}
      >
        <span>
          <span style={{ color: P2.lilac }}>▚</span> PhiLiA093 · 记忆归档终端
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span>翁法罗斯 · 岁 月</span>
          <span style={{ color: P2.pink, opacity: Math.abs(Math.sin(t * 1.6)) }}>●</span>
          <span>在线</span>
        </span>
      </div>

      <Viz3 />
      <Terminal3 />

      <AbsoluteFill
        style={{
          background: `repeating-linear-gradient(to bottom, ${P2.scanline} 0px, ${P2.scanline} 1px, transparent 1px, transparent 4px)`,
          pointerEvents: "none",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(78% 62% at 50% 46%, rgba(0,0,0,0) 55%, rgba(12,5,9,0.42) 100%)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
