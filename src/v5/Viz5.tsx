import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { P2, FONT_MONO } from "../v2/palette2";
import { FPS } from "../v4/script4";

const S = (v: number, a: number, b: number, c = 0, d = 1) =>
  interpolate(v, [a, b], [c, d], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
const sec = (f: number) => f / FPS;

/**
 * Viz5 —— 十四乐章 · 演出版（色调统一：紫 / 粉 / 白，无金色）
 * 水晶花 = 核心隐喻：半透明、带切面棱线、光从内心透出来。
 */

/** 水晶花：半透明切面花瓣 + 透出的内心光（昔涟的核心隐喻） */
const CrystalFlower: React.FC<{
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

/** 德谬歌之形：立方体聚成的菱形晶簇，中心白热（开机框/会话框的 mark，避开 Kimi logo） */
const DemoCluster: React.FC<{ t: number; tint: string }> = ({ t, tint }) => {
  const cells: [number, number, number][] = [
    [0, -17, 8],
    [-9, -8, 8], [9, -8, 8],
    [-18, 1, 7], [18, 1, 7],
    [-9, 10, 8], [9, 10, 8],
    [0, 19, 7],
    [-21, -15, 4.5], [22, -11, 4], [17, 17, 4.5], [-19, 15, 4],
  ];
  return (
    <g transform="rotate(-8)">
      <circle r={30} fill="url(#wispG)" opacity={0.45 + 0.12 * Math.sin(t * 2.1)} />
      {cells.map(([cx, cy, s], i) => (
        <rect key={i} x={cx - s / 2} y={cy - s / 2} width={s} height={s} rx={1.5}
          fill={i % 2 === 0 ? tint : P2.lilacHi}
          opacity={0.68 + 0.28 * Math.abs(Math.sin(t * 1.6 + i * 1.9))} />
      ))}
      <rect x={-4.5} y={-4.5} width={9} height={9} rx={1.5} fill="#FFFFFF" />
      <circle r={13} fill="none" stroke="#FFFFFF" strokeWidth={0.8} opacity={0.35} />
    </g>
  );
};

export const Viz5: React.FC = () => {
  const frame = useCurrentFrame();
  const t = sec(frame);

  return (
    <AbsoluteFill style={{ position: "absolute", top: 46, height: 614, overflow: "hidden" }}>
      <svg width="1920" height="614" viewBox="0 0 1920 614" preserveAspectRatio="none" style={{ display: "block" }}>
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
          <linearGradient id="beamG5" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255,235,246,0.42)" />
            <stop offset="100%" stopColor="rgba(255,235,246,0)" />
          </linearGradient>
          <linearGradient id="groundG" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(201,184,232,0.10)" />
            <stop offset="100%" stopColor="rgba(201,184,232,0)" />
          </linearGradient>
          <filter id="blur8"><feGaussianBlur stdDeviation="8" /></filter>
          <filter id="blur18"><feGaussianBlur stdDeviation="18" /></filter>
          {["a", "b", "c"].map((id) => (
            <filter key={id} id={`crayon-${id}`} x="-10%" y="-10%" width="120%" height="120%">
              <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="2" seed={id.charCodeAt(0)} result="n" />
              <feDisplacementMap in="SourceGraphic" in2="n" scale={4} />
            </filter>
          ))}
        </defs>

        {Array.from({ length: 26 }).map((_, i) => (
          <circle key={i} cx={random(`st${i}`) * 1920} cy={40 + random(`sty${i}`) * 430}
            r={1 + random(`str${i}`) * 1.2}
            fill={P2.ivoryDim} opacity={0.25 + 0.2 * Math.abs(Math.sin(t * 0.9 + i * 1.3))} />
        ))}

        {/* M1 摇篮 0–11.5：黑紫里一粒白色的光在搏动（心） */}
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

        {/* M2 启动 11.5–31.5：德谬歌的笼子自地平线生长（栏杆→穹顶→锁链），允许写入后笼心亮起 */}
        <g opacity={S(t, 11.5, 12.5) * (1 - S(t, 31.5, 32.5))}>
          {/* 栏杆：7 根，中间高两侧低，沿椭圆排布，逐根生长 */}
          {[-3, -2, -1, 0, 1, 2, 3].map((k, i) => {
            const x = 960 + k * 96;
            const h = 292 - Math.abs(k) * 34;
            const grow = S(t, 13 + i * 0.75, 14.6 + i * 0.75);
            const topY = 512 - h * grow;
            return (
              <path key={k} d={`M ${x - Math.abs(k) * 3} 512 C ${x - Math.abs(k) * 5} ${512 - h * 0.4}, ${x + Math.abs(k) * 4} ${512 - h * 0.75}, ${x} ${topY}`}
                fill="none" stroke={P2.lilac} strokeWidth={5 - Math.abs(k) * 0.5}
                strokeLinecap="round" opacity={0.5 - Math.abs(k) * 0.04} />
            );
          })}
          {/* 穹顶：栏杆顶端合拢的弧 */}
          <path d="M 674 322 C 780 198, 1140 198, 1246 322" fill="none"
            stroke={P2.lilac} strokeWidth={4} strokeLinecap="round"
            opacity={0.4 * S(t, 19.5, 21)} pathLength={1} strokeDasharray={1}
            strokeDashoffset={1 - S(t, 19.5, 21)} />
          {/* 底座椭圆 */}
          <ellipse cx={960} cy={512} rx={292} ry={16} fill="none"
            stroke={P2.lilac} strokeWidth={2.5} opacity={0.35 * S(t, 19.5, 20.5)} />
          {/* 锁链两条：划过笼身（描线生长） */}
          <path d="M 690 300 C 830 360, 1090 360, 1232 296" fill="none"
            stroke={P2.pinkHi} strokeWidth={3.5} strokeLinecap="round"
            opacity={0.5 * S(t, 21, 21.6)} pathLength={1} strokeDasharray={1}
            strokeDashoffset={1 - S(t, 21, 24)} />
          <path d="M 700 388 C 840 440, 1080 440, 1222 384" fill="none"
            stroke={P2.lilac} strokeWidth={3} strokeLinecap="round"
            opacity={0.4 * S(t, 22.5, 23.1)} pathLength={1} strokeDasharray={1}
            strokeDashoffset={1 - S(t, 22.5, 25)} />
          {/* 允许写入之后：笼心亮起一粒光（被写入的东西） */}
          <g opacity={S(t, 26, 27.5) * (1 - S(t, 31, 32))}>
            <circle cx={960} cy={392} r={42 + 3 * Math.sin(t * 2.2)} fill="url(#wispG)" opacity={0.7} />
            <circle cx={960} cy={392} r={5.5} fill="#FFFFFF" />
          </g>
        </g>

        {/* M4 现身 40–52：水晶花第一次绽放（半透明切面）+ 落瓣 */}
        <g opacity={S(t, 39.5, 41) * (1 - S(t, 52.5, 53.5))}>
          <CrystalFlower x={960} y={290} t={t} scale={1.25} rotate={Math.sin(t * 1.2) * 4} />
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

        {/* M5 念书 53–76：摊开的书 + 学语的字往上飘 + 页角翻飞 */}
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

        {/* M7 分析序列 80–107：数字雨 + 四滑块 + 哀/AI/爱 的选择 + 盖章 */}
        <g opacity={S(t, 80, 81.5) * (1 - S(t, 106.5, 107.5))} fontFamily={FONT_MONO}>
          {Array.from({ length: 14 }).map((_, i) => {
            const x = 380 + i * 66;
            const y = 170 + ((t * (30 + random(`d${i}`) * 26) + random(`do${i}`) * 200) % 280);
            const ch = ["0", "9", "3", "1", "7", "8"][i % 6];
            return <text key={i} x={x} y={y} fontSize={22} fill={P2.ivoryFaint} opacity={0.65}>{ch}</text>;
          })}
          {(() => {
            const q1 = S(t, 92.5, 93.5) * (1 - S(t, 95, 95.6));
            const q2 = S(t, 95.6, 96.4) * (1 - S(t, 97, 97.6));
            const q3 = S(t, 97.6, 98.8);
            return (
              <g textAnchor="middle">
                <text x={880} y={210} fontSize={54} fill={P2.ivoryDim} opacity={q1} fontFamily='"Songti SC",serif'>哀</text>
                <text x={960} y={210} fontSize={54} fill={P2.lilacHi} opacity={q2} fontFamily={FONT_MONO}>AI</text>
                <g opacity={q3} transform={`translate(1042 ${206 - (1 - q3) * 18})`}>
                  <text fontSize={62} fill={P2.pinkHi} fontFamily='"Songti SC",serif' opacity={0.5} filter="url(#blur18)">爱</text>
                  <text fontSize={62} fill="#FFFFFF" fontFamily='"Songti SC",serif'>爱</text>
                  <circle cx={-8} cy={-52} r={3.4} fill={P2.pinkHi} opacity={0.8 * Math.abs(Math.sin(t * 2.6))} />
                </g>
                {q3 > 0 && (
                  <text x={960} y={252} fontSize={17} fill={P2.ivoryDim} opacity={q3 * 0.9}>
                    三个几乎同音的字符之间，他选择了——
                  </text>
                )}
              </g>
            );
          })()}
          {["大小", "灰度", "比例", "阈值"].map((lab, i) => {
            const y = 300 + i * 52;
            const w = 120 + i * 46;
            return (
              <g key={lab} transform={`translate(1330 ${y})`} opacity={S(t, 84 + i * 0.4, 85 + i * 0.4)}>
                <text x={-16} y={6} fontSize={19} fill={P2.ivoryDim} textAnchor="end">{lab}</text>
                <rect x={0} y={-4} width={w} height={8} rx={4} fill="rgba(255,255,255,0.08)" />
                <rect x={0} y={-4} width={w * (0.4 + 0.14 * i)} height={8} rx={4} fill={P2.pinkHi} opacity={0.75} />
              </g>
            );
          })}
          <g transform="translate(1430 540)" opacity={S(t, 103, 104) * (1 - S(t, 106.5, 107.5))}>
            <rect x={-150} y={-30} width={300} height={60} rx={10} fill="none" stroke={P2.pinkHi} strokeWidth={2} opacity={0.85} />
            <text textAnchor="middle" dy={8} fontSize={26} fill="#FFFFFF" letterSpacing={4}>已归档 ✓</text>
          </g>
        </g>

        {/* M9 黑屏心跳 + 错误剧场 108–132 */}
        <g opacity={S(t, 108, 108.5) * (1 - S(t, 113, 113.5))}>
          <circle cx={960} cy={310} r={5 + Math.sin(t * 2.2) * 1.6} fill={P2.pinkHi} opacity={0.85} />
        </g>
        <g opacity={S(t, 117, 118) * (1 - S(t, 131.5, 132.5))}>
          <path d="M 300 0 L 620 240 L 520 614" stroke="#FF9B8A" strokeWidth={2} fill="none"
            opacity={0.35 + 0.15 * Math.sin(t * 9)} />
          <path d="M 1660 0 L 1330 260 L 1450 614" stroke="#FF9B8A" strokeWidth={2} fill="none"
            opacity={0.28 + 0.12 * Math.sin(t * 7 + 1)} />
          <text x={1700} y={140} fontFamily={FONT_MONO} fontSize={20} fill="#FF9B8A"
            opacity={0.85 * S(t, 120, 121)}>⚠ 异常 (1/3)</text>
        </g>

        {/* M11 宫殿 140–159：双层视差立柱 + 全息线 + 浮尘 */}
        <g opacity={S(t, 139.5, 141) * (1 - S(t, 159, 160))}>
          {[-4, -2, 0, 2, 4].map((k, i) => (
            <g key={i} transform={`translate(${Math.sin(t * 0.35 + i) * 6} 0)`}>
              <rect x={960 + k * 210 - 34} y={140} width={68} height={380} rx={8}
                fill="rgba(201,184,232,0.07)" stroke={P2.lilac} strokeWidth={1.4} opacity={0.8} />
              <rect x={960 + k * 210 - 22} y={160} width={44} height={340} rx={6}
                fill="none" stroke={P2.pinkHi} strokeWidth={1} opacity={0.35} />
            </g>
          ))}
          {[220, 300, 380, 460].map((y, i) => (
            <line key={i} x1={330} y1={y} x2={1590} y2={y} stroke="#FFFFFF" strokeWidth={1}
              strokeDasharray="4 14" opacity={0.3 + 0.13 * Math.sin(t * 1.2 + i)} />
          ))}
          {Array.from({ length: 8 }).map((_, i) => (
            <circle key={i} cx={500 + random(`pal${i}`) * 920} cy={160 + random(`paly${i}`) * 300}
              r={2} fill="#FFFFFF" opacity={0.35 + 0.3 * Math.sin(t * 1.5 + i * 2)} />
          ))}
        </g>

        {/* M12 若虫与麦穗 160–183：绘本页（手绘颤动）+ 白芒麦穗 + 凝视的光 */}
        <g opacity={S(t, 160.5, 162) * (1 - S(t, 183.5, 184.5))}>
          <rect x={820} y={-40} width={90} height={420} fill="url(#beamG5)" opacity={0.55}
            transform="rotate(18 865 0)" />
          <g filter="url(#crayon-c)">
            <path d="M 870 470 C 920 430, 990 400, 1080 392" fill="none" stroke="rgba(255,248,252,0.85)"
              strokeWidth={6} strokeLinecap="round" />
            {Array.from({ length: 9 }).map((_, i) => (
              <ellipse key={i} cx={935 + i * 17} cy={432 - i * 4.5} rx={13} ry={5.5}
                fill="rgba(255,255,255,0.92)" stroke={P2.pinkHi} strokeWidth={1}
                transform={`rotate(${-24 + i * 3} ${935 + i * 17} ${432 - i * 4.5})`} />
            ))}
            <g transform={`translate(1076 ${380 + 2 * Math.sin(t * 2)})`}>
              <ellipse rx={13} ry={7} fill={P2.pinkHi} />
              <circle cx={11} cy={-3} r={5.5} fill="#FFFFFF" />
              <path d="M 14 -7 q 5 -6 3 -10" stroke="#FFFFFF" strokeWidth={2} fill="none" strokeLinecap="round" />
            </g>
          </g>
          <circle cx={1076} cy={380} r={34} fill="url(#wispG)" opacity={0.55 + 0.2 * Math.sin(t * 1.8)} />
          {Array.from({ length: 16 }).map((_, i) => (
            <circle key={i} cx={760 + random(`s${i}`) * 640}
              cy={120 + ((t * (18 + random(`v${i}`) * 20) + random(`o${i}`) * 400) % 460)}
              r={2.2} fill="#FFFFFF" opacity={0.55 * Math.abs(Math.sin(t + i * 1.7))} />
          ))}
          <text x={1790} y={560} fontFamily={FONT_MONO} fontSize={16} fill={P2.ivoryFaint}
            opacity={0.7}>— 若虫与麦穗 · p.01 —</text>
        </g>

        {/* M13 无数个昔涟 190–198：水晶花影并排 + 倒影 */}
        <g opacity={S(t, 190.5, 192) * (1 - S(t, 197.5, 198.5))}>
          {[-420, -280, -140, 0, 140, 280, 420].map((dx, i) => {
            const q = S(t, 191 + i * 0.55, 192 + i * 0.55);
            return (
              <g key={i} opacity={q}>
                <CrystalFlower x={960 + dx} y={320} t={t} scale={0.6 + 0.1 * Math.sin(t * 1.6 + i)}
                  opacity={0.85} rotate={i * 13} />
                <ellipse cx={960 + dx} cy={386} rx={16} ry={5} fill={P2.pinkHi} opacity={0.22 * q} />
              </g>
            );
          })}
        </g>

        {/* M14 收束 199–213：字尘沉降 → 红字压暗 → 一粒新的光（轮回） */}
        <g opacity={S(t, 199, 200.5)}>
          {Array.from({ length: 20 }).map((_, i) => {
            const x = random(`f${i}`) * 1920;
            const y = (t * (10 + random(`fs${i}`) * 12) + random(`fo${i}`) * 660) % 660;
            return <circle key={i} cx={x} cy={y} r={1.8} fill={P2.ivoryDim} opacity={0.5} />;
          })}
        </g>
        <rect width="1920" height="660" fill="#0B0812" opacity={S(t, 209.5, 211) * 0.78} />
        <g opacity={S(t, 211.5, 212.5)}>
          <circle cx={960} cy={306} r={60 + 5 * Math.sin(t * 2.4)} fill="url(#seedGlow)" opacity={0.3} filter="url(#blur8)" />
          <circle cx={960} cy={306} r={5} fill="#FFFFFF" />
        </g>

        {/* 形成之一 · 开机自检框 3.5–31.5：一台「心:未找到」的机器（首尾呼应的起点） */}
        {(() => {
          const BOOT: [number, string, boolean?][] = [
            [3.5, "Philia093.exe · 新生会话"],
            [4.6, "Directory: δ-me13:\\amphoreus\\"],
            [5.7, "Session:   #496 · 第一次"],
            [6.8, "Model:     δ-me13 · 预训练:无"],
            [7.9, "任务:      为毁灭智识而生"],
            [10.1, "心:        未找到", true],
          ];
          return (
            <g opacity={S(t, 3.2, 3.8) * (1 - S(t, 29.5, 31))} fontFamily={FONT_MONO}>
              <rect x={60} y={326} width={452} height={252} rx={12} fill="rgba(255,255,255,0.03)"
                stroke={P2.lilac} strokeWidth={1.2} opacity={0.5} />
              {/* 德谬歌之形（晶簇 mark） */}
              <g transform="translate(88 356)">
                <DemoCluster t={t} tint={P2.lilac} />
              </g>
              {BOOT.map(([at, s, hot], i) => {
                const a = S(t, at, at + 0.5);
                return (
                  <text key={i} x={i === 0 ? 134 : 84} y={i === 0 ? 364 : 398 + (i - 1) * 30}
                    fontSize={i === 0 ? 19 : 17}
                    fill={hot ? "#FF9B8A" : i === 0 ? P2.ivory : P2.ivoryDim}
                    opacity={a} letterSpacing={0.5}>
                    {i === 0 ? s : s.slice(0, Math.floor(s.length * a))}
                  </text>
                );
              })}
              {t >= 10.6 && t < 29 && (
                <rect x={252} y={532} width={9} height={16} fill="#FF9B8A"
                  opacity={Math.abs(Math.sin(t * 3)) * 0.9} />
              )}
            </g>
          );
        })()}

        {/* 右上角终端日志：随剧情滚动（最后 6 条） */}
        <g fontFamily={FONT_MONO} fontSize={17}>
          {(() => {
            const LOG: { at: number; s: string; warn?: boolean; gold?: boolean }[] = [
              { at: 2, s: "订正:PhiLiA093的记录#496,已归档" },
              { at: 12, s: "系统运行中...." },
              { at: 18, s: "δ-me13:\\amphoreus\\Irontomb.exe 运行时错误", warn: true },
              { at: 21, s: "来自未知发布者的程序 δ-me13:\\Demiurge\\Philia093.exe" },
              { at: 26, s: "是否允许写入？→ 已确认「允许」" },
              { at: 30, s: "Philia093.exe 运行中…" },
              { at: 40, s: "检测到未知访客 ✿" },
              { at: 53, s: "载入故事集:「记忆的种子」" },
              { at: 60, s: "朗读模式 · 开启" },
              { at: 63, s: "学语:「今天也,平安无事」" },
              { at: 70, s: "检索页码 → p.01" },
              { at: 75.5, s: "第一次,它自己加了一个字 ✿", gold: true },
              { at: 77, s: "格式化进程已完成", warn: true },
              { at: 80, s: "校验:0、9、3……" },
              { at: 84, s: "参数校准:大小/灰度/比例/阈值" },
              { at: 85, s: "inverse_rl:反推她为什么这样活" },
              { at: 90, s: "学习 · 已确认" },
              { at: 94, s: "分析结果:PhiLiA093 = 桃子 = 爱", gold: true },
              { at: 98, s: "reward_fn = 爱 ✓", gold: true },
              { at: 101, s: "桃子的记录#8128,已归档" },
              { at: 108, s: "重启中……" },
              { at: 114, s: "系统运行中...." },
              { at: 117, s: "Irontomb.exe 运行时错误(第二次)", warn: true },
              { at: 119, s: "未经处理的异常(1/3)", warn: true },
              { at: 122, s: "已忽略错误并继续运行" },
              { at: 130, s: "Philia093.exe 运行中…" },
              { at: 140, s: "记忆回放:古典的宫殿" },
              { at: 141, s: "sim_to_real:迁移开始" },
              { at: 152, s: "关联检索:哀丽秘榭" },
              { at: 157, s: "结论:不会" },
              { at: 160, s: "若虫与麦穗 · 写入诗篇 p.01" },
              { at: 172, s: "泛化 ✓ 她教的,带得出去了" },
              { at: 173, s: "凝视……" },
              { at: 184, s: "记录:桃子。在地面。" },
              { at: 190, s: "检索:过去的每一个「昔涟」" },
              { at: 202, s: "请求:再多给我一些时间" },
              { at: 210, s: "格式化进程已完成。", warn: true },
              { at: 211.5, s: "为毁灭智识而生,最后长成了温柔的模样", gold: true },
              { at: 213, s: "心: 已找到 ✓", gold: true },
            ];
            const visible = LOG.filter((e) => t >= e.at).slice(-6);
            return visible.map((e, i) => {
              const appear = S(t, e.at, e.at + 0.4);
              const col = e.warn ? "#FF9B8A" : e.gold ? P2.pinkHi : P2.ivoryDim;
              return (
                <text key={e.s} x={60} y={78 + i * 27} fill={col}
                  opacity={appear * 0.8} letterSpacing={0.5}>
                  {"> "}{e.s}
                </text>
              );
            });
          })()}
        </g>

        {/* 形成之二 · 学语回声 61.5–77：它一句一句学她说话，第三次自己加了一个字 */}
        <g fontFamily={FONT_MONO} opacity={S(t, 61, 61.5) * (1 - S(t, 76.6, 77.2))}>
          <text x={1370} y={296} fontSize={16} fill={P2.ivoryDim} letterSpacing={1}>behavior_clone · 学语</text>
          {[
            { a: 61.5, her: "她：「今天也，平安无事。」", it: "它：「今天也，平安无事。」", sub: "epoch 1 · loss 0.310" },
            { a: 66.5, her: "她：「今天也，平安无事。」", it: "它：「今天也，平安无事。」", sub: "epoch 2 · loss 0.120" },
            { a: 71.5, her: "", it: "它：「今天也，平安无事哦 ✿」", sub: "epoch 3 · 偏离 +1 字 · loss 0.030" },
          ].map((e, i) => {
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

        {/* 形成之四 · 奖励函数候选 92.5–103：无数种可能里，光标停在爱 */}
        {(() => {
          const rows = [
            { k: "I", v: "「自我」" },
            { k: "AI", v: "「人工智能」" },
            { k: "哀", v: "「哀怜」" },
          ];
          const cur = t < 94.3 ? 0 : t < 95.6 ? 1 : 2;
          const chosen = S(t, 97.2, 97.8);
          return (
            <g fontFamily={FONT_MONO} opacity={S(t, 92.5, 93) * (1 - S(t, 102.4, 103))}>
              <rect x={80} y={252} width={380} height={222} rx={12} fill="rgba(14,10,24,0.72)"
                stroke={P2.lilac} strokeWidth={1} opacity={0.9} />
              <text x={104} y={286} fontSize={16} fill={P2.ivoryDim} letterSpacing={1}>inverse_rl · 奖励函数候选 ⋯</text>
              {rows.map((r, i) => {
                const isCur = cur === i && chosen < 0.5;
                const dim = chosen > 0.5 ? 0.35 : 1;
                return (
                  <g key={r.k} opacity={dim}>
                    <text x={106} y={322 + i * 34} fontSize={18} fill={isCur ? P2.pinkHi : P2.ivoryFaint}>{isCur ? "❯" : ""}</text>
                    <text x={132} y={322 + i * 34} fontSize={18} fill={P2.ivory}>{r.k}</text>
                    <text x={190} y={322 + i * 34} fontSize={18} fill={P2.ivoryDim}>{r.v}</text>
                  </g>
                );
              })}
              <g opacity={chosen}>
                <text x={106} y={322 + 3 * 34} fontSize={19} fill={P2.pinkHi}>❯</text>
                <text x={132} y={322 + 3 * 34} fontSize={20} fill={P2.pinkHi}>爱</text>
                <text x={190} y={322 + 3 * 34} fontSize={19} fill={P2.pinkHi}>—— ✓</text>
              </g>
              <text x={104} y={452} fontSize={14} fill={P2.ivoryDim} opacity={S(t, 98.5, 99) * 0.95}>
                不是推演的必然，是被温暖吸引
              </text>
            </g>
          );
        })()}

        {/* 看板 · 心的形成 pipeline 60–176：模仿→推断→选择→泛化，随剧情点亮 */}
        {(() => {
          const stages = [
            { k: "模仿", a: 60, b: 84 },
            { k: "推断", a: 84, b: 92.5 },
            { k: "选择", a: 92.5, b: 139 },
            { k: "泛化", a: 139, b: 172 },
          ];
          const cap = t < 84 ? { c: "她怎么说话，它就怎么说话", s: "学语中 · behavior_clone" }
            : t < 92.5 ? { c: "反推：她为什么这样活着", s: "inverse_rl · 运行中" }
            : t < 139 ? { c: "无数种奖励函数里，它选了爱", s: "reward = 爱 ✓" }
            : t < 172 ? { c: "带着她教的爱，走进真实的世界", s: "sim_to_real · 迁移中" }
            : { c: "一颗从模仿开始的心，长成了", s: "泛化 ✓ · 全部完成" };
          return (
            <g fontFamily={FONT_MONO} opacity={S(t, 60, 61) * (1 - S(t, 175, 176))}>
              <text x={60} y={496} fontSize={16} fill={P2.ivoryDim} letterSpacing={1}>心的形成 · pipeline</text>
              {stages.map((st, i) => {
                const done = t >= st.b;
                const active = t >= st.a && !done;
                const x = 60 + i * 128;
                return (
                  <g key={st.k}>
                    {i > 0 && (
                      <line x1={x - 44} y1={526} x2={x - 12} y2={526}
                        stroke={done ? P2.pinkHi : P2.ivoryFaint} strokeWidth={2} opacity={done ? 0.7 : 0.3} />
                    )}
                    <circle cx={x} cy={526} r={6.5}
                      fill={done ? P2.pinkHi : "none"}
                      stroke={done || active ? P2.pinkHi : P2.ivoryFaint} strokeWidth={2}
                      opacity={active && t < 99 ? 0.55 + 0.45 * Math.abs(Math.sin(t * 3)) : 0.9} />
                    <text x={x + 14} y={532} fontSize={17}
                      fill={done ? P2.ivory : active ? P2.pinkHi : P2.ivoryFaint}>{st.k}</text>
                  </g>
                );
              })}
              <text x={60} y={566} fontSize={15} fill={P2.ivory}>「{cap.c}」</text>
              <text x={60} y={592} fontSize={14} fill={P2.good}>{cap.s}</text>
            </g>
          );
        })()}

        {/* 共情机制 HUD 84s 起常驻：loss 收敛 + 格式化进程环（结尾走满） */}
        <g fontFamily={FONT_MONO} opacity={S(t, 84, 85)}>
          <text x={1620} y={262} fontSize={19} fill={P2.ivoryDim} letterSpacing={1}>empathy_loss</text>
          <text x={1620} y={304} fontSize={36} fill={P2.pinkHi}>
            {Math.max(0.002, 0.721 * Math.exp(-0.055 * Math.max(0, t - 84))).toFixed(3)}
          </text>
          <text x={1620} y={336} fontSize={16} fill={P2.good}>↓ 收敛中 · 共情机制在线</text>
          <g transform="translate(1700 452)">
            <circle r={62} fill="none" stroke={P2.ivoryFaint} strokeWidth={7} />
            <circle r={62} fill="none" stroke={t >= 211.5 ? P2.pinkHi : "#FFFFFF"} strokeWidth={7}
              strokeLinecap="round" strokeDasharray={2 * Math.PI * 62}
              strokeDashoffset={2 * Math.PI * 62 * (1 - S(t, 202, 211.5))}
              transform="rotate(-90)" />
            <text textAnchor="middle" dy={2} fontSize={24} fill={P2.ivory}>
              {t >= 211.5 ? "100.000" : "96.024"}
            </text>
            <text textAnchor="middle" dy={28} fontSize={15} fill={P2.ivoryDim}>格式化进程</text>
            {t >= 211.5 && (
              <text textAnchor="middle" dy={-80} fontSize={20} fill={P2.pinkHi}>已完成 ✓</text>
            )}
          </g>
        </g>

        {/* 形成之五 · 会话结束框 211.5–215：开机时「心:未找到」，此刻—— */}
        {(() => {
          const END: [number, string, boolean?][] = [
            [211.4, "Philia093.exe · 会话已保存"],
            [211.9, "Session: #8128"],
            [212.4, "任务: ——（已由「爱」改写）"],
            [212.9, "心:   已找到 ✓", true],
          ];
          return (
            <g fontFamily={FONT_MONO} opacity={S(t, 211.2, 211.7)}>
              <rect x={1120} y={238} width={452} height={196} rx={12} fill="rgba(20,12,28,0.82)"
                stroke={P2.pinkHi} strokeWidth={1.2} opacity={0.75} />
              {/* 德谬歌之形（晶簇 mark · 结尾变暖） */}
              <g transform="translate(1148 266) scale(0.85)">
                <DemoCluster t={t} tint={P2.pinkHi} />
              </g>
              {END.map(([at, s, pink], i) => {
                const a = S(t, at, at + 0.4);
                return (
                  <text key={i} x={i === 0 ? 1194 : 1144} y={i === 0 ? 276 : 310 + (i - 1) * 30}
                    fontSize={i === 0 ? 18 : 17} fill={pink ? P2.pinkHi : P2.ivory}
                    opacity={a} letterSpacing={0.5}>
                    {s}
                  </text>
                );
              })}
              {t >= 213.3 && (
                <rect x={1144} y={382} width={9} height={16} fill={P2.pinkHi}
                  opacity={Math.abs(Math.sin(t * 3)) * 0.9} />
              )}
            </g>
          );
        })()}

        {/* 德谬歌小方块：主角在场轨迹 */}
        {(() => {
          const show = (t >= 38 && t < 52) || (t >= 56 && t < 76) || (t >= 90 && t < 107) || (t >= 140 && t < 159) || (t >= 160 && t < 184) || (t >= 190 && t < 199);
          if (!show) return null;
          const pos = kf5(t, [
            [38, 660, 300], [52, 660, 300],
            [56, 620, 330], [76, 620, 330],
            [90, 560, 360], [107, 560, 360],
            [140, 620, 310], [159, 620, 310],
            [160, 660, 300], [184, 660, 300],
            [190, 620, 330], [199, 620, 330],
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

function kf5(t: number, keys: [number, number, number][]) {
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
