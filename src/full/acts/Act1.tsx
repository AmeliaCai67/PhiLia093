import React from "react";
import { AbsoluteFill, random, useCurrentFrame } from "remotion";
import { P2, FONT_MONO } from "../../v2/palette2";
import { FPS } from "../scriptFull";
import { S } from "../kit";
import { CAGE_BARS, barPath, barWidth, archPath, baseEllipse } from "../scenes/cageGeometry";

/**
 * 第一幕 · 启动（0–107.5）＝ v5 素材翻新
 * M1 摇篮 0-11.5 / M2 笼子 11.5-31.5 / 开机自检框 / M4 水晶花 39.5-53.5 /
 * M5 念书 53-77 / 学语回声 / M7 环状分析+Philia=桃子+已归档 80-107
 */
const BOOT: [number, string, boolean?][] = [
  [3.5, "Philia093.exe · 新生会话"],
  [4.6, "Directory: δ-me13:\\amphoreus\\"],
  [5.7, "Session:   #496 · 第一次"],
  [6.8, "Model:     δ-me13 · 预训练:无"],
  [7.9, "任务:      为毁灭智识而生"],
  [10.1, "心:        未找到", true],
];

const ECHO = [
  { a: 61.5, her: "她：「今天也，平安无事。」", it: "它：「今天也，平安无事。」", sub: "epoch 1 · loss 0.310" },
  { a: 66.5, her: "她：「今天也，平安无事。」", it: "它：「今天也，平安无事。」", sub: "epoch 2 · loss 0.120" },
  { a: 71.5, her: "", it: "它：「今天也，平安无事哦 ✿」", sub: "epoch 3 · 偏离 +1 字 · loss 0.030" },
];

export const Act1: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;

  return (
    <AbsoluteFill style={{ position: "absolute", top: 46, height: 718, overflow: "hidden" }}>
      <svg width="1920" height="718" viewBox="0 0 1920 718" preserveAspectRatio="none" style={{ display: "block" }}>
        <defs>
          <radialGradient id="seedGlow">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="45%" stopColor={P2.pinkHi} />
            <stop offset="100%" stopColor="rgba(242,167,184,0)" />
          </radialGradient>
          <radialGradient id="wispG">
            <stop offset="0%" stopColor={P2.pinkHi} />
            <stop offset="100%" stopColor="rgba(242,167,184,0)" />
          </radialGradient>
          <filter id="blur8"><feGaussianBlur stdDeviation="8" /></filter>
          <filter id="blur18"><feGaussianBlur stdDeviation="18" /></filter>
        </defs>
        <g transform="translate(0 130)">
        {Array.from({ length: 26 }).map((_, i) => (
          <circle key={i} cx={random(`st${i}`) * 1920} cy={40 + random(`sty${i}`) * 430}
            r={1 + random(`str${i}`) * 1.2}
            fill={P2.ivoryDim} opacity={0.25 + 0.2 * Math.abs(Math.sin(t * 0.9 + i * 1.3))} />
        ))}

        {/* M1 摇篮 0–11.5 */}
        <g opacity={1 - S(t, 11, 12.5)}>
          {Array.from({ length: 10 }).map((_, i) => {
            const x = 700 + random(`c${i}`) * 520;
            const y = 140 + ((t * (8 + random(`cv${i}`) * 8) + random(`co${i}`) * 400) % 420);
            return <circle key={i} cx={x} cy={y} r={1.6} fill={P2.pinkHi} opacity={0.4} />;
          })}
          <circle cx={960} cy={300} r={120 + 8 * Math.sin(t * 2.4)} fill="url(#seedGlow)" opacity={0.32} filter="url(#blur8)" />
          <circle cx={960} cy={300} r={7 + Math.sin(t * 2.4) * 1.8} fill="#FFFFFF" />
          <circle cx={960} cy={300} r={26 + Math.sin(t * 2.4) * 3} fill="none" stroke={P2.pinkHi} strokeWidth={1} opacity={0.25} />
        </g>

        {/* M2 笼子 11.5–31.5（step19：几何同源 cageGeometry——生长时 topScale<1，
            完全长成后与中段 CageLines 逐像素一致；两条横向粉线＝界面弧线，
            干净渐显；认知边界逐渐成形，无机械锁扣/外部手） */}
        <g opacity={S(t, 11.5, 12.5) * (1 - S(t, 31.5, 32.5))}>
          {CAGE_BARS.map((k, i) => {
            const grow = S(t, 13 + i * 0.75, 14.6 + i * 0.75);
            return (
              <path key={k} d={barPath(k, grow)}
                fill="none" stroke={P2.lilac} strokeWidth={barWidth(k)}
                strokeLinecap="round" opacity={(0.5 - Math.abs(k) * 0.04) * grow} />
            );
          })}
          <path d={archPath()} fill="none"
            stroke={P2.lilac} strokeWidth={4} strokeLinecap="round"
            opacity={0.4 * S(t, 19.5, 21)} pathLength={1} strokeDasharray={1}
            strokeDashoffset={1 - S(t, 19.5, 21)} />
          <ellipse {...baseEllipse()} fill="none"
            stroke={P2.lilac} strokeWidth={2.5} opacity={0.35 * S(t, 19.5, 20.5)} />
          {/* 界面弧线 ×2：干净渐显 */}
          <path d="M 690 300 C 830 360, 1090 360, 1232 296" fill="none"
            stroke={P2.pinkHi} strokeWidth={3.5} strokeLinecap="round"
            opacity={0.5 * S(t, 21, 22.2)} />
          <path d="M 700 388 C 840 440, 1080 440, 1222 384" fill="none"
            stroke={P2.lilac} strokeWidth={3} strokeLinecap="round"
            opacity={0.4 * S(t, 22.5, 23.7)} />
          {/* 粉紫光点 26 起显 */}
          <g opacity={S(t, 26, 27.5) * (1 - S(t, 31, 32))}>
            <circle cx={960} cy={392} r={42 + 3 * Math.sin(t * 2.2)} fill="url(#wispG)" opacity={0.7} />
            <circle cx={960} cy={392} r={5.5} fill="#FFFFFF" />
          </g>
        </g>

        {/* M4 水晶花 39.5–53.5 */}
        <g opacity={S(t, 39.5, 41) * (1 - S(t, 52.5, 53.5))}>
          {(() => {
            const F = CrystalFlowerBig;
            return <F x={960} y={290} t={t} scale={1.25} rotate={Math.sin(t * 1.2) * 4} />;
          })()}
          {Array.from({ length: 6 }).map((_, i) => {
            const px = 960 + (random(`p${i}`) - 0.5) * 500;
            const py = 200 + ((t * (16 + random(`pv${i}`) * 14) + random(`po${i}`) * 300) % 320);
            const rot = t * 20 + i * 60;
            return (
              <ellipse key={i} cx={px} cy={py} rx={7} ry={4} fill={P2.pinkHi} opacity={0.7}
                transform={`rotate(${rot} ${px} ${py})`} />
            );
          })}
        </g>

        {/* M5 念书 53–77 */}
        <g opacity={S(t, 53, 54.5) * (1 - S(t, 76, 77))}>
          <g transform="translate(960 400)">
            <path d="M -190 -40 C -110 -70, -30 -70, 0 -48 C 30 -70, 110 -70, 190 -40 L 190 36 C 110 14, 30 14, 0 32 C -30 14, -110 14, -190 36 Z"
              fill="rgba(255,255,255,0.05)" stroke={P2.ivoryDim} strokeWidth={2} />
            <line x1={0} y1={-48} x2={0} y2={32} stroke={P2.ivoryDim} strokeWidth={1.6} />
            {[-140, -84, -28, 28, 84, 140].map((dx, i) => (
              <line key={i} x1={dx - 42} y1={-22 + (i % 3) * 16} x2={dx + 42} y2={-22 + (i % 3) * 16}
                stroke={P2.ivoryFaint} strokeWidth={5} strokeLinecap="round" opacity={0.7} />
            ))}
          </g>
          {"昔涟念给你听".split("").map((ch, i) => {
            const p = ((t - 60 - i * 0.5) % 4.5 + 4.5) % 4.5 / 4.5;
            const vis = t > 60 && p < 0.9 ? 1 : 0;
            const x = 830 + i * 46 + Math.sin(t * 1.5 + i) * 10;
            const y = 360 - p * 150;
            return (
              <text key={i} x={x} y={y} fontSize={26} fill={P2.pinkHi} opacity={vis * 0.55 * (1 - p)}
                fontFamily='"Songti SC","STSong",serif'>{ch}</text>
            );
          })}
          <g opacity={S(t, 70, 71) * (1 - S(t, 75, 76)) * 0.5}>
            {[0, 1, 2, 3].map((i) => (
              <path key={i} d={`M 960 400 q ${60 + i * 26} -30 ${120 + i * 30} -8`} fill="none"
                stroke={P2.ivoryDim} strokeWidth={1.4} opacity={0.6 - i * 0.12} />
            ))}
          </g>
        </g>

        {/* M7 分析序列 80–107 */}
        <g opacity={S(t, 80, 81.5) * (1 - S(t, 106.5, 107.5))} fontFamily={FONT_MONO}>
          {Array.from({ length: 14 }).map((_, i) => {
            const x = 380 + i * 66;
            const y = 170 + ((t * (30 + random(`d${i}`) * 26) + random(`do${i}`) * 200) % 280);
            const ch = ["0", "9", "3", "1", "7", "8"][i % 6];
            return <text key={i} x={x} y={y} fontSize={22} fill={P2.ivoryFaint} opacity={0.65}>{ch}</text>;
          })}
          <g opacity={S(t, 94, 95)} textAnchor="middle">
            <text x={900} y={230} fontSize={42} fill={P2.pinkHi}>Philia = 桃子</text>
          </g>
          {["大小", "灰度", "比例", "阈值"].map((label, i) => {
            // 内层有130px偏移：环图外沿最终y≈65，与LOG首行字顶对齐；
            // 最右外沿≈1860，与左侧LOG的60px边距对称。
            const x = 1584 + (i % 2) * 220;
            const y = -10 + Math.floor(i / 2) * 190;
            const progress = (0.4 + 0.14 * i) * S(t, 84 + i * 0.4, 90);
            return (
              <g key={label} transform={`translate(${x} ${y})`}
                opacity={S(t, 84 + i * 0.4, 85 + i * 0.4)}>
                <circle r={52} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={7} />
                <circle r={52} fill="none" stroke={P2.pinkHi} strokeWidth={7}
                  pathLength={1} strokeDasharray={`${progress} 1`} strokeLinecap="round"
                  transform="rotate(-90)" opacity={0.8} />
                <text textAnchor="middle" y={8} fontSize={22} fill={P2.ivory}>
                  {Math.round(progress * 100)}%
                </text>
                <text textAnchor="middle" y={80} fontSize={19} fill={P2.ivoryDim}>{label}</text>
              </g>
            );
          })}
          <g transform="translate(1694 310)" opacity={S(t, 103, 104)}>
            <rect x={-150} y={-30} width={300} height={60} rx={10} fill="none" stroke={P2.pinkHi} strokeWidth={2} opacity={0.85} />
            <text textAnchor="middle" dy={8} fontSize={26} fill="#FFFFFF" letterSpacing={4}>已归档 ✓</text>
          </g>
        </g>

        {/* 开机自检框 3.5–31.5 */}
        {(() => {
          return (
            <g opacity={S(t, 3.2, 3.8) * (1 - S(t, 29.5, 31))} fontFamily={FONT_MONO}>
              <rect x={60} y={326} width={452} height={252} rx={12} fill="rgba(255,255,255,0.03)"
                stroke={P2.lilac} strokeWidth={1.2} opacity={0.5} />
              <g transform="translate(88 356)">
                {[[0, -14], [-9, -6], [9, -6], [-15, 2], [15, 2], [-8, 10], [8, 10], [0, 17], [-18, -12], [18, -9]].map(([cx, cy], i) => (
                  <rect key={i} x={cx - 3.4} y={cy - 3.4} width={6.8} height={6.8} rx={1}
                    fill={i % 2 === 0 ? P2.lilac : P2.lilacHi}
                    opacity={0.6 + 0.35 * Math.abs(Math.sin(t * 1.6 + i * 1.9))} />
                ))}
                <rect x={-4.5} y={-4.5} width={9} height={9} rx={1} fill="#FFFFFF" />
              </g>
              {BOOT.map(([at, s, hot], i) => {
                const a = S(t, at, at + 0.5);
                return (
                  <text key={i} x={i === 0 ? 134 : 84} y={i === 0 ? 364 : 398 + (i - 1) * 30}
                    fontSize={i === 0 ? 19 : 17}
                    fill={hot ? "#FF9B8A" : i === 0 ? P2.ivory : P2.ivoryDim}
                    opacity={a} letterSpacing={0.5}>
                    {i === 0 ? s : s.slice(0, Math.floor(s.length * a))}
                    {hot && t >= 10.6 && t < 29 && (
                      <tspan dx={8} opacity={Math.abs(Math.sin(t * 3)) * 0.9}>▌</tspan>
                    )}
                  </text>
                );
              })}

            </g>
          );
        })()}
        </g>
      </svg>

      {/* 学语回声块 61.5–77 */}
      <g opacity={1}>
        <svg width="1920" height="614" style={{ position: "absolute", top: 0, left: 0, overflow: "visible" }}
          fontFamily={FONT_MONO}>
          <g opacity={S(t, 61, 61.5) * (1 - S(t, 76.6, 77.2))}>
            <text x={1370} y={296} fontSize={16} fill={P2.ivoryDim} letterSpacing={1}>behavior_clone · 学语</text>
            {ECHO.map((e, i) => {
              const end = [66.5, 71.5, 76.6][i];
              const o = S(t, e.a, e.a + 0.4) * (1 - S(t, end - 0.35, end));
              return (
                <g key={i} opacity={o}>
                  {e.her && <text x={1370} y={332} fontSize={17} fill={P2.ivoryDim}>{e.her}</text>}
                  <text x={1370} y={368} fontSize={17} fill={P2.pinkHi}>{e.it}</text>
                  <text x={1370} y={402} fontSize={14} fill={P2.good}>{e.sub}</text>
                </g>
              );
            })}
            <text x={1370} y={438} fontSize={15} fill={P2.pinkHi} opacity={S(t, 75.3, 75.8) * 0.9}>
              第一次，它自己加了一个字
            </text>
          </g>
        </svg>
      </g>

      {/* 德谬歌小方块：主角在场轨迹（v5 原样） */}
      <svg width="1920" height="614" style={{ position: "absolute", top: 0, left: 0, overflow: "visible" }}>
        {(() => {
          const show = (t >= 38 && t < 52) || (t >= 56 && t < 76) || (t >= 90 && t < 107);
          if (!show) return null;
          const pos = kf(t, [
            [38, 660, 430], [52, 660, 430],
            [56, 620, 460], [76, 620, 460],
            [90, 560, 490], [107, 560, 490],
          ] as [number, number, number][]);
          return (
            <g transform={`translate(${pos.x} ${pos.y}) scale(0.9)`} opacity={0.92}>
              <rect x={-20} y={-20} width={40} height={40} rx={9} fill={P2.lilac} opacity={0.85} stroke={P2.lilacHi} strokeWidth={1.4} />
              <circle cx={-7} cy={-2} r={3} fill="#4A3B5C" />
              <circle cx={7} cy={-2} r={3} fill="#4A3B5C" />
              <path d="M -4 7 Q 0 11 4 7" stroke="#4A3B5C" strokeWidth={2} fill="none" strokeLinecap="round" />
            </g>
          );
        })()}
      </svg>
    </AbsoluteFill>
  );
};

function kf(t: number, keys: [number, number, number][]) {
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
}

/** 水晶花（v5 原样） */
export const CrystalFlowerBig: React.FC<{
  x: number; y: number; t: number; scale?: number; opacity?: number; rotate?: number;
}> = ({ x, y, t, scale = 1, opacity = 1, rotate = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`} opacity={opacity}>
    <circle r={52 * scale} fill="url(#wispG)" opacity={0.45} />
    {[0, 60, 120, 180, 240, 300].map((a) => {
      const rad = (a * Math.PI) / 180;
      const px = Math.cos(rad) * 22 * scale;
      const py = Math.sin(rad) * 22 * scale;
      return (
        <g key={a} transform={`translate(${px} ${py}) rotate(${a + 90})`}>
          <path d={`M 0 0 L ${-12 * scale} ${-15 * scale} L 0 ${-27 * scale} L ${12 * scale} ${-15 * scale} Z`}
            fill="rgba(255,241,249,0.40)" stroke="rgba(255,255,255,0.85)" strokeWidth={1.2 * scale} />
          <line x1={0} y1={0} x2={0} y2={-27 * scale} stroke="rgba(255,255,255,0.55)" strokeWidth={0.9 * scale} />
          <path d={`M 0 ${-6 * scale} L ${7 * scale} ${-13 * scale} L 0 ${-20 * scale} Z`}
            fill="rgba(255,255,255,0.35)" />
        </g>
      );
    })}
    <circle r={7.5 * scale} fill="rgba(255,255,255,0.92)" />
    <circle r={12 * scale} fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth={1} />
  </g>
);
