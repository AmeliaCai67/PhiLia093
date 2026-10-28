import React from "react";
import { useCurrentFrame } from "remotion";
import { P2, FONT_MONO } from "../v2/palette2";
import { FPS, FRAMES_PER_CHAR, LINES, TYPE_DELAY, type Who } from "./script3";

const BLOCK_SPINNER = ["▖", "▘", "▝", "▗"];

const accentOf = (who: Who) =>
  who === "block" ? P2.lilac : who === "flower" ? P2.pink : who === "sys" ? "#FF9B8A" : P2.ivoryDim;

const SpeakerGlyph: React.FC<{ who: Who; frame: number }> = ({ who, frame }) => {
  if (who === "echo") {
    return <span style={{ color: P2.ivoryDim, marginRight: 18 }}>◈</span>;
  }
  if (who === "sys") {
    return <span style={{ color: "#FF9B8A", marginRight: 18 }}>▲</span>;
  }
  if (who === "block") {
    const g = BLOCK_SPINNER[Math.floor(frame / 4) % BLOCK_SPINNER.length];
    return <span style={{ color: P2.lilac, marginRight: 18 }}>{g}</span>;
  }
  const s = 1 + 0.12 * Math.sin(frame / 5);
  return (
    <span style={{ color: P2.pink, marginRight: 16, display: "inline-block", transform: `scale(${s})` }}>✿</span>
  );
};

const lineStyle = (color: string): React.CSSProperties => ({
  position: "absolute",
  left: 150,
  right: 120,
  fontFamily: FONT_MONO,
  fontSize: 34,
  color,
  letterSpacing: 2,
  lineHeight: 1.45,
  whiteSpace: "nowrap",
});

/** 下半终端：字幕轨严格跟原声；echo=记忆回响，block/flower/sys 各有指示物 */
export const Terminal3: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;

  let curIdx = -1;
  LINES.forEach((l, i) => {
    if (t >= l.at) curIdx = i;
  });
  const prev = curIdx >= 1 ? LINES[curIdx - 1] : null;
  const cur = curIdx >= 0 ? LINES[curIdx] : null;

  const typed = cur
    ? cur.text.slice(
        0,
        Math.max(0, Math.floor((frame - cur.at * FPS - TYPE_DELAY) / FRAMES_PER_CHAR)),
      )
    : "";
  const typing = cur ? typed.length < cur.text.length : false;

  return (
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
        <div style={{ ...lineStyle(cur.who === "sys" ? "#FF9B8A" : cur.who === "echo" ? P2.ivory : P2.ivory), top: 168 }}>
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
  );
};
