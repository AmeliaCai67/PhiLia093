import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { P2, FONT_MONO } from "./palette2";
import { DUR_SEC, FPS } from "./script2";
import { TrainingViz } from "./TrainingViz";
import { DialogueTerminal } from "./DialogueTerminal";

/**
 * PhiliaV2 —— AI 原生布局（参考 world.execute(me); dsh PV 的架构语法，粉色温馨变体）：
 *   顶栏（归档终端标识）／ 上半 训练可视化 ／ 下半 终端台词 ／ 扫描线+暗角
 * 每一帧仍是时间的纯函数。
 */
export const PhiliaV2: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const fadeOut = interpolate(frame, [DUR_SEC * FPS - 40, DUR_SEC * FPS - 6], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeIn = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: P2.bg, opacity: Math.min(fadeIn, fadeOut) }}>
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
          <span>翁法罗斯 · 岁 月</span>
          <span style={{ color: P2.pink, opacity: Math.abs(Math.sin(t * 1.6)) }}>●</span>
          <span>在线</span>
        </span>
      </div>

      <TrainingViz />
      <DialogueTerminal />

      {/* 后期：扫描线 + 暗角（参考 TUI 引擎的辉光/扫描线语言，压到温馨档） */}
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
