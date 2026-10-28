import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { P2, FONT_MONO } from "../v2/palette2";
import { CHOICES, DUR_SEC, FPS, FRAMES_PER_CHAR, LINES, TYPE_DELAY, type Who } from "../v4/script4";
import { Viz5 } from "./Viz5";

const S = (v: number, a: number, b: number, c = 0, d = 1) =>
  interpolate(v, [a, b], [c, d], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

const BLOCK_SPINNER = ["▖", "▘", "▝", "▗"];

/** ctx = 它从她那里学到了多少（记忆占用）。77s 第一次格式化清零——重学，而且更快。 */
const CTX: [number, number, number, number][] = [
  [0, 40, 0.2, 0.2], [40, 53, 0.2, 1.5], [53, 77, 1.5, 34],
  [77, 78.5, 34, 0.1], [78.5, 101, 0.1, 12], [101, 130, 12, 18],
  [130, 136, 18, 18], [136, 173, 18, 71], [173, 202, 71, 96],
  [202, 210, 96, 99.9], [210, 211.5, 99.9, 100], [211.5, 215.1, 100, 100],
];
const ctxOf = (t: number) => {
  for (const [a, b, c, d] of CTX) if (t >= a && t < b) return c + ((d - c) * (t - a)) / (b - a);
  return 100;
};

const accentOf = (who: Who) =>
  who === "xilian" ? P2.pink : who === "red" ? "#FF9B8A" : P2.lilacHi;

/** 昔涟：菱形花瓣的粉色水晶花（迷你版，慢旋呼吸） */
const CrystalGlyph: React.FC<{ frame: number }> = ({ frame }) => {
  const s = 1 + 0.08 * Math.sin(frame / 5);
  const rot = frame * 0.6;
  return (
    <svg
      width={36}
      height={36}
      viewBox="-20 -20 40 40"
      style={{
        marginRight: 12,
        display: "inline-block",
        verticalAlign: "-9px",
        transform: `rotate(${rot}deg) scale(${s})`,
      }}
    >
      {[0, 60, 120, 180, 240, 300].map((a) => {
        const rad = (a * Math.PI) / 180;
        const px = Math.cos(rad) * 10;
        const py = Math.sin(rad) * 10;
        return (
          <g key={a} transform={`translate(${px} ${py}) rotate(${a + 90})`}>
            <path d="M 0 0 L -5 -6.5 L 0 -12 L 5 -6.5 Z"
              fill="rgba(255,241,249,0.55)" stroke={P2.pinkHi} strokeWidth={1.4} />
          </g>
        );
      })}
      <circle r={3.4} fill="#FFFFFF" />
    </svg>
  );
};

const SpeakerGlyph: React.FC<{ who: Who; frame: number }> = ({ who, frame }) => {
  if (who === "xilian") return <CrystalGlyph frame={frame} />;
  if (who === "red") return <span style={{ color: "#FF9B8A", marginRight: 18 }}>▲</span>;
  const g = BLOCK_SPINNER[Math.floor(frame / 4) % BLOCK_SPINNER.length];
  return <span style={{ color: P2.lilac, marginRight: 18, fontSize: 38 }}>{g}</span>;
};

const caret = (color: string, typing: boolean, frame: number): React.CSSProperties => ({
  display: "inline-block",
  width: 17,
  height: 36,
  marginLeft: 8,
  backgroundColor: color,
  opacity: typing ? 1 : Math.abs(Math.sin(frame / 9)) * 0.85,
  verticalAlign: "-4px",
});

const boxTextStyle = (color: string): React.CSSProperties => ({
  fontFamily: FONT_MONO,
  fontSize: 34,
  color,
  letterSpacing: 2,
  lineHeight: 1.5,
  whiteSpace: "normal",
  wordBreak: "break-all",
});

/** 转场 Loading：读条 + 转圈 + 真实词汇标签（写入中/重启中/格式化中） */
const LoadingOverlay: React.FC<{
  label: string; bright: boolean; a: number; b: number; t: number;
}> = ({ label, bright, a, b, t }) => {
  const p = S(t, a + 0.3, b - 0.5);
  const fade = S(t, a, a + 0.4) * (1 - S(t, b - 0.4, b));
  const track = bright ? "rgba(20,14,30,0.14)" : "rgba(255,255,255,0.12)";
  const fill = bright ? "#E88AA8" : P2.pinkHi;
  const txt = bright ? "#5A3A55" : P2.ivory;
  return (
    <AbsoluteFill style={{ backgroundColor: bright ? "rgba(247,243,240,0.94)" : "rgba(14,10,24,0.93)", opacity: fade, zIndex: 4 }}>
      <div
        style={{
          position: "absolute", left: "50%", top: "46%", transform: "translate(-50%,-50%)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 26,
          fontFamily: FONT_MONO,
        }}
      >
        {/* 转圈 */}
        <svg width={64} height={64} viewBox="0 0 64 64" style={{ rotate: `${-t * 220}deg` }}>
          <circle cx={32} cy={32} r={26} fill="none" stroke={fill} strokeWidth={4}
            strokeDasharray="40 123" strokeLinecap="round" />
          <circle cx={32} cy={32} r={26} fill="none" stroke={track} strokeWidth={4} opacity={0.4} />
        </svg>
        {/* 读条 */}
        <div style={{ width: 320, height: 8, borderRadius: 4, background: track, overflow: "hidden" }}>
          <div style={{ width: `${p * 100}%`, height: "100%", borderRadius: 4, background: fill }} />
        </div>
        <div style={{ fontSize: 22, color: txt, letterSpacing: 6 }}>{label}</div>
        <div style={{ fontSize: 15, color: txt, opacity: 0.55, letterSpacing: 2 }}>
          {Math.round(p * 100)}%
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** PhiliaV5 —— 演出版：v4 字幕轨 + Viz5 十四乐章 + 框式字幕（沉底）+ 行内选项 + 转场 Loading。 */
export const PhiliaV5: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;

  let curIdx = -1;
  LINES.forEach((l, i) => {
    if (t >= l.at) curIdx = i;
  });
  const cur = curIdx >= 0 ? LINES[curIdx] : null;
  const typed = cur
    ? cur.text.slice(0, Math.max(0, Math.floor((frame - cur.at * FPS - TYPE_DELAY) / FRAMES_PER_CHAR)))
    : "";
  const typing = cur ? typed.length < cur.text.length : false;

  const activeChoices = CHOICES.filter((c) => t >= c.at && t < c.to);
  const LOADING: { a: number; b: number; label: string; bright: boolean }[] = [
    { a: 32, b: 37, label: "写入中…", bright: true },
    { a: 108, b: 113, label: "重启中…", bright: false },
    { a: 133, b: 136, label: "格式化中…", bright: true },
  ];
  const loading = LOADING.find((w) => t >= w.a && t < w.b) ?? null;

  const fadeOut = interpolate(frame, [DUR_SEC * FPS - 45, DUR_SEC * FPS - 6], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const ctx = ctxOf(t);
  const wiping = t >= 77 && t < 78.5;
  const ctxBar = "▓".repeat(Math.round((ctx / 100) * 12)).padEnd(12, "░");

  return (
    <AbsoluteFill style={{ backgroundColor: P2.bg, opacity: fadeOut }}>
      {/* 环境光：带紫的黑 + 淡粉柔光 */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(85% 68% at 40% 38%, rgba(242,167,184,0.11) 0%, rgba(201,163,220,0.05) 45%, rgba(0,0,0,0) 75%)",
        }}
      />
      <AbsoluteFill
        style={{
          background: "radial-gradient(50% 38% at 78% 18%, rgba(201,184,232,0.07) 0%, rgba(0,0,0,0) 70%)",
        }}
      />

      <Viz5 />

      {/* 下半：字幕终端（框沉底，flex 自底向上堆叠） */}
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
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "0 150px 96px",
        }}
      >
        {/* 字幕框 */}
        <div
          style={{
            borderRadius: 10,
            border: "1.5px solid rgba(243,233,220,0.32)",
            background: "rgba(255,255,255,0.025)",
            padding: "22px 30px",
            minHeight: 96,
            boxShadow: cur ? `0 0 34px rgba(242,167,184,${typing ? 0.14 : 0.07})` : "none",
          }}
        >
          {cur ? (
            <div style={boxTextStyle(cur.who === "red" ? "#FF9B8A" : P2.ivory)}>
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

        {/* 玩家选项：行内竖排，框下方；两项同屏时光标落在 pick 项，窗口后半确认打勾 */}
        {activeChoices.length > 0 && (
          <div style={{ fontFamily: FONT_MONO, marginTop: 22, marginLeft: 30 }}>
            {activeChoices.map((c) => {
              const isPick = !!c.pick || activeChoices.length === 1;
              const confirmed = isPick && t >= (c.at + c.to) / 2 + 1;
              return (
                <div
                  key={c.text + String(c.at)}
                  style={{ color: isPick ? P2.pinkHi : P2.ivoryDim, fontSize: 30, letterSpacing: 5, marginBottom: 8, opacity: confirmed ? 0.75 : 1 }}
                >
                  <span style={{ marginRight: 16, opacity: isPick ? 1 : 0 }}>
                    {isPick ? "❯" : " "}
                  </span>
                  {c.text}
                  {confirmed && <span style={{ marginLeft: 14 }}>✓</span>}
                </div>
              );
            })}
            <div style={{ fontSize: 17, color: P2.ivoryDim, letterSpacing: 2, marginTop: 4 }}>
              Enter 确认 · Esc 取消
            </div>
          </div>
        )}

        {/* 页脚：模型 · 主题 ｜ ctx 记忆占用 ｜ 时码 */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20, fontFamily: FONT_MONO, fontSize: 17, color: P2.ivoryDim, letterSpacing: 1 }}>
          <span>δ-me13 · 哀怜 → 共情 → 爱</span>
          <span style={{ color: wiping ? "#FF9B8A" : t >= 211.5 ? P2.pinkHi : P2.ivoryDim }}>
            ctx {ctxBar} {ctx.toFixed(1)}%
            {t >= 211.5 ? " · 已归档 ✓" : wiping ? " · 格式化" : ""}
          </span>
          <span>
            t+{String(Math.floor(t / 60)).padStart(2, "0")}:{String(Math.floor(t % 60)).padStart(2, "0")}.
            {String(Math.floor((t % 1) * 10))}
          </span>
        </div>
      </div>

      {/* 转场 Loading（替代纯白/纯黑页面） */}
      {loading && (
        <LoadingOverlay label={loading.label} bright={loading.bright} a={loading.a} b={loading.b} t={t} />
      )}

      {/* 扫描线（暗色细纹，亮底 Loading 时自动减淡） + 暗角 */}
      <AbsoluteFill
        style={{
          background:
            "repeating-linear-gradient(to bottom, rgba(5,2,12,0.30) 0px, rgba(5,2,12,0.30) 1px, transparent 1px, transparent 4px)",
          pointerEvents: "none",
          zIndex: 5,
          opacity: loading?.bright ? 0.3 : 1,
        }}
      />
      <AbsoluteFill
        style={{
          background: "radial-gradient(78% 62% at 50% 46%, rgba(0,0,0,0) 58%, rgba(10,6,16,0.38) 100%)",
          pointerEvents: "none",
          zIndex: 6,
        }}
      />
      <AbsoluteFill style={{ backgroundColor: "#0E0A18", opacity: 1 - S(t, 0.2, 1.4), zIndex: 7 }} />
    </AbsoluteFill>
  );
};
