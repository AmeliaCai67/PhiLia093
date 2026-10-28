import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { P2, FONT_MONO } from "../v2/palette2";
import { CHOICES, DUR_SEC, FPS, FRAMES_PER_CHAR, LINES, TYPE_DELAY, WHITE, BLACK, type Who } from "./script4";

const S = (v: number, a: number, b: number, c = 0, d = 1) =>
  interpolate(v, [a, b], [c, d], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

const BLOCK_SPINNER = ["▖", "▘", "▝", "▗"];

const accentOf = (who: Who) =>
  who === "xilian" ? P2.pink : who === "red" ? "#FF9B8A" : P2.ivory;

const SpeakerGlyph: React.FC<{ who: Who; frame: number }> = ({ who, frame }) => {
  if (who === "xilian") {
    const s = 1 + 0.12 * Math.sin(frame / 5);
    return <span style={{ color: P2.pink, marginRight: 16, display: "inline-block", transform: `scale(${s})` }}>✿</span>;
  }
  if (who === "red") return <span style={{ color: "#FF9B8A", marginRight: 18 }}>▲</span>;
  return <span style={{ color: P2.lilac, marginRight: 18 }}>▸</span>;
};

const lineStyle = (color: string): React.CSSProperties => ({
  position: "absolute",
  left: 150,
  right: 120,
  fontFamily: FONT_MONO,
  fontSize: 34,
  color,
  letterSpacing: 2,
  lineHeight: 1.5,
  whiteSpace: "normal",
  wordBreak: "break-all",
});

/** PhiliaV4 —— 字幕轨校验版：极简舞台 + 逐字逐秒字幕 + 选项盒 + 白/黑屏状态。无演出。 */
export const PhiliaV4: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;

  let curIdx = -1;
  LINES.forEach((l, i) => {
    if (t >= l.at) curIdx = i;
  });
  const prev = curIdx >= 1 ? LINES[curIdx - 1] : null;
  const cur = curIdx >= 0 ? LINES[curIdx] : null;
  const typed = cur
    ? cur.text.slice(0, Math.max(0, Math.floor((frame - cur.at * FPS - TYPE_DELAY) / FRAMES_PER_CHAR)))
    : "";
  const typing = cur ? typed.length < cur.text.length : false;

  const inWhite = WHITE.some(([a, b]) => t >= a && t < b);
  const inBlack = BLACK.some(([a, b]) => t >= a && t < b);
  const opening = t < 11.5;

  const fadeOut = interpolate(frame, [DUR_SEC * FPS - 45, DUR_SEC * FPS - 6], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: P2.bg, opacity: fadeOut }}>
      {/* 顶栏 */}
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
          <span>字幕轨校验版 · 无演出</span>
          <span>翁法罗斯 · 岁 月</span>
          <span style={{ color: P2.pink, opacity: Math.abs(Math.sin(t * 1.6)) }}>●</span>
        </span>
      </div>

      {/* 舞台：极简（章题 + 选项盒 + 白/黑屏状态） */}
      <AbsoluteFill style={{ position: "absolute", top: 46, height: 614, overflow: "hidden" }}>
        <AbsoluteFill style={{ backgroundColor: opening || inBlack ? "#000" : P2.bg }} />
        <div
          style={{
            position: "absolute",
            top: 30,
            width: "100%",
            textAlign: "center",
            fontFamily: '"Songti SC","STSong",serif',
            fontSize: 40,
            letterSpacing: 10,
            color: P2.gold,
            opacity: 0.5,
          }}
        >
          「 记忆的种子 」
        </div>
        {/* 选项盒：画面中部右侧 */}
        {CHOICES.map((c, i) => {
          if (t < c.at || t >= c.to) return null;
          const p = S(t, c.at, c.at + 0.4);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                right: 170,
                top: 260 + (i % 2) * 16,
                padding: "10px 34px",
                borderRadius: 12,
                border: `2px solid ${P2.gold}`,
                background: "rgba(226,198,140,0.12)",
                fontFamily: FONT_MONO,
                fontSize: 30,
                color: P2.gold,
                letterSpacing: 6,
                opacity: p,
                transform: `scale(${0.85 + 0.15 * p})`,
              }}
            >
              ▸ {c.text}
            </div>
          );
        })}
      </AbsoluteFill>

      {/* 下半：字幕终端 */}
      <div
        style={{
          position: "absolute",
          top: 660,
          left: 0,
          right: 0,
          height: 420,
          backgroundColor: P2.bgPanel,
          borderTop: `1px solid ${P2.border}`,
          overflow: "hidden",
        }}
      >
        {prev && (
          <div style={{ ...lineStyle(P2.ivory), top: 88, opacity: 0.3 }}>
            <SpeakerGlyph who={prev.who} frame={frame} />
            {prev.text}
          </div>
        )}
        {cur && (
          <div style={{ ...lineStyle(cur.who === "red" ? "#FF9B8A" : P2.ivory), top: 168 }}>
            <SpeakerGlyph who={cur.who} frame={frame} />
            <span>{typed}</span>
            <span
              style={{
                display: "inline-block",
                width: 17,
                height: 36,
                marginLeft: 8,
                backgroundColor: accentOf(cur.who),
                opacity: typing ? 1 : Math.abs(Math.sin(frame / 9)) * 0.85,
                verticalAlign: "-4px",
              }}
            />
          </div>
        )}
        <div style={{ position: "absolute", left: 150, bottom: 28, fontFamily: FONT_MONO, fontSize: 17, color: P2.ivoryDim, letterSpacing: 1 }}>
          哀怜 → 共情 → 爱
        </div>
        <div style={{ position: "absolute", right: 150, bottom: 28, fontFamily: FONT_MONO, fontSize: 17, color: P2.ivoryDim, letterSpacing: 1 }}>
          t+{String(Math.floor(t / 60)).padStart(2, "0")}:{String(Math.floor(t % 60)).padStart(2, "0")}.
          {String(Math.floor((t % 1) * 10))}
        </div>
      </div>

      {/* 白屏 / 黑屏状态（真实区间） */}
      {inWhite && <AbsoluteFill style={{ backgroundColor: "#F7F3F0" }} />}
      {inBlack && <AbsoluteFill style={{ backgroundColor: "#000" }} />}

      {/* 扫描线 + 暗角 */}
      <AbsoluteFill
        style={{
          background: `repeating-linear-gradient(to bottom, ${P2.scanline} 0px, ${P2.scanline} 1px, transparent 1px, transparent 4px)`,
          pointerEvents: "none",
        }}
      />
      <AbsoluteFill
        style={{
          background: "radial-gradient(78% 62% at 50% 46%, rgba(0,0,0,0) 55%, rgba(12,5,9,0.42) 100%)",
          pointerEvents: "none",
        }}
      />
      {/* 开场淡入 */}
      <AbsoluteFill style={{ backgroundColor: "#000", opacity: 1 - S(t, 0.2, 1.4) }} />
    </AbsoluteFill>
  );
};

function interpolate(v: number, [a, b]: [number, number], [c, d]: [number, number], opts: { extrapolateLeft: string; extrapolateRight: string }) {
  if (v <= a) return c;
  if (v >= b) return d;
  return c + ((v - a) / (b - a)) * (d - c);
}
