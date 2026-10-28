import React from "react";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from "remotion";
import { P2 } from "../v2/palette2";
import { FPS, isBright } from "./scriptFull";
import { TerminalPanel, LOG, Pipeline, LoadingOverlay, EmpathyHUD, type LogEntry } from "./kit";
import { ALL_LOG } from "./AllLog";
import { Act6 } from "./acts/Act6";

/** 第六幕预览：1098.5–1389.5（绝对时间轴 = 全片时间轴，共用全局层，避免预览与 Full 不一致） */
export const Act6Preview: React.FC = () => {
  const frame = useCurrentFrame();
  const t = 1098.5 + frame / FPS;
  const bright = isBright(t);
  const endFade = interpolate(frame, [(1388 - 1098.5) * FPS, (1389.4 - 1098.5) * FPS], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const inFade = interpolate(frame, [0, 12], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: P2.bg }}>
      <AbsoluteFill style={{
        background:
          "radial-gradient(85% 68% at 40% 38%, rgba(242,167,184,0.11) 0%, rgba(201,163,220,0.05) 45%, rgba(0,0,0,0) 75%)",
      }} />
      <AbsoluteFill style={{
        background: "radial-gradient(50% 38% at 78% 18%, rgba(201,184,232,0.07) 0%, rgba(0,0,0,0) 70%)",
      }} />

      <Sequence from={0} durationInFrames={Math.round((1389.5 - 1098.5) * FPS)}>
        <Act6 />
      </Sequence>

      {/* 全局层（与 FullRoot 同构） */}
      <TerminalPanel t={t} />
      <svg width="1920" height="718" viewBox="0 0 1920 718" style={{ position: "absolute", top: 46, pointerEvents: "none" }}>
        <LOG t={t} entries={ALL_LOG.filter((e) => e.at >= 1098.5 && e.at < 1389.5)} dark={bright} />
        <Pipeline t={t} dark={bright} />
        <EmpathyHUD t={t} dark={bright} />
      </svg>

      <LoadingOverlay t={t} />

      {/* 扫描线（亮纸面舞台减淡）+ 暗角 */}
      <AbsoluteFill style={{
        background:
          `repeating-linear-gradient(to bottom, rgba(5,2,12,${bright ? 0.022 : 0.3}) 0px, rgba(5,2,12,${bright ? 0.022 : 0.3}) 1px, transparent 1px, transparent 4px)`,
        pointerEvents: "none", zIndex: 5,
      }} />
      <AbsoluteFill style={{
        background: `radial-gradient(78% 62% at 50% 46%, rgba(0,0,0,0) 58%, rgba(10,6,16,${bright ? 0.1 : 0.38}) 100%)`,
        pointerEvents: "none", zIndex: 6,
      }} />
      <AbsoluteFill style={{ backgroundColor: "#0E0A18", opacity: endFade, zIndex: 7 }} />
      <AbsoluteFill style={{ backgroundColor: "#0E0A18", opacity: inFade, zIndex: 8 }} />
    </AbsoluteFill>
  );
};
