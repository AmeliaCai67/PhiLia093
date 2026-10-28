import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import type { Beat } from "./script";
import { CROSSFADE, FRAMES_PER_CHAR, TYPE_DELAY_FRAMES } from "./script";
import { PALETTE, FONT_SERIF } from "./palette";
import { BlackTerminal } from "./backgrounds/BlackTerminal";
import { GardenCage } from "./backgrounds/GardenCage";

/**
 * 一拍 = 背景 + 「章题」+ 分隔饰线 + >>> 记录行（打字机）+ ▼
 * 版式严格对照原演出帧：整块居于下三分之一，全部件居中对齐。
 */
export const MemoryBeat: React.FC<{ beat: Beat }> = ({ beat }) => {
  const frame = useCurrentFrame();
  const visibleChars = Math.max(
    0,
    Math.floor((frame - TYPE_DELAY_FRAMES) / FRAMES_PER_CHAR),
  );
  const shown = beat.line.slice(0, visibleChars);

  // ▼：打字机走完之前先隐着，之后以 44 帧周期呼吸
  const typeDone = TYPE_DELAY_FRAMES + beat.line.length * FRAMES_PER_CHAR;
  const arrowOn = frame > typeDone + 6;
  const breathe = 0.35 + 0.65 * Math.abs(Math.sin(frame / 14));

  return (
    <AbsoluteFill>
      {beat.bg === "black" ? (
        <BlackTerminal />
      ) : (
        <GardenCage night={beat.bg === "gardenDark"} wisp={beat.wisp} />
      )}
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "flex-end",
          paddingBottom: 128,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 20,
            width: "100%",
          }}
        >
          {beat.title ? <div style={titleStyle}>{`「 ${beat.title} 」`}</div> : null}
          {beat.title ? <OrnamentDivider /> : null}
          {beat.line ? <div style={lineStyle}>{shown}</div> : null}
          <div
            style={{
              marginTop: 26,
              color: PALETTE.gold,
              fontSize: 22,
              opacity: arrowOn ? breathe : 0,
              fontFamily: FONT_SERIF,
            }}
          >
            ▼
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const titleStyle: React.CSSProperties = {
  color: PALETTE.gold,
  fontSize: 44,
  letterSpacing: 12,
  fontWeight: 600,
  fontFamily: FONT_SERIF,
  textShadow: "0 0 24px rgba(226,198,140,0.35)",
};

const lineStyle: React.CSSProperties = {
  color: PALETTE.ivory,
  fontSize: 36,
  letterSpacing: 3,
  fontFamily: FONT_SERIF,
  textShadow:
    "0 2px 10px rgba(50,35,70,0.65), 0 0 22px rgba(40,25,60,0.45)",
  minHeight: 48,
};

const OrnamentDivider: React.FC = () => (
  <div
    style={{
      position: "relative",
      width: 980,
      height: 14,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 6,
        height: 2,
        background: `linear-gradient(to right, transparent, ${PALETTE.goldDim} 18%, ${PALETTE.goldDim} 82%, transparent)`,
      }}
    />
    <div
      style={{
        width: 9,
        height: 9,
        transform: "rotate(45deg)",
        backgroundColor: PALETTE.gold,
      }}
    />
    <div
      style={{
        position: "absolute",
        left: 6,
        top: 4,
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: PALETTE.goldDim,
      }}
    />
    <div
      style={{
        position: "absolute",
        right: 6,
        top: 4,
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: PALETTE.goldDim,
      }}
    />
  </div>
);

export { CROSSFADE };
