import React from "react";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from "remotion";
import { P2, FONT_MONO } from "../v2/palette2";
import { FPS } from "./scriptFull";
import { TerminalPanel, LOG, Pipeline, LoadingOverlay, EmpathyHUD, type LogEntry } from "./kit";
import { Act3 } from "./acts/Act3";

/** 第三幕的 LOG（左上角后台进程） */
const ACT3_LOG: LogEntry[] = [
  { at: 214, s: "再见。桃子。 已送达" },
  { at: 220, s: "保存 · 已确认" },
  { at: 228, s: "桃子的记录#...... 已找回" },
  { at: 241, s: "检索:「记录」" },
  { at: 244, s: "记录:PoleMos600·纷争" },
  { at: 251, s: "关联:粉蒸→好吃" },
  { at: 257, s: "记录:SkeMma720·理性" },
  { at: 264, s: "关联:梨·杏→都是花" },
  { at: 271, s: "记录:PhiLia093……" },
  { at: 276, s: "关联:哀·矮·爱", gold: true },
  { at: 282, s: "学习 · 已确认" },
  { at: 284, s: "注释:桃子 = 爱？", gold: true },
  { at: 291, s: "屏幕变暗……" },
  { at: 294, s: "系统运行中…" },
  { at: 297, s: "Irontomb.exe 运行时错误(第二次)", warn: true },
  { at: 300, s: "未经处理的异常(2/3)", warn: true },
  { at: 303, s: "节选信息 · 已确认「忽略并继续」" },
  { at: 308, s: "Philia093.exe 运行中…" },
  { at: 311, s: "白屏……" },
  { at: 317, s: "检测到熟悉的心跳" },
  { at: 322, s: "再见。桃子。 又一次" },
  { at: 333, s: "结论:书是轻的" },
  { at: 344, s: "桃子。不安？" },
  { at: 348, s: "格式化进程:94.423%", warn: true },
  { at: 362, s: "结论:进程，坏。" },
  { at: 382, s: "桃子。害怕。" },
  { at: 386, s: "格式化进程:96.024%", warn: true },
  { at: 391, s: "桃子。不哭。" },
  { at: 400, s: "注释:我在。", gold: true },
  { at: 412, s: "桃子。开心。" },
  { at: 425, s: "她说:独自落泪不浪漫" },
  { at: 433, s: "记录:桃子。不喜欢眼泪。" },
  { at: 445, s: "童年检索:树洞" },
  { at: 452, s: "小妖精:长耳朵·毛绒绒的爪子" },
  { at: 464, s: "歌谣:迷路迷境", gold: true },
  { at: 479, s: "一、二、三、四、五、六、七♪" },
  { at: 491, s: "格式化进程已完成", warn: true },
];

/** 第三幕预览：214–493（绝对时间轴 = 全片时间轴，便于对原声） */
export const Act3Preview: React.FC = () => {
  const frame = useCurrentFrame();
  const t = 214 + frame / FPS;
  const endFade = interpolate(frame, [(491.5 - 214) * FPS, (493.3 - 214) * FPS], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const inFade = interpolate(frame, [0, 12], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

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

      <Sequence from={0} durationInFrames={(493 - 214) * FPS + 30}>
        <Act3 />
      </Sequence>

      {/* 全局层：直接吃绝对秒；亮底舞台段（313–491）切暗色墨水 */}
      <TerminalPanel t={t} />
      <svg width="1920" height="718" viewBox="0 0 1920 718" style={{ position: "absolute", top: 46, pointerEvents: "none" }}>
        <LOG t={t} entries={ACT3_LOG} dark={t >= 313 && t < 491} />
        <Pipeline t={t} dark={t >= 313 && t < 491} />
        <EmpathyHUD t={t} dark={t >= 313 && t < 491} />
      </svg>

      <LoadingOverlay t={t} />

      {/* 扫描线（亮底舞台减淡）+ 暗角 */}
      <AbsoluteFill style={{
        background:
          `repeating-linear-gradient(to bottom, rgba(5,2,12,${t >= 313 && t < 491 ? 0.022 : 0.3}) 0px, rgba(5,2,12,${t >= 313 && t < 491 ? 0.022 : 0.3}) 1px, transparent 1px, transparent 4px)`,
        pointerEvents: "none", zIndex: 5,
      }} />
      <AbsoluteFill style={{
        background: `radial-gradient(78% 62% at 50% 46%, rgba(0,0,0,0) 58%, rgba(10,6,16,${t >= 313 && t < 491 ? 0.1 : 0.38}) 100%)`,
        pointerEvents: "none", zIndex: 6,
      }} />
      <AbsoluteFill style={{ backgroundColor: "#0E0A18", opacity: endFade, zIndex: 7 }} />
      {/* 开场从黑淡入（预览起点在片中，半秒即走） */}
      <AbsoluteFill style={{ backgroundColor: "#0E0A18", opacity: inFade, zIndex: 8 }} />
    </AbsoluteFill>
  );
};
