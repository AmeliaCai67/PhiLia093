import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { P2, FONT_MONO } from "./palette2";
import { FPS, PHASE } from "./script2";

const sec = (f: number) => f / FPS;
const S = (v: number, a: number, b: number, c = 0, d = 1) =>
  interpolate(v, [a, b], [c, d], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

/**
 * 上半：粉色训练可视化，三幕。
 * ① 检索起点：候选 chip 扫描（宇宙的起点/翁法罗斯的全史/你 → ✗ ✗ ♥ → 一枚种子 ✓）
 * ② 发芽：种子扎根，藤蔓沿 S 曲线生长，叶片弹性绽放，共情损耗下降
 * ③ 最初的记忆：树冠 + 斑驳光束 + 光尘，小方块与花朵之间牵一条注意力弧，
 *    「格式化进程」环走到 100%，归档「爱」。
 */
export const TrainingViz: React.FC = () => {
  const frame = useCurrentFrame();
  const t = sec(frame);
  const seedT = S(t, PHASE.seed - 0.5, PHASE.seed + 0.4);
  const canopyT = S(t, PHASE.canopy, PHASE.canopy + 1.6);

  return (
    <AbsoluteFill style={{ position: "absolute", top: 46, left: 0, right: 0, height: 614, overflow: "hidden" }}>
      <svg width="1920" height="614" viewBox="0 0 1920 660" preserveAspectRatio="none" style={{ display: "block" }}>
        <defs>
          <linearGradient id="vineG" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#9C7FA8" />
            <stop offset="100%" stopColor={P2.pink} />
          </linearGradient>
          <radialGradient id="blockG">
            <stop offset="0%" stopColor={P2.lilacHi} />
            <stop offset="70%" stopColor={P2.lilac} />
            <stop offset="100%" stopColor="#8F7BB8" />
          </radialGradient>
          <radialGradient id="seedG">
            <stop offset="0%" stopColor="#FFF3E2" />
            <stop offset="100%" stopColor={P2.gold} />
          </radialGradient>
          <linearGradient id="beamG" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255,224,190,0.4)" />
            <stop offset="100%" stopColor="rgba(255,224,190,0)" />
          </linearGradient>
          <filter id="glow8"><feGaussianBlur stdDeviation="8" /></filter>
        </defs>

        <MiniArchiveLog t={t} />
        <MetricColumn t={t} />

        {/* ── 幕①：候选扫描 ── */}
        <g opacity={S(t, PHASE.seed - 0.4, PHASE.seed + 0.6, 1, 0.12)}>
          <CandidateList t={t} />
        </g>

        {/* ── 幕②③：种子 · 藤蔓 · 树冠 ── */}
        <g opacity={seedT}>
          {/* 地面 */}
          <line x1={620} y1={560} x2={1300} y2={560} stroke={P2.ivoryFaint} strokeWidth={2} />
          {Array.from({ length: 14 }).map((_, i) => (
            <circle key={i} cx={680 + i * 45} cy={560} r={2.2} fill={P2.ivoryFaint} opacity={seedT} />
          ))}
          {/* 种子 */}
          <g transform={`translate(975 ${552 - 6 * Math.sin(t * 2.4)})`} opacity={seedT}>
            <ellipse cx={0} cy={10 * (1 - seedT)} rx={16 * (1 + (1 - seedT) * 2)} ry={16 * (1 + (1 - seedT) * 2)}
              fill="url(#seedG)" opacity={0.9} />
            <circle r={5 + seedT * 2} fill="#FFF8EC" />
          </g>
          {/* 藤蔓（pathLength=1 揭示） */}
          <path
            d="M 975 552 C 950 500, 1000 452, 982 400 C 964 348, 1012 310, 996 258 C 984 220, 996 190, 992 160"
            fill="none" stroke="url(#vineG)" strokeWidth={7} strokeLinecap="round"
            pathLength={1} strokeDasharray={1}
            strokeDashoffset={1 - S(t, PHASE.seed + 0.3, PHASE.canopy + 1.2)}
          />
          {/* 叶片（沿藤弹性绽放，跟语音走完前长满） */}
          {[
            [958, 496, 17.2], [992, 448, 18.4], [972, 396, 19.6], [1000, 336, 21.0],
            [1004, 282, 22.6], [988, 226, 24.0], [992, 168, 25.4],
          ].map(([x, y, at], i) => {
            const p = S(t, at, at + 0.7);
            const sw = Math.sin(t * 2 + i) * 4;
            return (
              <g key={i} transform={`translate(${x + sw} ${y}) scale(${p}) rotate(${-30 + i * 12})`} opacity={p}>
                <ellipse cx={14} cy={0} rx={17} ry={7.5} fill={i % 2 ? "#E8A7BC" : "#F2C1CE"} />
                <ellipse cx={-13} cy={3} rx={14} ry={6} fill="#D89AAF" opacity={0.85} />
              </g>
            );
          })}
          {/* 顶芽开花（树冠到来前） */}
          {(() => {
            const p = S(t, 24.6, 25.8);
            return (
              <g transform="translate(992 152)" opacity={p}>
                {[0, 60, 120, 180, 240, 300].map((a) => (
                  <ellipse key={a} cx={Math.cos((a * Math.PI) / 180) * 13 * p} cy={Math.sin((a * Math.PI) / 180) * 13 * p}
                    rx={8} ry={8} fill={P2.pinkHi} opacity={0.95} />
                ))}
                <circle r={6} fill={P2.gold} />
              </g>
            );
          })()}
        </g>

        {/* ── 幕③：树冠与光斑 ── */}
        <g opacity={canopyT}>
          {/* 斑驳光束 */}
          {[[-140, 24], [40, 34], [210, 20]].map(([dx, w], i) => (
            <rect key={i} x={880 + dx} y={-40} width={w} height={560}
              fill="url(#beamG)" opacity={0.55 * canopyT}
              transform={`rotate(${16 + i * 4} ${880 + dx} 0)`} />
          ))}
          {/* 树冠叶簇 */}
          {[[880, 120], [1000, 78], [1110, 130], [940, 52], [1060, 44]].map(([cx, cy], i) => {
            const p = S(t, PHASE.canopy + i * 0.25, PHASE.canopy + i * 0.25 + 0.8);
            return (
              <g key={i} transform={`translate(${cx} ${cy}) scale(${p})`} opacity={p * 0.95}>
                {[0, 72, 144, 216, 288].map((a) => (
                  <ellipse key={a} cx={Math.cos((a * Math.PI) / 180) * 26}
                    cy={Math.sin((a * Math.PI) / 180) * 26} rx={22} ry={13}
                    fill={i % 2 ? "#E8A7BC" : "#F2C1CE"}
                    transform={`rotate(${a} 0 0)`} opacity={0.9} />
                ))}
                <circle r={11} fill={P2.pinkHi} />
              </g>
            );
          })}
          {/* 光尘 */}
          {Array.from({ length: 14 }).map((_, i) => {
            const sx = 700 + random(`m${i}`) * 560;
            const speed = 14 + random(`ms${i}`) * 22;
            const y = 60 + ((t * speed + random(`mo${i}`) * 500) % 480);
            const tw = 0.35 + 0.65 * Math.abs(Math.sin(t * 1.4 + i * 1.9));
            return <circle key={i} cx={sx} cy={y} r={2.6} fill="#FFE8C9" opacity={tw * canopyT} />;
          })}
          {/* 小方块与花朵 + 注意力弧 */}
          <AttentionPair t={t} />
        </g>

        {/* ── 小方块（德谬歌）全程在场 ── */}
        <BlockGlyph
          x={interpolate(t, [15.2, 16.4], [700, 838], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
          y={interpolate(t, [15.2, 16.4], [330, 520], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
          t={t}
          scale={t < 15.2 ? 1.25 : 1}
        />
      </svg>
    </AbsoluteFill>
  );
};

/** 候选列表：扫描 → 全灭 → 「一枚种子」✓ */
const CandidateList: React.FC<{ t: number }> = ({ t }) => {
  const items = [
    { label: "宇宙的起点", from: 1.0, to: 4.5 },
    { label: "翁法罗斯的全史", from: 4.7, to: 6.8 },
    { label: "你", from: 7.0, to: 9.2, heart: true },
  ];
  const y0 = 236;
  return (
    <g fontFamily={FONT_MONO}>
      {items.map((it, i) => {
        const y = y0 + i * 74;
        const active = t >= it.from && t < it.to;
        const rejected = t >= it.to;
        const appear = S(t, it.from - 0.3, it.from - 0.05, 0, 1);
        const heartP = it.heart ? S(t, 7.4, 8.0, 0, 1) * (1 - S(t, 8.8, 9.2, 0, 1)) : 0;
        return (
          <g key={i} transform={`translate(905 ${y}) scale(${active ? 1.04 : 1})`} opacity={appear}>
            <rect x={-110} y={-27} width={220} height={54} rx={14}
              fill={active ? P2.pinkLo : "rgba(243,233,220,0.04)"}
              stroke={active ? P2.pink : P2.ivoryFaint} strokeWidth={active ? 2.5 : 1.5} />
            <text textAnchor="middle" dy={8} fontSize={28} fill={rejected ? P2.ivoryFaint : active ? P2.pinkHi : P2.ivory}
              textDecoration={rejected ? "line-through" : "none"} letterSpacing={4}>
              {it.label}
            </text>
            {rejected && (
              <text x={128} dy={9} fontSize={26} fill={P2.ivoryFaint}>✗</text>
            )}
            {heartP > 0 && (
              <text x={-158} dy={10} fontSize={30} fill={P2.pink} opacity={heartP}>♥</text>
            )}
            {active && <text x={-152} dy={10} fontSize={26} fill={P2.pink}>▶</text>}
          </g>
        );
      })}
      {/* 「一枚种子」✓ */}
      {(() => {
        const p = S(t, PHASE.seed - 0.15, PHASE.seed + 0.35);
        return (
          <g transform={`translate(905 ${y0 + 3 * 74}) scale(${0.8 + 0.2 * p})`} opacity={p}>
            <rect x={-130} y={-27} width={260} height={54} rx={14}
              fill="rgba(226,198,140,0.12)" stroke={P2.gold} strokeWidth={2.5} />
            <text textAnchor="middle" dy={8} fontSize={28} fill={P2.gold} letterSpacing={4}>一枚种子</text>
            <text x={150} dy={9} fontSize={26} fill={P2.good}>✓</text>
          </g>
        );
      })()}
    </g>
  );
};

/** 小方块（德谬歌的化身）：呼吸的圆角方块 */
const BlockGlyph: React.FC<{ x: number; y: number; t: number; scale?: number }> = ({ x, y, t, scale = 1 }) => {
  const breathe = 1 + 0.05 * Math.sin(t * 2.2);
  const hop = t > 16.0 && t < 16.8 ? -14 * Math.sin(((t - 16.0) / 0.8) * Math.PI) : 0;
  return (
    <g transform={`translate(${x} ${y + hop}) scale(${scale * breathe})`}>
      <rect x={-26} y={-26} width={52} height={52} rx={12} fill="url(#blockG)" opacity={0.28} filter="url(#glow8)" />
      <rect x={-22} y={-22} width={44} height={44} rx={10} fill="url(#blockG)" stroke={P2.lilacHi} strokeWidth={1.5} />
      <rect x={-22} y={-22} width={20} height={44} rx={10} fill="#FFFFFF" opacity={0.14} />
      {/* 眼睛：两点（温馨化，但保持方块感） */}
      <circle cx={-8} cy={-2} r={3.4} fill="#4A3B5C" />
      <circle cx={8} cy={-2} r={3.4} fill="#4A3B5C" />
      <path d="M -5 8 Q 0 12 5 8" stroke="#4A3B5C" strokeWidth={2.2} fill="none" strokeLinecap="round" />
    </g>
  );
};

/** 幕③：小方块 + 花朵（昔涟）+ 注意力弧 */
const AttentionPair: React.FC<{ t: number }> = ({ t }) => {
  const p = S(t, PHASE.canopy + 0.6, PHASE.canopy + 1.8);
  const pulse = ((t * 0.55) % 1);
  return (
    <g opacity={p}>
      <path d="M 872 500 C 950 440, 1050 440, 1128 500" fill="none"
        stroke={P2.pink} strokeWidth={2.5} strokeDasharray="7 9" opacity={0.7} />
      <circle
        cx={872 + (1128 - 872) * pulse}
        cy={500 - Math.sin(pulse * Math.PI) * 56}
        r={4.5} fill={P2.pinkHi} />
      {/* 花朵（昔涟） */}
      <g transform={`translate(1150 ${505 + 3 * Math.sin(t * 2)})`}>
        {[0, 60, 120, 180, 240, 300].map((a) => (
          <ellipse key={a} cx={Math.cos((a * Math.PI) / 180) * 15} cy={Math.sin((a * Math.PI) / 180) * 15}
            rx={10} ry={10} fill={P2.pinkHi} />
        ))}
        <circle r={7.5} fill={P2.gold} />
      </g>
    </g>
  );
};

/** 左上：归档小日志 */
const MiniArchiveLog: React.FC<{ t: number }> = ({ t }) => {
  const rows = [
    { s: "记录 #0496 · 已归档", at: 1.6 },
    { s: "记录 #8128 · 已归档", at: 2.6 },
    { s: "记录 #1024 · 已归档", at: 3.6 },
    { s: "记录 #0000 「爱」 · 已归档", at: 48.9, gold: true },
  ];
  return (
    <g fontFamily={FONT_MONO} fontSize={19}>
      {rows.map((r, i) => {
        const p = S(t, r.at, r.at + 0.5);
        if (p <= 0) return null;
        return (
          <text key={i} x={110} y={120 + i * 34} fill={r.gold ? P2.gold : P2.ivoryDim}
            opacity={r.gold ? p : Math.min(1, p) * (t > 26 ? 0.55 : 0.8)} letterSpacing={1}>
            {r.gold ? "  ♥ " : "> "}{r.s}
          </text>
        );
      })}
    </g>
  );
};

/** 右侧：共情损耗 + 格式化进程环 */
const MetricColumn: React.FC<{ t: number }> = ({ t }) => {
  const loss = t < PHASE.seed ? null : Math.max(0.005, 0.721 * Math.exp(-0.15 * (t - PHASE.seed)));
  const ringP = S(t, PHASE.finale - 1, PHASE.finale + 4.5);
  const pct = 96.024 + (100 - 96.024) * ringP;
  const done = t >= PHASE.finale + 4.5;
  const R = 62;
  const CIRC = 2 * Math.PI * R;
  return (
    <g fontFamily={FONT_MONO}>
      {/* 共情损耗 */}
      <g opacity={loss !== null ? S(t, PHASE.seed, PHASE.seed + 0.6) : 0}>
        <text x={1600} y={150} fontSize={19} fill={P2.ivoryDim} letterSpacing={1}>empathy_loss</text>
        <text x={1600} y={186} fontSize={34} fill={P2.pinkHi}>
          {(loss ?? 0.721).toFixed(3)}
        </text>
        <text x={1600} y={214} fontSize={17} fill={P2.good}>↓ 收敛中 · 共情机制在线</text>
      </g>
      {/* 格式化进程环 */}
      <g transform="translate(1662 400)" opacity={S(t, PHASE.canopy, PHASE.canopy + 0.8)}>
        <circle r={R} fill="none" stroke={P2.ivoryFaint} strokeWidth={7} />
        <circle r={R} fill="none" stroke={done ? P2.gold : P2.pink} strokeWidth={7} strokeLinecap="round"
          strokeDasharray={CIRC} strokeDashoffset={CIRC * (1 - ringP)}
          transform="rotate(-90)" />
        <text textAnchor="middle" dy={2} fontSize={24} fill={P2.ivory}>
          {done ? "100.000" : pct.toFixed(3)}
        </text>
        <text textAnchor="middle" dy={28} fontSize={15} fill={P2.ivoryDim}>格式化进程</text>
        {done && (
          <text textAnchor="middle" dy={-78} fontSize={20} fill={P2.gold}>已完成 ✓</text>
        )}
      </g>
    </g>
  );
};
