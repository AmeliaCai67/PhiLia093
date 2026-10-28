import React from "react";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from "remotion";
import { P2 } from "../v2/palette2";
import { DUR_SEC, FPS, isBright } from "./scriptFull";
import { TerminalPanel, LOG, Pipeline, LoadingOverlay, EmpathyHUD } from "./kit";
import { ALL_LOG } from "./AllLog";
import { Act1 } from "./acts/Act1";
import { Act2 } from "./acts/Act2";
import { Act3 } from "./acts/Act3";
import { Act4 } from "./acts/Act4";
import { Act5 } from "./acts/Act5";
import { Act6 } from "./acts/Act6";
import { Act7 } from "./acts/Act7";

const ACT_COMPONENTS = [Act1, Act2, Act3, Act4, Act5, Act6, Act7];

/** 完整版 · 26:37（0–1597s，47,910 帧）。画面秒位 = 原声秒位。 */
export const FullRoot: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const bright = isBright(t);
  const openingFade = interpolate(frame, [6, 42], [1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: P2.bg }}>
      {/* 环境光：带紫的黑 + 淡粉柔光 */}
      <AbsoluteFill style={{
        background:
          "radial-gradient(85% 68% at 40% 38%, rgba(242,167,184,0.11) 0%, rgba(201,163,220,0.05) 45%, rgba(0,0,0,0) 75%)",
      }} />
      <AbsoluteFill style={{
        background: "radial-gradient(50% 38% at 78% 18%, rgba(201,184,232,0.07) 0%, rgba(0,0,0,0) 70%)",
      }} />

      {/* 七幕（Sequence 只在各自窗口渲染） */}
      {ACT_COMPONENTS.map((Act, i) => {
        const { start, end } = [
          { start: 0, end: 107.5 },
          { start: 107.5, end: 214 },
          { start: 214, end: 493 },
          { start: 493, end: 848.5 },
          { start: 848.5, end: 1098.5 },
          { start: 1098.5, end: 1389.5 },
          { start: 1389.5, end: DUR_SEC },
        ][i];
        return (
          <Sequence key={i} from={Math.round(start * FPS)} durationInFrames={Math.ceil((end - start) * FPS)}>
            <Act />
          </Sequence>
        );
      })}

      {/* 全局层（绝对秒驱动）；高度 718 覆盖到沉底框上沿，pipeline/loss 落在舞台下沿两角 */}
      <TerminalPanel t={t} />
      {t < 1594.6 && <svg width="1920" height="718" viewBox="0 0 1920 718" style={{ position: "absolute", top: 46, pointerEvents: "none" }}>
        <LOG t={t} entries={ALL_LOG} dark={isBright(t)} />
        <Pipeline t={t} dark={isBright(t)} />
        <EmpathyHUD t={t} dark={isBright(t)} />
      </svg>}

      <LoadingOverlay t={t} />

      {/* 扫描线 + 暗角（亮纸面舞台明显减淡，不把绘本压脏） */}
      <AbsoluteFill style={{
        background:
          `repeating-linear-gradient(to bottom, rgba(5,2,12,${bright ? 0.022 : 0.3}) 0px, rgba(5,2,12,${bright ? 0.022 : 0.3}) 1px, transparent 1px, transparent 4px)`,
        pointerEvents: "none", zIndex: 5,
      }} />
      <AbsoluteFill style={{
        background: `radial-gradient(78% 62% at 50% 46%, rgba(0,0,0,0) 58%, rgba(10,6,16,${bright ? 0.1 : 0.38}) 100%)`,
        pointerEvents: "none", zIndex: 6,
      }} />

      {/* 开场从黑淡入（0.2s→1.4s，v5 同款） */}
      <AbsoluteFill style={{ backgroundColor: "#0E0A18", opacity: openingFade, zIndex: 7 }} />
    </AbsoluteFill>
  );
};
