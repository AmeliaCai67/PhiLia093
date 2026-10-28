import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { P2, FONT_MONO } from "../v2/palette2";
import { pipelineStatesAt, pipelineGrowthAt, captionAt } from "./narrative";
import {
  CHOICES, DUR_SEC, FPS, FRAMES_PER_CHAR, TYPE_DELAY,
  WHITE, BLACK, ctxOf, lossOf, type Who,
} from "./scriptFull";

export const S = (v: number, a: number, b: number, c = 0, d = 1) =>
  interpolate(v, [a, b], [c, d], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

// ── 两个有灵性的 icon（v5 原样保留）─────────────────────────────

/** 昔涟：菱形花瓣的粉色水晶花（慢旋呼吸） */
export const CrystalGlyph: React.FC<{ frame: number }> = ({ frame }) => {
  const s = 1 + 0.08 * Math.sin(frame / 5);
  const rot = frame * 0.6;
  return (
    <svg width={36} height={36} viewBox="-20 -20 40 40"
      style={{ marginRight: 12, display: "inline-block", verticalAlign: "-9px", transform: `rotate(${rot}deg) scale(${s})` }}>
      {[0, 60, 120, 180, 240, 300].map((a) => {
        const rad = (a * Math.PI) / 180;
        return (
          <g key={a} transform={`translate(${Math.cos(rad) * 10} ${Math.sin(rad) * 10}) rotate(${a + 90})`}>
            <path d="M 0 0 L -5 -6.5 L 0 -12 L 5 -6.5 Z"
              fill="rgba(255,241,249,0.55)" stroke={P2.pinkHi} strokeWidth={1.4} />
          </g>
        );
      })}
      <circle r={3.4} fill="#FFFFFF" />
    </svg>
  );
};

const BLOCK_SPINNER = ["▖", "▘", "▝", "▗"];

/** 记忆的幼芽：字符画小妖精（微缩版，两行半） */
const SproutGlyph: React.FC<{ frame: number }> = ({ frame }) => {
  const blink = Math.floor(frame / 22) % 2 === 0;
  return (
    <pre style={{
      display: "inline-block", fontFamily: FONT_MONO, fontSize: 14, lineHeight: "14px",
      color: P2.pink, margin: "0 12px 0 2px", verticalAlign: "middle", transform: "translateY(-3px)",
      opacity: blink ? 0.95 : 0.7,
    }}>{`("\\.-./)\n( o${blink ? "." : "o"} )\n ( ~ )`}</pre>
  );
};

/** 记忆的花：晶簇 DemoCluster（微缩） */
const FlowerGlyph: React.FC<{ frame: number }> = ({ frame }) => (
  <svg width={36} height={36} viewBox="-22 -22 44 44"
    style={{ marginRight: 12, display: "inline-block", verticalAlign: "-9px" }}>
    {[[0, -14], [-9, -6], [9, -6], [-15, 2], [15, 2], [-8, 10], [8, 10], [0, 17], [-18, -12], [18, -9]].map(([cx, cy], i) => (
      <rect key={i} x={cx - 3.4} y={cy - 3.4} width={6.8} height={6.8} rx={1}
        fill={i % 2 === 0 ? P2.pinkHi : P2.lilacHi}
        opacity={0.6 + 0.35 * Math.abs(Math.sin(frame / 11 + i * 1.9))} />
    ))}
    <rect x={-3} y={-3} width={6} height={6} rx={1} fill="#FFFFFF" />
  </svg>
);

/** 像素小人 glyph（白厄/阿格莱雅/村民，L2 层） */
const PixelGlyph: React.FC<{ frame: number; ink: string; ink2: string }> = ({ frame, ink, ink2 }) => {
  const step = Math.floor(frame / 14) % 2;
  return (
    <svg width={36} height={36} viewBox="-14 -18 28 36"
      style={{ marginRight: 12, display: "inline-block", verticalAlign: "-9px", transform: `translateY(${step}px)` }}>
      {[[0, -12, 8], [-5, -3, 10], [5, -3, 10], [-5, 7, 4], [5, 7, 4]].map(([x, y, w], i) => (
        <rect key={i} x={x - w / 2} y={y} width={w} height={6} fill={i === 0 ? ink2 : ink} opacity={0.9} />
      ))}
    </svg>
  );
};

const RecordGlyph: React.FC = () => (
  <span style={{ color: "#E8C9A0", marginRight: 18, fontSize: 30 }}>◆</span>
);

export const SpeakerGlyph: React.FC<{ who: Who; frame: number }> = ({ who, frame }) => {
  if (who === "xilian") return <CrystalGlyph frame={frame} />;
  if (who === "red") return <span style={{ color: "#FF9B8A", marginRight: 18 }}>▲</span>;
  if (who === "sprout") return <SproutGlyph frame={frame} />;
  if (who === "flower") return <FlowerGlyph frame={frame} />;
  if (who === "baihe") return <PixelGlyph frame={frame} ink="#F3E9DC" ink2="#E8C9A0" />;
  if (who === "aglaea") return <PixelGlyph frame={frame} ink={P2.lilacHi} ink2={P2.pink} />;
  if (who === "villager") return <PixelGlyph frame={frame} ink={P2.ivoryDim} ink2={P2.lilac} />;
  if (who === "record") return <RecordGlyph />;
  if (who === "idle") return null;
  const g = BLOCK_SPINNER[Math.floor(frame / 4) % BLOCK_SPINNER.length];
  return <span style={{ color: P2.lilac, marginRight: 18, fontSize: 38 }}>{g}</span>;
};

const accentOf = (who: Who) =>
  who === "xilian" ? P2.pink
    : who === "red" ? "#FF9B8A"
    : who === "sprout" ? P2.pink
    : who === "flower" ? P2.pinkHi
    : who === "record" ? "#E8C9A0"
    : who === "villager" || who === "baihe" || who === "aglaea" ? P2.ivory
    : P2.lilacHi;

const caret = (color: string, typing: boolean, frame: number): React.CSSProperties => ({
  display: "inline-block", width: 17, height: 36, marginLeft: 8, backgroundColor: color,
  opacity: typing ? 1 : Math.abs(Math.sin(frame / 9)) * 0.85, verticalAlign: "-4px",
});

const boxTextStyle = (color: string): React.CSSProperties => ({
  fontFamily: FONT_MONO, fontSize: 34, color, letterSpacing: 2, lineHeight: 1.5,
  whiteSpace: "normal", wordBreak: "break-all",
});

// ── 终端框（沉底）＋行内选项＋页脚 ctx ─────────────────────────

/** 三次格式化的清零窗口（ctx 条变红 + 「· 格式化」） */
const CTX_WIPES: [number, number][] = [[77, 78.5], [210, 211.5], [491, 492.5]];
const ARCHIVED_AT = 1590;

export const TerminalPanel: React.FC<{ t: number }> = ({ t }) => {
  // 所有白屏写入转场都不叠放沉底字幕、光标和选项，避免旧台词透出。
  if (WHITE.some(({ a, b }) => t >= a && t < b) || t >= 1594.6) return null;
  const frame = Math.round(t * FPS);
  let curIdx = -1;
  for (let i = 0; i < LINES_LEN; i++) {
    if (t >= LINES_AT[i]) curIdx = i;
  }
  const cur = curIdx >= 0 ? LINES_ITEM(curIdx) : null;
  const typed = cur
    ? cur.text.slice(0, Math.max(0, Math.floor((t * FPS - cur.at * FPS - TYPE_DELAY) / FRAMES_PER_CHAR)))
    : "";
  const typing = cur ? typed.length < cur.text.length : false;
  const activeChoices = CHOICES.filter((c) => t >= c.at && t < c.to);
  const wiping = CTX_WIPES.some(([a, b]) => t >= a && t < b);
  const ctx = ctxOf(t);
  const ctxBar = "▓".repeat(Math.round((ctx / 100) * 12)).padEnd(12, "░");

  return (
    <div style={{
      position: "absolute", top: 764, left: 0, right: 0, height: 316,
      backgroundColor: P2.bgPanel, borderTop: `1px solid ${P2.border}`, overflow: "hidden",
      display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "0 150px 20px",
    }}>
      <div style={{
        borderRadius: 10, border: "1.5px solid rgba(243,233,220,0.32)", background: "rgba(255,255,255,0.025)",
        padding: "22px 30px", minHeight: 96,
        boxShadow: cur && cur.who !== "idle" ? `0 0 34px rgba(242,167,184,${typing ? 0.14 : 0.07})` : "none",
      }}>
        {cur && cur.who !== "idle" ? (
          <div style={boxTextStyle(cur.who === "red" ? "#FF9B8A" : accentOf(cur.who))}>
            <SpeakerGlyph who={cur.who} frame={frame} />
            <span>{typed}</span>
            <span style={caret(accentOf(cur.who), typing, frame)} />
          </div>
        ) : (
          <div style={boxTextStyle(P2.ivoryDim)}>
            <span style={{ marginRight: 14 }}>&gt;</span>
            <span style={caret(P2.ivoryDim, false, frame)} />
          </div>
        )}
      </div>

      {activeChoices.length > 0 && (
        <div style={{ fontFamily: FONT_MONO, marginTop: 14, marginLeft: 30 }}>
          {activeChoices.map((c) => {
            const isPick = !!c.pick || activeChoices.length === 1;
            const confirmed = isPick && t >= (c.at + c.to) / 2 + 1;
            return (
              <div key={c.text + String(c.at)}
                style={{ color: isPick ? P2.pinkHi : P2.ivoryDim, fontSize: 30, letterSpacing: 5, marginBottom: 8, opacity: confirmed ? 0.75 : 1 }}>
                <span style={{ marginRight: 16, opacity: isPick ? 1 : 0 }}>{isPick ? "❯" : " "}</span>
                {c.text}
                {confirmed && <span style={{ marginLeft: 14 }}>✓</span>}
              </div>
            );
          })}
          <div style={{ fontSize: 17, color: P2.ivoryDim, letterSpacing: 2, marginTop: 4 }}>Enter 确认 · Esc 取消</div>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20, fontFamily: FONT_MONO, fontSize: 17, color: P2.ivoryDim, letterSpacing: 1 }}>
        <span>δ-me13 · 哀怜 → 共情 → 爱</span>
        <span style={{ color: wiping ? "#FF9B8A" : t >= ARCHIVED_AT ? P2.pinkHi : P2.ivoryDim }}>
          ctx {ctxBar} {ctx.toFixed(1)}%
          {t >= ARCHIVED_AT ? " · 已归档 ✓" : wiping ? " · 格式化" : ""}
        </span>
        <span>
          t+{String(Math.floor(t / 60)).padStart(2, "0")}:{String(Math.floor(t % 60)).padStart(2, "0")}.{String(Math.floor((t % 1) * 10))}
        </span>
      </div>
    </div>
  );
};

// LINES 的稳定引用（避免每帧 filter）
import { LINES } from "./scriptFull";
const LINES_AT = LINES.map((l) => l.at);
const LINES_LEN = LINES.length;
const LINES_ITEM = (i: number) => LINES[i];

// ── 左上角 LOG（亲友最喜欢的后台进程）────────────────────────

export interface LogEntry { at: number; s: string; warn?: boolean; gold?: boolean }

/** 亮底舞台时的暗色墨水 */
const inkOf = (dark?: boolean) => ({
  dim: dark ? "#7A6B90" : P2.ivoryDim,
  main: dark ? "#4A3B5C" : P2.ivory,
  pink: dark ? "#D97A93" : P2.pinkHi,
  good: dark ? "#4E8A6A" : P2.good,
  faint: dark ? "#A99BC0" : P2.ivoryFaint,
  warn: dark ? "#D95F4C" : "#FF9B8A",
});

export const LOG: React.FC<{ t: number; entries: LogEntry[]; dark?: boolean }> = ({ t, entries, dark }) => {
  const ink = inkOf(dark);
  const visible = entries.filter((e) => t >= e.at).slice(-6);
  return (
    <g fontFamily={FONT_MONO} fontSize={17}>
      {visible.map((e, i) => {
        const appear = S(t, e.at, e.at + 0.4);
        // Windows 调试输出风格：[秒] [级别] 正文（正文保留中文关键词）
        const lvl = e.warn ? "[WARN]" : e.gold ? "[ OK ]" : "[INFO]";
        const lvlCol = e.warn ? ink.warn : e.gold ? ink.pink : ink.dim;
        const ts = `[${e.at.toFixed(1).padStart(6, "0")}]`;
        return (
          <text key={e.s + String(e.at)} x={60} y={78 + i * 27} opacity={appear * 0.85} letterSpacing={0.5}>
            <tspan fill={ink.faint}>{ts}</tspan>
            <tspan fill={lvlCol} dx={6}>{lvl}</tspan>
            <tspan fill={e.gold ? ink.pink : e.warn ? ink.warn : ink.dim} dx={6}>{e.s}</tspan>
          </text>
        );
      })}
    </g>
  );
};

// ── 心的形成 pipeline（step18：状态由 narrative.ts 纯绝对秒驱动）──
// 三档：空心（未触及）/ 细描线浅填（正在探索）/ 浅填（已有证据）；
// 无永久勾号、无百分比、不泛滥闪烁；caption 按当前行为（narrative.CAPTIONS）。

export const Pipeline: React.FC<{ t: number; dark?: boolean }> = ({ t, dark }) => {
  if (t < 60) return null;
  const ink = inkOf(dark);
  const states = pipelineStatesAt(t);
  const growth = pipelineGrowthAt(t);
  const cap = captionAt(t);
  return (
    <g fontFamily={FONT_MONO} transform="translate(-60 -744) scale(2)"
      opacity={S(t, 60, 61) * (1 - S(t, DUR_SEC - 3, DUR_SEC - 1.5))}>
      {/* 以左边距60为锚放大200%，文案另留一行，最终基线712在舞台内。 */}
      <text x={60} y={668} fontSize={12} fill={ink.dim} letterSpacing={1}>心的形成 · pipeline</text>
      {states.map((st, i) => {
        const x = 66 + i * 92;
        // 连续填色强度：探索底色 0.14 + 证据 0.24——证据撤回时仍有探索底色，
        // 不因分支切换跳变（step18 Rev.2）
        const fillStrength = growth
          ? 0.12 * st.explore01 + 0.5 * growth.progress[i]
          : 0.14 * st.explore01 + 0.24 * st.evidence01;
        return (
          <g key={st.label}>
            {i > 0 && (
              <line x1={x - 30} y1={690} x2={x - 9} y2={690}
                stroke={ink.pink} strokeWidth={1.6}
                opacity={0.3 + 0.4 * states[i - 1].evidence01} />
            )}
            <circle cx={x} cy={690} r={4.5}
              fill={fillStrength > 0 ? ink.pink : "none"}
              fillOpacity={fillStrength}
              stroke={st.status === "untouched" ? ink.faint : ink.pink}
              strokeWidth={st.status === "evidence" ? 1.8 : 1.1}
              opacity={0.9} />
            <text x={x + 10} y={695} fontSize={13}
              fill={st.status === "untouched" ? ink.faint : st.status === "evidence" ? ink.main : ink.pink}>
              {st.label}
            </text>
            {growth && (
              <>
                <line x1={x} y1={702} x2={x + 64} y2={702}
                  stroke={ink.faint} strokeWidth={2.5} opacity={0.45} />
                {growth.progress[i] > 0 && (
                  <line x1={x} y1={702} x2={x + 64 * growth.progress[i]} y2={702}
                    stroke={growth.active === i ? ink.main : ink.pink}
                    strokeWidth={3} strokeLinecap="round" />
                )}
              </>
            )}
          </g>
        );
      })}
      <text x={60} y={728} fontSize={12.5} fill={ink.main}>「{cap}」</text>
    </g>
  );
};

// ── 转场 Loading（白=睁眼/换记忆，黑=重启）─────────────────────

export const LoadingOverlay: React.FC<{ t: number }> = ({ t }) => {
  const w = WHITE.find((x) => t >= x.a && t < x.b);
  const b = BLACK.find((x) => t >= x.a && t < x.b);
  const win = w ?? b;
  if (!win) return null;
  const bright = !!w;
  const p = S(t, win.a + 0.3, win.b - 0.5);
  const fade = S(t, win.a, win.a + 0.4) * (1 - S(t, win.b - 0.4, win.b));
  const track = bright ? "rgba(20,14,30,0.14)" : "rgba(255,255,255,0.12)";
  const fill = bright ? "#E88AA8" : P2.pinkHi;
  const txt = bright ? "#5A3A55" : P2.ivory;
  return (
    <AbsoluteFill style={{ backgroundColor: bright ? "rgb(247,243,240)" : "rgba(14,10,24,0.93)", opacity: fade, zIndex: 4 }}>
      <div style={{
        position: "absolute", left: "50%", top: "46%", transform: "translate(-50%,-50%)",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 26, fontFamily: FONT_MONO,
      }}>
        <svg width={64} height={64} viewBox="0 0 64 64" style={{ rotate: `${-t * 220}deg` }}>
          <circle cx={32} cy={32} r={26} fill="none" stroke={fill} strokeWidth={4} strokeDasharray="40 123" strokeLinecap="round" />
          <circle cx={32} cy={32} r={26} fill="none" stroke={track} strokeWidth={4} opacity={0.4} />
        </svg>
        <div style={{ width: 320, height: 8, borderRadius: 4, background: track, overflow: "hidden" }}>
          <div style={{ width: `${p * 100}%`, height: "100%", borderRadius: 4, background: fill }} />
        </div>
        <div style={{ fontSize: 22, color: txt, letterSpacing: 6 }}>{win.label}</div>
        <div style={{ fontSize: 15, color: txt, opacity: 0.55, letterSpacing: 2 }}>{Math.round(p * 100)}%</div>
      </div>
    </AbsoluteFill>
  );
};

// ── 字符画（L1：笨拙的、逐字生成的 ASCII art）──────────────────
// ★ 逐字符网格渲染：<pre> 的字宽受字体度量影响会把画拉变形，
//   这里锁死格子（cellW=0.62em，cellH=1em），终端格子比例，画不跑形。

export const AsciiSprite: React.FC<{
  art: string; t: number; start: number; cps?: number;
  x: number; y: number; size?: number; color?: string; caretColor?: string;
}> = ({ art, t, start, cps = 14, x, y, size = 20, color = "#4A3B5C", caretColor }) => {
  const o = S(t, start - 0.3, start);
  const total = art.length;
  const shown = Math.max(0, Math.floor((t - start) * cps));
  const done = shown >= total;
  const lines = art.split("\n");
  const cellW = size * 0.62;
  const cellH = size * 1.0;
  const cols = Math.max(...lines.map((l) => l.length));
  const cells: { ch: string; r: number; c: number; i: number }[] = [];
  lines.forEach((ln, r) => ln.split("").forEach((ch, c) => cells.push({ ch, r, c, i: cells.length })));
  const caretCell = cells.find((cell) => cell.i === shown);
  return (
    <svg width={cols * cellW + size} height={lines.length * cellH + 6}
      style={{ position: "absolute", left: x, top: y, opacity: o, overflow: "visible" }}>
      {cells.map(({ ch, r, c, i }) => ch === " " ? null : (
        <text key={`${r}-${c}`} x={c * cellW} y={r * cellH + size * 0.82}
          fontSize={size} fontFamily={FONT_MONO} fill={color}
          opacity={i < shown ? 1 : 0.06}>{ch}</text>
      ))}
      {!done && o > 0 && caretCell && (
        <rect x={caretCell.c * cellW} y={caretCell.r * cellH} width={size * 0.55} height={size * 0.8}
          fill={caretColor ?? color} opacity={0.5 + 0.5 * Math.abs(Math.sin(t * 4))} />
      )}
    </svg>
  );
};

// ── 共情 HUD（右下角小型读数 + 迷你 loss 曲线；不再放大号主数字）──

const LOSS_CURVE_W = 150;
const LOSS_CURVE_H = 30;

export const EmpathyHUD: React.FC<{ t: number; dark?: boolean }> = ({ t, dark }) => {
  if (t < 84) return null;
  const ink = inkOf(dark);
  const v = lossOf(t);
  // 迷你曲线：最近 60s 的 loss 走势（纯函数采样）
  const x0 = 1704, y0 = 664;
  const pts = Array.from({ length: 31 }, (_, i) => {
    const tt = t - 60 + (i / 30) * 60;
    if (tt < 84) return null;
    const lv = Math.max(0, lossOf(tt));
    // loss 全程 0..0.8 对数压到 0..1（前段大值不压扁后段收敛）
    const h = Math.min(1, Math.sqrt(lv / 0.8));
    return `${x0 + (i / 30) * LOSS_CURVE_W},${y0 + LOSS_CURVE_H - h * LOSS_CURVE_H}`;
  }).filter(Boolean).join(" ");
  return (
    <g fontFamily={FONT_MONO} transform="translate(-1848 -714) scale(2)" opacity={S(t, 84, 85)}>
      <text x={1704} y={656} fontSize={13} fill={ink.dim} letterSpacing={1}>empathy_loss</text>
      {pts && <polyline points={pts} fill="none" stroke={ink.pink} strokeWidth={1.6} opacity={0.85} />}
      <text x={1704} y={712} fontSize={14} fill={ink.main}>
        {Math.max(0, v).toFixed(3)} <tspan fill={ink.good} fontSize={12}>↓ 共情在线</tspan>
      </text>
    </g>
  );
};

// ── 舞台内字符画（SVG 坐标系版，随镜头变换一起缩放）─────────────
// 与 AsciiSprite 同一套格子规则（cellW=0.62em, cellH=1em），但渲染在
// 父 SVG 内部 —— 用于必须和 SVG 舞台共享镜头变换的场合（第六幕小妖精）。

export const AsciiArt: React.FC<{
  art: string; x: number; y: number; size?: number; color?: string;
  opacity?: number; cps?: number; t: number; start: number; caretColor?: string;
}> = ({ art, x, y, size = 20, color = "#4A3B5C", opacity = 1, cps = 14, t, start, caretColor }) => {
  const total = art.length;
  const shown = Math.max(0, Math.floor((t - start) * cps));
  const done = shown >= total;
  const lines = art.split("\n");
  const cellW = size * 0.62;
  const cellH = size * 1.0;
  const cells: { ch: string; r: number; c: number; i: number }[] = [];
  lines.forEach((ln, r) => ln.split("").forEach((ch, c) => cells.push({ ch, r, c, i: cells.length })));
  const caretCell = cells.find((cell) => cell.i === shown);
  return (
    <g opacity={opacity}>
      {cells.map(({ ch, r, c, i }) => ch === " " ? null : (
        <text key={`${r}-${c}`} x={x + c * cellW} y={y + r * cellH + size * 0.82}
          fontSize={size} fontFamily={FONT_MONO} fill={color}
          opacity={i < shown ? 1 : 0.06}>{ch}</text>
      ))}
      {!done && caretCell && (
        <rect x={x + caretCell.c * cellW} y={y + caretCell.r * cellH} width={size * 0.55} height={size * 0.8}
          fill={caretColor ?? color} opacity={0.5 * opacity} />
      )}
    </g>
  );
};
