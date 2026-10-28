import React from "react";
import { useCurrentFrame } from "remotion";
import { P2, FONT_MONO } from "./palette2";
import { FPS, FRAMES_PER_CHAR, LINES, TYPE_DELAY, type Who } from "./script2";

const BLOCK_SPINNER = ["▖", "▘", "▝", "▗"];

/** 说话人指示物：德谬歌=转的小方块（字符 spinner），昔涟=呼吸的花 */
const SpeakerGlyph: React.FC<{ who: Who; frame: number }> = ({ who, frame }) => {
  if (who === "block") {
    const g = BLOCK_SPINNER[Math.floor(frame / 4) % BLOCK_SPINNER.length];
    return <span style={{ color: P2.lilac, marginRight: 18 }}>{g}</span>;
  }
  const s = 1 + 0.12 * Math.sin(frame / 5);
  return (
    <span style={{ color: P2.pink, marginRight: 16, display: "inline-block", transform: `scale(${s})` }}>
      ✿
    </span>
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

/**
 * 下半：终端台词。上一行淡出残留，当前行打字机 + 方块光标。
 * 保留原演出的 ">>>" 前缀（那是它的签名），行首加角色指示物。
 */
export const DialogueTerminal: React.FC = () => {
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
          <span style={{ color: prev.who === "block" ? P2.lilac : P2.pink, marginRight: 18 }}>
            {prev.who === "block" ? "▚" : "✿"}
          </span>
          {prev.text}
        </div>
      )}
      {cur && (
        <div style={{ ...lineStyle(P2.ivory), top: 168 }}>
          <SpeakerGlyph who={cur.who} frame={frame} />
          <span>{typed}</span>
          <span
            style={{
              display: "inline-block",
              width: 17,
              height: 36,
              marginLeft: 8,
              backgroundColor: cur.who === "block" ? P2.lilac : P2.pink,
              opacity: typing ? 1 : Math.abs(Math.sin(frame / 9)) * 0.85,
              verticalAlign: "-4px",
            }}
          />
        </div>
      )}
      <div
        style={{
          position: "absolute",
          left: 150,
          bottom: 28,
          fontFamily: FONT_MONO,
          fontSize: 17,
          color: P2.ivoryDim,
          letterSpacing: 1,
        }}
      >
        哀怜 → 共情 → 爱
      </div>
      <div
        style={{
          position: "absolute",
          right: 150,
          bottom: 28,
          fontFamily: FONT_MONO,
          fontSize: 17,
          color: P2.ivoryDim,
          letterSpacing: 1,
        }}
      >
        t+{String(Math.floor(t / 60)).padStart(2, "0")}:
        {String(Math.floor(t % 60)).padStart(2, "0")}.{String(Math.floor((t % 1) * 10))}
      </div>
    </div>
  );
};
