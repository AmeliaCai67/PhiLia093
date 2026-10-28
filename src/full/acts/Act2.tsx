import React from "react";
import { AbsoluteFill, random, useCurrentFrame } from "remotion";
import { P2, FONT_MONO } from "../../v2/palette2";
import { FPS } from "../scriptFull";
import { S } from "../kit";
import { CrystalFlowerBig } from "./Act1";
import { RuntimeErrorScene, ERROR_1_OF_3 } from "../scenes/RuntimeErrorScene";
import { RomanDomeScene } from "../scenes/RomanDomeScene";

/**
 * 第二幕 · 第一次告别（107.5–213）＝ v5 素材翻新
 * M9 黑屏心跳+错误剧场 / M11 宫殿 140-159 / M12 若虫与麦穗 160-183 /
 * M13 无数昔涟 190-198 / M14 字尘沉降+红字+一粒新的光 199-213
 * （v5 的片尾会话框不上——它属于全片的 1595s）
 */
export const Act2: React.FC = () => {
  const frame = useCurrentFrame();
  const t = 107.5 + frame / FPS;

  return (
    <AbsoluteFill style={{ position: "absolute", top: 46, height: 718, overflow: "hidden" }}>
      <svg width="1920" height="718" viewBox="0 0 1920 718" preserveAspectRatio="none" style={{ display: "block" }}>
        <defs>
          <radialGradient id="a2seed">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="45%" stopColor={P2.pinkHi} />
            <stop offset="100%" stopColor="rgba(242,167,184,0)" />
          </radialGradient>
          <radialGradient id="wispG">
            <stop offset="0%" stopColor={P2.pinkHi} />
            <stop offset="100%" stopColor="rgba(242,167,184,0)" />
          </radialGradient>
          <radialGradient id="a2beam" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255,235,246,0.42)" />
            <stop offset="100%" stopColor="rgba(255,235,246,0)" />
          </radialGradient>
          <filter id="a2blur8"><feGaussianBlur stdDeviation="8" /></filter>
          {["c"].map((id) => (
            <filter key={id} id={`a2crayon-${id}`} x="-10%" y="-10%" width="120%" height="120%">
              <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="2" seed={id.charCodeAt(0)} result="n" />
              <feDisplacementMap in="SourceGraphic" in2="n" scale={4} />
            </filter>
          ))}
        </defs>
        <g transform="translate(0 130)">
        {/* M9 黑屏心跳 108–113.5 + 错误剧场 117–132 */}
        <g opacity={S(t, 108, 108.5) * (1 - S(t, 113, 113.5))}>
          <circle cx={960} cy={310} r={5 + Math.sin(t * 2.2) * 1.6} fill={P2.pinkHi} opacity={0.85} />
        </g>
        <g opacity={S(t, 117, 118) * (1 - S(t, 131.5, 132.5))}>
          <path d="M 300 0 L 620 240 L 520 614" stroke="#FF9B8A" strokeWidth={2} fill="none"
            opacity={0.22 + 0.1 * Math.sin(t * 9)} />
          <path d="M 1660 0 L 1330 260 L 1450 614" stroke="#FF9B8A" strokeWidth={2} fill="none"
            opacity={0.18 + 0.08 * Math.sin(t * 7 + 1)} />
        </g>

        {/* M11 宫殿 140–159：古罗马穹顶大空间（任务书 step04；组内局部坐标） */}
        <g opacity={S(t, 139.5, 141) * (1 - S(t, 159, 160))}>
          <RomanDomeScene t={t} />
        </g>

        {/* M12 若虫与麦穗 160–183 */}
        <g opacity={S(t, 160.5, 162) * (1 - S(t, 183.5, 184.5))}>
          <rect x={820} y={-40} width={90} height={420} fill="url(#a2beam)" opacity={0.55}
            transform="rotate(18 865 0)" />
          <g filter="url(#a2crayon-c)">
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
          <circle cx={1076} cy={380} r={34} fill={P2.pinkHi} opacity={0.12 + 0.08 * Math.sin(t * 1.8)} />
          {Array.from({ length: 16 }).map((_, i) => (
            <circle key={i} cx={760 + random(`s${i}`) * 640}
              cy={120 + ((t * (18 + random(`v${i}`) * 20) + random(`o${i}`) * 400) % 460)}
              r={2.2} fill="#FFFFFF" opacity={0.55 * Math.abs(Math.sin(t + i * 1.7))} />
          ))}
          <text x={1076} y={510} textAnchor="middle" fontFamily={FONT_MONO} fontSize={16} fill={P2.ivoryFaint}
            opacity={0.7}>— 若虫与麦穗 · p.01 —</text>
        </g>

        {/* M13 无数昔涟 190–198 */}
        <g opacity={S(t, 190.5, 192) * (1 - S(t, 197.5, 198.5))}>
          {[-420, -280, -140, 0, 140, 280, 420].map((dx, i) => {
            const q = S(t, 191 + i * 0.55, 192 + i * 0.55);
            return (
              <g key={i} opacity={q}>
                <CrystalFlowerBig x={960 + dx} y={320} t={t} scale={0.6 + 0.1 * Math.sin(t * 1.6 + i)}
                  opacity={0.85} rotate={i * 13} />
                <ellipse cx={960 + dx} cy={386} rx={16} ry={5} fill={P2.pinkHi} opacity={0.22 * q} />
              </g>
            );
          })}
        </g>

        {/* M14 收束 199–213：字尘沉降 → 红字压暗 → 一粒新的光（轮回，接第三幕） */}
        <g opacity={S(t, 199, 200.5)}>
          {Array.from({ length: 20 }).map((_, i) => {
            const x = random(`f${i}`) * 1920;
            const y = (t * (10 + random(`fs${i}`) * 12) + random(`fo${i}`) * 660) % 660;
            return <circle key={i} cx={x} cy={y} r={1.8} fill={P2.ivoryDim} opacity={0.5} />;
          })}
        </g>
        </g>
        <rect width="1920" height="718" fill="#0B0812" opacity={S(t, 209.5, 211) * 0.78} />
        <g opacity={S(t, 211.5, 212.5)}>
          <circle cx={960} cy={306} r={60 + 5 * Math.sin(t * 2.4)} fill="url(#a2seed)" opacity={0.3} filter="url(#a2blur8)" />
          <circle cx={960} cy={306} r={5} fill="#FFFFFF" />
        </g>

        {/* 德谬歌小方块：宫殿、若虫、190–198.5多位昔涟的回忆均有旁听者。 */}
        {(() => {
          const listeningPast = t >= 190 && t < 198.5;
          const show = (t >= 140 && t < 159) || (t >= 160 && t < 184) || listeningPast;
          if (!show) return null;
          const x = listeningPast ? 380 : t < 159 ? 620 : 660;
          const y = listeningPast ? 450 : t < 159 ? 440 : 430;
          return (
            <g transform={`translate(${x} ${y}) scale(0.9)`}
              opacity={0.92 * (listeningPast ? S(t, 190.5, 192) * (1 - S(t, 197.5, 198.5)) : 1)}>
              <rect x={-20} y={-20} width={40} height={40} rx={9} fill={P2.lilac} opacity={0.85} stroke={P2.lilacHi} strokeWidth={1.4} />
              <circle cx={-7} cy={-2} r={3} fill="#4A3B5C" />
              <circle cx={7} cy={-2} r={3} fill="#4A3B5C" />
              <path d="M -4 7 Q 0 11 4 7" stroke="#4A3B5C" strokeWidth={2} fill="none" strokeLinecap="round" />
            </g>
          );
        })()}
      </svg>

      {/* 错误剧场 116–132：可读终端诊断面板（仅第一次异常接入，见任务书 step01） */}
      <RuntimeErrorScene {...ERROR_1_OF_3} t={t} compact />
    </AbsoluteFill>
  );
};
