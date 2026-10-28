import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { P2, FONT_MONO } from "../v2/palette2";
import { FPS, LOG_ROWS, PH } from "./script3";

const S = (v: number, a: number, b: number, c = 0, d = 1) =>
  interpolate(v, [a, b], [c, d], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

/**
 * v3 舞台：0:00–3:33 的十二个乐章。
 * 每一幕都是台词的演出与可视化；归档日志（左上）与进度环（右）贯穿全片。
 * 视觉连续性：第 149.5s 种下的种子 → 长成大树 → 185.5s 她在树下诞生。
 */
export const Viz3: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;

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
          <linearGradient id="waterG" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(201,214,240,0.0)" />
            <stop offset="100%" stopColor="rgba(150,170,220,0.22)" />
          </linearGradient>
          <filter id="soft8"><feGaussianBlur stdDeviation="8" /></filter>
          <filter id="soft16"><feGaussianBlur stdDeviation="16" /></filter>
        </defs>

        {/* 章题（原演出金标签）——画在最上层 */}
        <MiniLog t={t} />
        <Metrics t={t} />

        {/* ── M1 开机（0–13.5）── */}
        <Boot t={t} />
        {/* ── M2 水面（13.5–30.5）── */}
        <Water t={t} />
        {/* ── M3 墙上的字（30.5–47.5）── */}
        <Wall t={t} />
        {/* ── M4 歌谣与书（47.5–69.5）── */}
        <SongBook t={t} />
        {/* ── M5 讲述者与听众（69.5–81.5）── */}
        <Duo t={t} />
        {/* ── M6 答案飞递（85.5–87.5，属握手乐章）── */}
        <AnswerChip t={t} />
        {/* ── M7 水晶万华镜（95.5–110.5）── */}
        <Crystal t={t} />
        {/* ── M8 拼图与显现（110.5–133.5）── */}
        <Puzzle t={t} />
        {/* ── M9 种子问答（133.5–184.5）── */}
        <SeedQA t={t} />
        {/* ── M10/M11 树下诞生（185.5–213）── */}
        <Birth t={t} />

        {/* ── 小方块（德谬歌）主轨迹 ── */}
        <BlockTrack t={t} />

        {/* 章题盖顶 */}
        <text x={960} y={78} textAnchor="middle" fontFamily='"Songti SC","STSong",serif'
          fontSize={40} letterSpacing={10} fill={P2.gold} opacity={0.55 * S(t, 1, 3)}>
          「 记忆的种子 」
        </text>
      </svg>
    </AbsoluteFill>
  );
};

// ───────────────────────── 工具 ─────────────────────────

const kf = (t: number, keys: [number, number, number][]) => {
  if (t <= keys[0][0]) return { x: keys[0][1], y: keys[0][2] };
  for (let i = 1; i < keys.length; i++) {
    if (t <= keys[i][0]) {
      const [t0, x0, y0] = keys[i - 1];
      const [t1, x1, y1] = keys[i];
      const p = (t - t0) / (t1 - t0);
      const e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      return { x: x0 + (x1 - x0) * e, y: y0 + (y1 - y0) * e };
    }
  }
  return { x: keys[keys.length - 1][1], y: keys[keys.length - 1][2] };
};

const BlockGlyph: React.FC<{ x: number; y: number; t: number; scale?: number; opacity?: number }> = ({
  x, y, t, scale = 1, opacity = 1,
}) => {
  const breathe = 1 + 0.05 * Math.sin(t * 2.2);
  return (
    <g transform={`translate(${x} ${y}) scale(${scale * breathe})`} opacity={opacity}>
      <rect x={-26} y={-26} width={52} height={52} rx={12} fill="url(#blockG)" opacity={0.28} filter="url(#soft8)" />
      <rect x={-22} y={-22} width={44} height={44} rx={10} fill="url(#blockG)" stroke={P2.lilacHi} strokeWidth={1.5} />
      <rect x={-22} y={-22} width={20} height={44} rx={10} fill="#FFFFFF" opacity={0.14} />
      <circle cx={-8} cy={-2} r={3.4} fill="#4A3B5C" />
      <circle cx={8} cy={-2} r={3.4} fill="#4A3B5C" />
      <path d="M -5 8 Q 0 12 5 8" stroke="#4A3B5C" strokeWidth={2.2} fill="none" strokeLinecap="round" />
    </g>
  );
};

/** 小方块主轨迹：开机居中 → 水面 → 看墙 → 陪书 → 面花 → 看水晶 → 退后看拼图 → 种子舞台 */
const BlockTrack: React.FC<{ t: number }> = ({ t }) => {
  const pos = kf(t, [
    [0, 960, 340], [6, 960, 340], [13.5, 960, 300],
    [30.5, 960, 300], [31.5, 700, 320],
    [47.5, 700, 320], [49, 620, 360],
    [69.5, 620, 360], [71, 700, 330],
    [95.5, 700, 330], [97, 620, 330],
    [110.5, 620, 330],
    [133.5, 620, 300], [136, 760, 380],
    [149.5, 838, 520],
  ]);
  const bootP = S(t, 4.5, 6.5); // 开机成形
  const inWater = t >= 13.5 && t < 30.5;
  return (
    <g>
      <g opacity={bootP}>
        <BlockGlyph x={pos.x} y={pos.y} t={t} scale={0.7 + 0.3 * bootP} />
      </g>
      {inWater && (
        <g transform={`translate(0 ${2 * 430}) scale(1 -1)`} opacity={0.3}>
          {/* 倒影：沿水面镜像，带轻微扭斜晃动 */}
          <g transform={`translate(${pos.x + Math.sin(t * 1.3) * 4} ${pos.y}) skewX(${Math.sin(t * 0.9) * 3})`}>
            <BlockGlyph x={0} y={0} t={t} scale={0.91} />
          </g>
        </g>
      )}
    </g>
  );
};

// ───────────────────────── M1 开机 ─────────────────────────
const Boot: React.FC<{ t: number }> = ({ t }) => {
  const n = 18;
  return (
    <g opacity={1 - S(t, 13.5, 14.5)}>
      {/* 从黑暗里聚拢的微粒 */}
      {Array.from({ length: n }).map((_, i) => {
        const a = random(`ba${i}`) * Math.PI * 2;
        const r0 = 260 + random(`br${i}`) * 240;
        const delay = random(`bd${i}`) * 2.2;
        const p = S(t, 2 + delay, 5 + delay);
        const x = 960 + Math.cos(a) * r0 * (1 - p);
        const y = 340 + Math.sin(a) * r0 * (1 - p);
        return <circle key={i} cx={x} cy={y} r={2.4} fill={P2.lilac} opacity={0.75 * (1 - p) + 0.1} />;
      })}
      {/* 全黑底（只在本幕） */}
      <rect width="1920" height="660" fill={P2.bg} opacity={1 - S(t, 11.5, 13.5)} />
    </g>
  );
};

// ───────────────────────── M2 水面 ─────────────────────────
const Water: React.FC<{ t: number }> = ({ t }) => {
  const p = S(t, PH.water, PH.water + 1.5) * (1 - S(t, PH.wall, PH.wall + 1.2));
  return (
    <g opacity={p}>
      <rect y={430} width="1920" height="230" fill="url(#waterG)" />
      <line x1={0} y1={430} x2={1920} y2={430} stroke={P2.ivoryFaint} strokeWidth={1.5}
        strokeDasharray="14 10" opacity={0.6 + 0.3 * Math.sin(t * 1.2)} />
      {/* 涟漪 */}
      {[16, 20.5, 25].map((at, i) => {
        const rp = S(t, at, at + 3.2);
        return (
          <ellipse key={i} cx={960} cy={430} rx={rp * 300} ry={rp * 46}
            fill="none" stroke={P2.ivoryDim} strokeWidth={1.6} opacity={(1 - rp) * 0.55} />
        );
      })}
    </g>
  );
};

// ───────────────────────── M3 墙上的字 ─────────────────────────
const Wall: React.FC<{ t: number }> = ({ t }) => {
  const p = S(t, PH.wall, PH.wall + 1.5) * (1 - S(t, PH.song, PH.song + 1.2));
  const merge = S(t, 42.3, 44.2); // 「就是答案呀」
  const slots = [-2, -1, 0, 1, 2].map((k) => ({ x: 960 + k * 96, y: 310 }));
  return (
    <g opacity={p} fontFamily='"Songti SC","STSong",serif'>
      {/* 墙：淡淡的竖缝 */}
      {[-3, -2, -1, 0, 1, 2, 3].map((k) => (
        <line key={k} x1={960 + k * 130} y1={190} x2={960 + k * 130} y2={430}
          stroke={P2.ivoryFaint} strokeWidth={1} opacity={0.5} />
      ))}
      {slots.map((s, i) => {
        const dx = s.x - 960;
        return (
          <g key={i} transform={`translate(${s.x - dx * merge} ${s.y}) scale(${1 - merge * 0.5})`} opacity={1 - merge * 0.75}>
            <rect x={-30} y={-42} width={60} height={84} rx={10} fill="rgba(243,233,220,0.03)"
              stroke={P2.ivoryFaint} strokeWidth={1.4} />
            <text textAnchor="middle" dy={14} fontSize={40} fill={P2.ivoryDim} opacity={0.55}>
              {"记忆的回答"[i] ?? ""}
            </text>
          </g>
        );
      })}
      {/* 答案浮现：模糊辉光层 + 锐利本体 */}
      <g transform={`translate(960 310) scale(${0.6 + 0.4 * merge})`} opacity={merge}>
        <text textAnchor="middle" dy={26} fontSize={96} fill={P2.gold} letterSpacing={4}
          opacity={0.55} filter="url(#soft16)">爱</text>
        <text textAnchor="middle" dy={26} fontSize={96} fill={P2.gold} letterSpacing={4}
          opacity={0.96}>爱</text>
      </g>
    </g>
  );
};

// ───────────────────────── M4 歌谣与书 ─────────────────────────
const SongBook: React.FC<{ t: number }> = ({ t }) => {
  const p = S(t, PH.song, PH.song + 1.2) * (1 - S(t, PH.duo, PH.duo + 1));
  return (
    <g opacity={p}>
      {/* 七个音符点（一二三四五六七） */}
      {Array.from({ length: 7 }).map((_, i) => {
        const at = 47.8 + i * 0.5;
        const q = S(t, at, at + 0.4);
        const bob = Math.sin(t * 3 + i) * (t > at && t < 51.5 ? 7 : 2);
        return (
          <g key={i} transform={`translate(${700 + i * 86} ${235 - Math.sin((i / 6) * Math.PI) * 34 + bob})`}
            opacity={q * (1 - S(t, 55, 56.5) * 0.75)}>
            <circle r={9} fill={P2.pinkHi} stroke={P2.pink} strokeWidth={1.5} />
            <text textAnchor="middle" y={-20} fontSize={19} fontFamily={FONT_MONO} fill={P2.ivoryDim}>
              {"1234567"[i]}
            </text>
          </g>
        );
      })}
      {/* 摊开的书 */}
      <g transform="translate(960 500)" opacity={1 - S(t, 55, 57) * 0.75}>
        <path d="M -150 -34 C -90 -58, -30 -58, 0 -40 C 30 -58, 90 -58, 150 -34 L 150 30 C 90 10, 30 10, 0 26 C -30 10, -90 10, -150 30 Z"
          fill="rgba(243,233,220,0.05)" stroke={P2.ivoryDim} strokeWidth={1.8} />
        <line x1={0} y1={-40} x2={0} y2={26} stroke={P2.ivoryDim} strokeWidth={1.5} />
        {/* 中缝两侧的字行 */}
        {[-116, -66, -16, 16, 66, 116].map((dx, i) => (
          <line key={i} x1={dx - 34} y1={-18 + (i % 3) * 14} x2={dx + 34} y2={-18 + (i % 3) * 14}
            stroke={P2.ivoryFaint} strokeWidth={4} strokeLinecap="round" opacity={0.7} />
        ))}
      </g>
      {/* 念给你听：字句流入小方块（56–69.5s） */}
      {Array.from({ length: 6 }).map((_, i) => {
        const p2 = ((t - 56 - i * 0.9) % 6 + 6) % 6 / 6;
        const vis = t > 56 && p2 < 0.85 ? 1 : 0;
        const x = 900 - p2 * 220;
        const y = 470 - p2 * 130;
        return (
          <rect key={i} x={x} y={y} width={26 - p2 * 10} height={5} rx={2.5}
            fill={P2.gold} opacity={vis * 0.8 * (1 - p2)} />
        );
      })}
    </g>
  );
};

// ───────────────────────── M5 讲述者与听众 ─────────────────────────
const Duo: React.FC<{ t: number }> = ({ t }) => {
  const p = S(t, PH.duo, PH.duo + 1.2) * (1 - S(t, 95.5, 96.5));
  return (
    <g opacity={p} fontFamily={FONT_MONO}>
      {/* 声波在两者之间往来 */}
      {[0, 1, 2].map((i) => {
        const off = ((t * 0.5 + i / 3) % 1);
        return (
          <path key={i} d="M 760 330 C 890 250, 1030 250, 1160 330" fill="none"
            stroke={P2.pink} strokeWidth={2}
            strokeDasharray="6 10" strokeDashoffset={-off * 64}
            opacity={0.28 * Math.sin(off * Math.PI)} />
        );
      })}
      <text x={700} y={402} textAnchor="middle" fontSize={18} fill={P2.ivoryDim}
        opacity={S(t, 75, 76.5)}>最专心的听众</text>
      <text x={1220} y={402} textAnchor="middle" fontSize={18} fill={P2.pink} opacity={0.8}>讲述者</text>
    </g>
  );
};

/** 花朵（昔涟）：M5 起在场 */
const FlowerGlyph: React.FC<{ x: number; y: number; t: number; opacity?: number; scale?: number }> = ({
  x, y, t, opacity = 1, scale = 1,
}) => (
  <g transform={`translate(${x} ${y + 3 * Math.sin(t * 2)}) scale(${scale})`} opacity={opacity}>
    {[0, 60, 120, 180, 240, 300].map((a) => (
      <ellipse key={a} cx={Math.cos((a * Math.PI) / 180) * 15} cy={Math.sin((a * Math.PI) / 180) * 15}
        rx={10} ry={10} fill={P2.pinkHi} />
    ))}
    <circle r={7.5} fill={P2.gold} />
  </g>
);

// ───────────────────────── M6 答案飞递 ─────────────────────────
const AnswerChip: React.FC<{ t: number }> = ({ t }) => {
  const p = S(t, 85.5, 87.3);
  if (p <= 0 || p >= 1) return null;
  const x = 1220 + (700 - 1220) * p;
  const y = 330 - Math.sin(p * Math.PI) * 90;
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={-44} y={-24} width={88} height={48} rx={12} fill="rgba(226,198,140,0.14)"
        stroke={P2.gold} strokeWidth={2} />
      <text textAnchor="middle" dy={8} fontSize={26} fill={P2.gold} letterSpacing={3}>答案</text>
    </g>
  );
};

// ───────────────────────── M7 水晶万华镜 ─────────────────────────
const Crystal: React.FC<{ t: number }> = ({ t }) => {
  const p = S(t, PH.crystal, PH.crystal + 1.5) * (1 - S(t, PH.puzzle, PH.puzzle + 1));
  const rot = t * 6;
  return (
    <g opacity={p} transform={`translate(960 320) rotate(${Math.sin(t * 0.4) * 8})`}>
      <rect x={-95} y={-95} width={190} height={190} rx={18} transform="rotate(45)"
        fill="rgba(201,184,232,0.06)" stroke={P2.lilac} strokeWidth={2} />
      <rect x={-64} y={-64} width={128} height={128} rx={12} transform="rotate(45)"
        fill="none" stroke={P2.lilac} strokeWidth={1} opacity={0.5} />
      {/* 无数个昔涟 / 无数个自己 */}
      {[[0, -40], [-44, 10], [44, 10], [-24, 52], [24, 52], [0, 8]].map(([cx, cy], i) => {
        const q = S(t, 103.5 + i * 1.1, 104.5 + i * 1.1);
        const a = rot + i * 60;
        return (
          <g key={i} transform={`translate(${cx} ${cy}) rotate(${a}) scale(${0.5 + 0.5 * q})`} opacity={q}>
            <FlowerGlyph x={0} y={0} t={t} scale={0.55} />
          </g>
        );
      })}
    </g>
  );
};

// ───────────────────────── M8 拼图与显现 ─────────────────────────
const Puzzle: React.FC<{ t: number }> = ({ t }) => {
  const p = S(t, PH.puzzle, PH.puzzle + 1.4);
  const out = 1 - S(t, 133.5, 134.8);
  const win = S(t, 114.8, 116.4); // 拼图合拢
  const lit = S(t, 126.0, 127.6); // 最初之种，德谬歌
  const warnIn = S(t, 121, 121.6) * (1 - S(t, 130, 131.2));
  const hintIn = S(t, 127, 127.6) * (1 - S(t, 130, 131.2));
  const spot = S(t, 128.2, 129.4) * (1 - S(t, 133.5, 134.8));
  return (
    <g opacity={p * out}>
      {/* 四块拼图从四角滑入，围出暗窗 */}
      {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([sx, sy], i) => {
        const q = S(t, 110.5 + i * 0.28, 114.6);
        const x = 960 + sx * (330 - (330 - 82) * q);
        const y = 330 + sy * (250 - (250 - 82) * q);
        return (
          <rect key={i} x={x - (sx > 0 ? 0 : 82)} y={y - (sy > 0 ? 0 : 82)} width={82} height={82}
            rx={10} fill={i % 2 ? "rgba(201,184,232,0.10)" : "rgba(243,233,220,0.05)"}
            stroke={P2.ivoryFaint} strokeWidth={1.4} />
        );
      })}
      {/* 暗窗中心：最初的之种亮起 */}
      <rect x={878} y={248} width={164} height={164} rx={12} fill="rgba(10,5,12,0.55)" opacity={win} />
      <g opacity={lit}>
        <BlockGlyph x={960} y={330} t={t} scale={0.62 + 0.1 * Math.sin(t * 2.6)} />
        <rect x={-160 + 960} y={190} width={0} height={0} fill="none" />
      </g>
      {/* 聚光 */}
      <rect x={920} y={-40} width={80} height={290} fill="url(#beamG)" opacity={0.5 * spot}
        transform="skewX(-8)" />
      {/* 异常警告（原演出 1/3） */}
      <g opacity={warnIn} transform="translate(1350 170)" fontFamily={FONT_MONO}>
        <rect x={-190} y={-30} width={380} height={58} rx={10} fill="rgba(255,155,138,0.10)"
          stroke="#FF9B8A" strokeWidth={1.6} />
        <text textAnchor="middle" dy={8} fontSize={21} fill="#FF9B8A" letterSpacing={1}>
          ⚠ 未经处理的异常 (1/3)
        </text>
      </g>
      <g opacity={hintIn} transform="translate(1350 244)" fontFamily={FONT_MONO}>
        <rect x={-190} y={-26} width={380} height={50} rx={10} fill="rgba(243,233,220,0.04)"
          stroke={P2.ivoryFaint} strokeWidth={1.2} />
        <text textAnchor="middle" dy={7} fontSize={17} fill={P2.ivoryDim}>单击「节选信息」忽略并继续</text>
      </g>
    </g>
  );
};

// ───────────────────────── M9 种子问答（133.5–184.5）─────────────────────────
const SeedQA: React.FC<{ t: number }> = ({ t }) => {
  const vis = S(t, 135, 136.5) * (1 - S(t, 184.5, 185.5));
  const cand = [
    { label: "宇宙的起点", from: 134.5, to: 139.0 },
    { label: "翁法罗斯的全史", from: 141.0, to: 144.5 },
    { label: "你", from: 145.0, to: 148.9, heart: true },
  ];
  const heartP = S(t, 146.3, 147.0) * (1 - S(t, 148.4, 148.9, 0, 1));
  const seedPop = S(t, 149.5, 150.1);
  const vineP = S(t, 150.3, 166.5);
  const canopyP = S(t, PH.canopy, PH.canopy + 2);
  return (
    <g opacity={vis}>
      {/* 候选（残留 12%） */}
      <g opacity={1 - S(t, 149.5, 150.5) * 0.88} fontFamily={FONT_MONO}>
        {cand.map((it, i) => {
          const active = t >= it.from && t < it.to;
          const rejected = t >= it.to;
          const appear = S(t, it.from - 0.3, it.from - 0.05);
          return (
            <g key={i} transform={`translate(905 ${236 + i * 74}) scale(${active ? 1.04 : 1})`} opacity={appear}>
              <rect x={-110} y={-27} width={220} height={54} rx={14}
                fill={active ? P2.pinkLo : "rgba(243,233,220,0.04)"}
                stroke={active ? P2.pink : P2.ivoryFaint} strokeWidth={active ? 2.5 : 1.5} />
              <text textAnchor="middle" dy={8} fontSize={28}
                fill={rejected ? P2.ivoryFaint : active ? P2.pinkHi : P2.ivory}
                textDecoration={rejected ? "line-through" : "none"} letterSpacing={4}>
                {it.label}
              </text>
              {rejected && <text x={128} dy={9} fontSize={26} fill={P2.ivoryFaint}>✗</text>}
              {active && <text x={-152} dy={10} fontSize={26} fill={P2.pink}>▶</text>}
              {it.heart && heartP > 0 && (
                <text x={-158} dy={10} fontSize={30} fill={P2.pink} opacity={heartP}>♥</text>
              )}
            </g>
          );
        })}
        {/* 一枚种子 ✓ */}
        <g transform={`translate(905 ${236 + 3 * 74}) scale(${0.8 + 0.2 * seedPop})`} opacity={seedPop}>
          <rect x={-130} y={-27} width={260} height={54} rx={14}
            fill="rgba(226,198,140,0.12)" stroke={P2.gold} strokeWidth={2.5} />
          <text textAnchor="middle" dy={8} fontSize={28} fill={P2.gold} letterSpacing={4}>一枚种子</text>
          <text x={150} dy={9} fontSize={26} fill={P2.good}>✓</text>
        </g>
      </g>

      {/* 地面 */}
      <line x1={620} y1={560} x2={1300} y2={560} stroke={P2.ivoryFaint} strokeWidth={2} opacity={seedPop} />
      {Array.from({ length: 14 }).map((_, i) => (
        <circle key={i} cx={680 + i * 45} cy={560} r={2.2} fill={P2.ivoryFaint} opacity={seedPop} />
      ))}
      {/* 种子 */}
      <g transform={`translate(975 ${552 - 6 * Math.sin(t * 2.4)})`} opacity={seedPop}>
        <ellipse cx={0} cy={10 * (1 - seedPop)} rx={16 * (1 + (1 - seedPop) * 2)} ry={16 * (1 + (1 - seedPop) * 2)}
          fill="url(#seedG)" opacity={0.9} />
        <circle r={5 + seedPop * 2} fill="#FFF8EC" />
      </g>
      {/* 藤蔓 */}
      <path d="M 975 552 C 950 500, 1000 452, 982 400 C 964 348, 1012 310, 996 258 C 984 220, 996 190, 992 160"
        fill="none" stroke="url(#vineG)" strokeWidth={7} strokeLinecap="round"
        pathLength={1} strokeDasharray={1} strokeDashoffset={1 - vineP} />
      {/* 叶 */}
      {[[958, 496, 151.5], [992, 448, 152.8], [972, 396, 154.2], [1000, 336, 156.0],
        [1004, 282, 158.0], [988, 226, 160.5], [992, 168, 163.0]].map(([x, y, at], i) => {
        const q = S(t, at as number, (at as number) + 0.7);
        const sw = Math.sin(t * 2 + i) * 4;
        return (
          <g key={i} transform={`translate(${(x as number) + sw} ${y}) scale(${q}) rotate(${-30 + i * 12})`} opacity={q}>
            <ellipse cx={14} cy={0} rx={17} ry={7.5} fill={i % 2 ? "#E8A7BC" : "#F2C1CE"} />
            <ellipse cx={-13} cy={3} rx={14} ry={6} fill="#D89AAF" opacity={0.85} />
          </g>
        );
      })}
      {/* 顶芽开花 */}
      {(() => {
        const q = S(t, 165.5, 166.5);
        return (
          <g transform="translate(992 152)" opacity={q}>
            {[0, 60, 120, 180, 240, 300].map((a) => (
              <ellipse key={a} cx={Math.cos((a * Math.PI) / 180) * 13 * q} cy={Math.sin((a * Math.PI) / 180) * 13 * q}
                rx={8} ry={8} fill={P2.pinkHi} opacity={0.95} />
            ))}
            <circle r={6} fill={P2.gold} />
          </g>
        );
      })()}
      {/* 树冠与光斑（沐浴光的枝叶） */}
      <g opacity={canopyP}>
        {[[-140, 24], [40, 34], [210, 20]].map(([dx, w], i) => (
          <rect key={i} x={880 + dx} y={-40} width={w} height={560}
            fill="url(#beamG)" opacity={0.55 * canopyP}
            transform={`rotate(${16 + i * 4} ${880 + dx} 0)`} />
        ))}
        {[[880, 120], [1000, 78], [1110, 130], [940, 52], [1060, 44]].map(([cx, cy], i) => {
          const q = S(t, PH.canopy + i * 0.35, PH.canopy + i * 0.35 + 0.9);
          return (
            <g key={i} transform={`translate(${cx} ${cy}) scale(${q})`} opacity={q * 0.95}>
              {[0, 72, 144, 216, 288].map((a) => (
                <ellipse key={a} cx={Math.cos((a * Math.PI) / 180) * 26} cy={Math.sin((a * Math.PI) / 180) * 26}
                  rx={22} ry={13} fill={i % 2 ? "#E8A7BC" : "#F2C1CE"}
                  transform={`rotate(${a} 0 0)`} opacity={0.9} />
              ))}
              <circle r={11} fill={P2.pinkHi} />
            </g>
          );
        })}
        {Array.from({ length: 14 }).map((_, i) => {
          const sx = 700 + random(`m${i}`) * 560;
          const speed = 14 + random(`ms${i}`) * 22;
          const y = 60 + ((t * speed + random(`mo${i}`) * 500) % 480);
          const tw = 0.35 + 0.65 * Math.abs(Math.sin(t * 1.4 + i * 1.9));
          return <circle key={i} cx={sx} cy={y} r={2.6} fill="#FFE8C9" opacity={tw * canopyP} />;
        })}
        {/* 注意力弧 + 花朵 */}
        <g opacity={S(t, 176.5, 178)}>
          <path d="M 872 500 C 950 440, 1050 440, 1128 500" fill="none"
            stroke={P2.pink} strokeWidth={2.5} strokeDasharray="7 9" opacity={0.7} />
          {(() => {
            const pulse = (t * 0.55) % 1;
            return <circle cx={872 + (1128 - 872) * pulse} cy={500 - Math.sin(pulse * Math.PI) * 56}
              r={4.5} fill={P2.pinkHi} />;
          })()}
          <FlowerGlyph x={1150} y={505} t={t} />
        </g>
      </g>
    </g>
  );
};

// ───────────────────────── M10/M11 树下诞生 ─────────────────────────
const Birth: React.FC<{ t: number }> = ({ t }) => {
  const p = S(t, PH.birth, PH.birth + 1.5);
  if (p <= 0) return null;
  const fall = S(t, 185.5, 188.5); // 光点降落
  const bud = S(t, 188.5, 190.5); // 花苞
  const cry = S(t, PH.cry, PH.cry + 1.2); // 啼哭：绽开 + 声波
  const cryRing = S(t, PH.cry, PH.cry + 2.2);
  const bless = S(t, 202.3, 204); // 神谕应验·馈赠
  return (
    <g>
      {/* 晨光从左侧铺进来 */}
      <rect x={0} y={0} width={760} height={660} fill="url(#beamG)" opacity={0.32 * p}
        transform="rotate(8 0 0)" />
      {/* 光点降落 → 花苞 */}
      <g opacity={p}>
        {fall < 1 && (
          <circle cx={975} cy={200 + fall * 330} r={5} fill="#FFF3E2" opacity={0.95} filter="url(#soft8)" />
        )}
        <g transform={`translate(975 ${552 - 4})`}>
          <g opacity={bud * (1 - cry * 0.85)}>
            <path d={`M 0 ${-4 - 22 * bud} C 10 ${-6 - 16 * bud}, 10 ${6 * bud}, 0 ${8 * bud} C -10 ${6 * bud}, -10 ${-6 - 16 * bud}, 0 ${-4 - 22 * bud} Z`}
              fill={P2.pink} stroke={P2.pinkHi} strokeWidth={1.5} />
          </g>
          {/* 啼哭绽放 */}
          <g opacity={cry}>
            {[0, 60, 120, 180, 240, 300].map((a) => (
              <ellipse key={a}
                cx={Math.cos((a * Math.PI) / 180) * 17 * cry}
                cy={Math.sin((a * Math.PI) / 180) * 17 * cry}
                rx={11 * cry + 2} ry={11 * cry + 2} fill={P2.pinkHi} opacity={0.96} />
            ))}
            <circle r={8} fill={P2.gold} />
            {/* 尖尖的耳朵（208.9 起） */}
            <g opacity={S(t, 208.9, 209.8)}>
              <path d="M -14 -12 L -26 -24 L -10 -20 Z" fill={P2.pinkHi} />
              <path d="M 14 -12 L 26 -24 L 10 -20 Z" fill={P2.pinkHi} />
            </g>
          </g>
          {/* 啼哭声波 */}
          {[0, 0.35, 0.7].map((d, i) => {
            const rp = (cryRing - d + 1) % 1;
            return cryRing > d ? (
              <circle key={i} cx={0} cy={-10} r={rp * 130} fill="none"
                stroke={P2.pinkHi} strokeWidth={2} opacity={(1 - rp) * 0.5} />
            ) : null;
          })}
          {/* 泰坦的馈赠：金屑落下 */}
          {bless > 0 && Array.from({ length: 8 }).map((_, i) => {
            const bx = 975 + (random(`bl${i}`) - 0.5) * 220;
            const by = 200 + ((t * (26 + random(`bs${i}`) * 20) + random(`bo${i}`) * 300) % 340);
            return <circle key={i} cx={bx} cy={by} r={2.4} fill={P2.gold} opacity={0.8 * bless * Math.abs(Math.sin(t + i))} />;
          })}
        </g>
      </g>
    </g>
  );
};

// ───────────────────────── 贯穿件：日志与指标 ─────────────────────────
const MiniLog: React.FC<{ t: number }> = ({ t }) => (
  <g fontFamily={FONT_MONO} fontSize={18}>
    {LOG_ROWS.map((r, i) => {
      const q = S(t, r.at, r.at + 0.5);
      if (q <= 0) return null;
      const dim = r.warn ? "#FF9B8A" : r.gold ? P2.gold : P2.ivoryDim;
      return (
        <text key={i} x={110} y={124 + i * 32} fill={dim}
          opacity={r.gold ? q : Math.min(1, q) * (t > 200 ? 0.6 : 0.8)} letterSpacing={0.5}>
          {"> "}{r.s}
        </text>
      );
    })}
  </g>
);

const Metrics: React.FC<{ t: number }> = ({ t }) => {
  const p = S(t, PH.handshake, PH.handshake + 1); // 共情机制随第一次回应上线
  const loss = Math.max(0.002, 0.721 * Math.exp(-0.05 * Math.max(0, t - PH.handshake)));
  const ringP = S(t, 206, 211.5);
  const pct = 96.024 + (100 - 96.024) * ringP;
  const done = t >= PH.ringDone;
  const R = 62;
  const CIRC = 2 * Math.PI * R;
  return (
    <g fontFamily={FONT_MONO} opacity={p}>
      <text x={1600} y={150} fontSize={19} fill={P2.ivoryDim} letterSpacing={1}>empathy_loss</text>
      <text x={1600} y={186} fontSize={34} fill={P2.pinkHi}>{loss.toFixed(3)}</text>
      <text x={1600} y={214} fontSize={17} fill={P2.good}>↓ 收敛中 · 共情机制在线</text>
      <g transform="translate(1662 420)">
        <circle r={R} fill="none" stroke={P2.ivoryFaint} strokeWidth={7} />
        <circle r={R} fill="none" stroke={done ? P2.gold : P2.pink} strokeWidth={7} strokeLinecap="round"
          strokeDasharray={CIRC} strokeDashoffset={CIRC * (1 - ringP)} transform="rotate(-90)" />
        <text textAnchor="middle" dy={2} fontSize={24} fill={P2.ivory}>
          {done ? "100.000" : pct.toFixed(3)}
        </text>
        <text textAnchor="middle" dy={28} fontSize={15} fill={P2.ivoryDim}>格式化进程</text>
        {done && <text textAnchor="middle" dy={-78} fontSize={20} fill={P2.gold}>已完成 ✓</text>}
      </g>
    </g>
  );
};

/** 花朵字形给 Duo/Attention 用（导出避免循环依赖，不需要） */
export { FlowerGlyph };
