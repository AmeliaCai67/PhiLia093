import React from "react";
import { FONT_MONO, P2 } from "../../v2/palette2";
import { S } from "../kit";

// ─────────────────────────────────────────────────────────────────
// 运行时异常 · 终端诊断面板（可复用，首次接入 Act2 116–132s 异常 1/3）
//
// 演出目标（任务书 docs/plans/2026-10-12-cycle-step01-runtime-error.md）：
//   把「两条红裂线＋角落小警告」升级为观众真正可读的终端诊断结构，
//   栈式阅读顺序：进程与路径 → 缩进运行上下文 → 异常对象与次数 →
//   两枚操作 → 恢复运行。保持 Philia 克制风格：局部红提示＋象牙正文。
//
// 纪律：
//   · 辅助上下文只是运行日志，不虚构 Python 源码充当原片 traceback、
//     不引入新世界观；
//   · 异常对象名与次数跟底部终端原文同步出现（不提前剧透）；
//   · 选中时刻跟随底部 TerminalPanel 的确认时刻（选项窗口中点 +1s）；
//   · 不覆盖左上 LOG（面板顶沿 ≥ 局部 y 224 ＝ 绝对 y 270），
//     不穿入 y=764 以下台词区（面板底沿 ≤ 局部 y 624）。
// ─────────────────────────────────────────────────────────────────

/** 与底部 TerminalPanel 一致的打字速度（FRAMES_PER_CHAR=0.75 帧/字 @30fps） */
const CPS = 40;
const RED = "#FF9B8A";

export interface RuntimeErrorEvent {
  /** 全片秒位（画面秒 = 原声秒） */
  t: number;
  /** 面板整体窗口（秒）：[入, 出] */
  show: [number, number];
  /** 进程路径打字起点与内容 */
  pathAt: number;
  path: string;
  /** 路径后追加的红色状态字（与原文「运行时错误」同步） */
  statusAt: number;
  status: string;
  /** 缩进运行上下文（辅助日志，仅造栈感） */
  context: { at: number; text: string }[];
  /** 异常行（红）与对象名行（跟原文同步，不提前） */
  exceptionAt: number;
  exception: string;
  objectAt: number;
  objectName: string;
  /** 两枚操作（原文：节选信息 / 详细信息） */
  optionsAt: number;
  optionA: string;
  optionADesc: string;
  optionB: string;
  optionBDesc: string;
  /** A 被选中的确认时刻（＝底部选项窗口中点 +1） */
  pickAt: number;
  /** 恢复运行行 */
  resumeAt: number;
  resume: string;
  /** 布局（相对所在舞台层的局部坐标；默认居中，宽 1100） */
  top?: number;
  width?: number;
  /** 当前幕使用更紧凑的垂直间距，为放大后的底部HUD留白；不缩文字。 */
  compact?: boolean;
}

const typed = (t: number, at: number, s: string) =>
  s.slice(0, Math.max(0, Math.floor((t - at) * CPS)));

const Divider: React.FC<{ compact?: boolean }> = ({ compact }) => (
  <div style={{ height: 1, background: "rgba(243,233,220,0.13)", margin: compact ? "7px 0" : "14px 0" }} />
);

export const RuntimeErrorScene: React.FC<RuntimeErrorEvent> = ({
  t: tt, show, pathAt, path, statusAt, status, context,
  exceptionAt, exception, objectAt, objectName,
  optionsAt, optionA, optionADesc, optionB, optionBDesc, pickAt,
  resumeAt, resume, top = 224, width = 1100, compact = false,
}) => {
  const o = S(tt, show[0], show[0] + 0.6) * (1 - S(tt, show[1] - 0.9, show[1] + 0.2));
  if (o <= 0) return null;
  const resumed = tt >= resumeAt;
  const pathDone = typed(tt, pathAt, path);
  const statusDone = typed(tt, statusAt, status);
  const picked = tt >= pickAt;

  return (
    <div style={{
      position: "absolute", left: "50%", top, transform: "translateX(-50%)",
      width, minHeight: compact ? 0 : 390, opacity: o,
      backgroundColor: "rgba(13,9,22,0.93)",
      border: "1px solid rgba(255,155,138,0.32)", borderRadius: 10,
      boxShadow: "0 0 44px rgba(255,155,138,0.10), inset 0 0 60px rgba(201,163,220,0.05)",
      padding: compact ? "18px 38px" : "26px 38px", fontFamily: FONT_MONO,
      display: "flex", flexDirection: "column",
    }}>
      {/* ① 进程与路径 */}
      <div style={{ fontSize: 26, color: P2.ivory, letterSpacing: 1.5, minHeight: 34 }}>
        <span style={{ color: RED, marginRight: 14 }}>▲</span>
        {pathDone}
        {statusDone && (
          <span style={{ color: RED, marginLeft: 16 }}>
            {statusDone}
            {statusDone.length >= status.length && (
              <span style={{
                display: "inline-block", width: 9, height: 22, marginLeft: 10,
                backgroundColor: RED, verticalAlign: "-2px",
                opacity: 0.4 + 0.6 * Math.abs(Math.sin(tt * 4)),
              }} />
            )}
          </span>
        )}
      </div>

      <Divider compact={compact} />

      {/* ② 缩进运行上下文 + ③ 异常对象与次数（异常行不缩进，形成栈顶） */}
      <div style={{ opacity: resumed ? 0.38 : 1 }}>
        {context.map((c, i) => (
          <div key={i} style={{ fontSize: 20, color: P2.ivoryDim, letterSpacing: 1, lineHeight: compact ? "26px" : "32px", paddingLeft: 44 }}>
            {typed(tt, c.at, c.text)}
          </div>
        ))}
        <div style={{ fontSize: 26, color: RED, letterSpacing: 2, lineHeight: compact ? "34px" : "40px", marginTop: compact ? 4 : 8, minHeight: compact ? 34 : 40 }}>
          {typed(tt, exceptionAt, exception)}
        </div>
        <div style={{ fontSize: 20, color: P2.ivory, letterSpacing: 1.5, lineHeight: compact ? "26px" : "32px", paddingLeft: 44, minHeight: compact ? 26 : 32 }}>
          {typed(tt, objectAt, objectName)}
        </div>
      </div>

      <Divider compact={compact} />

      {/* ④ 两枚操作（122 起同屏；126.5 起确认「节选信息」，与底部日志一致） */}
      <div style={{ opacity: resumed ? 0.38 : 1 }}>
        {[{ name: optionA, desc: optionADesc, isA: true }, { name: optionB, desc: optionBDesc, isA: false }].map((op, i) => (
          <div key={i} style={{
            fontSize: 24, letterSpacing: 2, lineHeight: compact ? "32px" : "40px",
            color: picked && op.isA ? P2.pinkHi : P2.ivoryDim,
            opacity: S(tt, optionsAt + i * 0.2, optionsAt + 0.5 + i * 0.2),
          }}>
            <span style={{ display: "inline-block", width: 34, color: P2.pinkHi }}>
              {picked && op.isA ? "❯" : ""}
            </span>
            <span style={{ color: picked && op.isA ? P2.pinkHi : P2.ivory }}>{op.name}</span>
            <span style={{ color: P2.ivoryDim, fontSize: 20, marginLeft: 18 }}>—— {op.desc}</span>
            {picked && op.isA && <span style={{ color: P2.pinkHi, marginLeft: 14 }}>✓</span>}
          </div>
        ))}
      </div>

      {/* ⑤ 恢复运行（130 起，明确结束态） */}
      <div style={{ fontSize: 24, color: P2.good, letterSpacing: 2, lineHeight: compact ? "30px" : "38px", marginTop: compact ? 8 : 14, minHeight: compact ? 30 : 38 }}>
        {resumed && (
          <>
            <span style={{ marginRight: 12 }}>▸</span>
            {typed(tt, resumeAt, resume)}
            {typed(tt, resumeAt, resume).length >= resume.length && (
              <span style={{
                display: "inline-block", width: 8, height: 20, marginLeft: 9,
                backgroundColor: P2.good, verticalAlign: "-2px",
                opacity: 0.4 + 0.6 * Math.abs(Math.sin(tt * 3)),
              }} />
            )}
          </>
        )}
      </div>
    </div>
  );
};

/** Act2 · 第一次异常（116–132s，对象名「每一页...记录....」）
 *  秒位全部对齐台词核对表与 scriptFull.LINES：
 *  115.7 仅空面板淡入 / 116 路径打字 / 119 异常行 / 119.45 对象名 /
 *  122 两操作 / 126.5 确认 / 130 恢复。 */
export const ERROR_1_OF_3: Omit<RuntimeErrorEvent, "t"> = {
  // 面板空框提前 0.3s 淡入（115.7，QA 修复：内容秒位严格跟原片，
  // 115.9 时面板内无任何文字；路径打字严格 116 起）。
  show: [115.7, 132.6],
  pathAt: 116,
  path: "δ-me13:\\amphoreus\\Irontomb.exe",
  statusAt: 117.2,
  status: "运行时错误",
  context: [
    { at: 117.6, text: "上下文: memory_replay · 线程 0x093" },
    { at: 118.2, text: "上下文: 翻页读取 · 故事书 · 进行中" },
  ],
  exceptionAt: 119,
  exception: "✕ 未经处理的异常(1/3)",
  objectAt: 119.45,
  objectName: "对象名: \"每一页...记录....\"",
  optionsAt: 122,
  optionA: "节选信息",
  optionADesc: "忽略错误并继续运行",
  optionB: "详细信息",
  optionBDesc: "查看完整日志",
  pickAt: 126.5,
  resumeAt: 130,
  resume: "已忽略错误 · Philia093.exe 运行中…",
  top: 224,
  width: 1100,
};

/** Act3 · 第二次异常（297–310s，对象名「天真的…梦…」；任务书 step02 复用接入）
 *  秒位对齐台词核对表-209s到结尾 / scriptFull.LINES / CHOICES：
 *  297 路径打字（面板 296.7 仅空框淡入）/ 300 异常行（原文「未处理」，逐字）/
 *  301.4 对象名（底部 301 合并行逐字到达「对象名」的时刻）/ 303 两操作 /
 *  308 确认「节选信息」（CHOICES 306–308 中点+1）与恢复同刻 / 310.5 前退场净。
 *  ★ 上下文辅助行不得提及「天真的梦」——对象名 301 才许出现，不提前剧透。 */
export const ERROR_2_OF_3: Omit<RuntimeErrorEvent, "t"> = {
  show: [296.7, 310.3],
  pathAt: 297,
  path: "δ-me13:\\amphoreus\\Irontomb.exe",
  statusAt: 298.2,
  status: "运行时错误",
  context: [
    { at: 298.6, text: "上下文: memory_search · 线程 0x093" },
    { at: 299.2, text: "上下文: 续页读取 · 故事书 · 进行中" },
  ],
  exceptionAt: 300,
  exception: "✕ 未处理的异常(2/3)",
  objectAt: 301.4,
  objectName: "对象名: \"天真的…梦…\"",
  optionsAt: 303,
  optionA: "节选信息",
  optionADesc: "忽略错误并继续运行",
  optionB: "详细信息",
  optionBDesc: "查看完整日志",
  pickAt: 308,
  resumeAt: 308,
  resume: "已忽略错误 · Philia093.exe 运行中…",
  top: 224,
  width: 1100,
};

/** Act4 · 第三次异常（534–551s，对象名「新的...空白...」；任务书 step03 复用接入）
 *  秒位对齐台词核对表-209s到结尾 / scriptFull.LINES / CHOICES：
 *  534 路径打字（面板 533.7 仅空框淡入，533.9 无任何文字）/
 *  538 异常行（原文「未经处理的异常(3/3)」）——LINES 538 为异常+对象合并行，
 *  对象部分随打字于 538.4 到位（16 字前缀 × 0.025s/字），不提前 /
 *  541 两操作 / 547.5 确认「节选信息」（CHOICES 545–548 中点+1）/ 548 恢复 /
 *  551.4 前退场净 → 552 原白屏。上下文辅助行不提「新的空白」。 */
export const ERROR_3_OF_3: Omit<RuntimeErrorEvent, "t"> = {
  show: [533.7, 551.2],
  pathAt: 534,
  path: "δ-me13:\\amphoreus\\Irontomb.exe",
  statusAt: 535.2,
  status: "运行时错误",
  context: [
    { at: 535.6, text: "上下文: memory_search · 线程 0x093" },
    { at: 536.2, text: "上下文: 翻页读取 · 故事书 · 进行中" },
  ],
  exceptionAt: 538,
  exception: "✕ 未经处理的异常(3/3)",
  objectAt: 538.4,
  objectName: "对象名: \"新的...空白...\"",
  optionsAt: 541,
  optionA: "节选信息",
  optionADesc: "忽略错误并继续运行",
  optionB: "详细信息",
  optionBDesc: "查看完整日志",
  pickAt: 547.5,
  resumeAt: 548,
  resume: "已忽略错误 · Philia093.exe 运行中…",
  top: 224,
  width: 1100,
};
