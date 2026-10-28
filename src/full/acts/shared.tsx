import React from "react";
import { random } from "remotion";
import { P2, FONT_MONO } from "../../v2/palette2";
import { S } from "../kit";
import { archPath, barPath, barWidth, barBaseOpacity, baseEllipse, baseFrontArc } from "../scenes/cageGeometry";

/** 星尘（暗底幕用） */
export const Stars: React.FC<{ t: number; n?: number; fadeOutAt?: [number, number] }> = ({ t, n = 22, fadeOutAt }) => {
  const gate = fadeOutAt ? 1 - S(t, fadeOutAt[0], fadeOutAt[1]) : 1;
  return (
    <g>
      {Array.from({ length: n }).map((_, i) => (
        <circle key={i} cx={random(`st${i}`) * 1920} cy={30 + random(`sty${i}`) * 480}
          r={1 + random(`str${i}`)} fill={P2.ivoryDim}
          opacity={(0.18 + 0.15 * Math.abs(Math.sin(t * 0.8 + i))) * gate} />
      ))}
    </g>
  );
};

/** 线稿鸟笼（亮/暗两用）
 *  几何来自共享源 scenes/cageGeometry.ts（step19：开场生长与中段同源求形）。
 *  layer（任务书 step06 增加的可选分层，默认 "full" 行为与旧版完全一致）：
 *    "back"  = 顶拱 + 远侧栏（k=±2,±3）+ 笼底 → 画在内侧角色之后
 *    "front" = 近侧栏（k=-1,0,1）+ 笼底前缘弧 → 重绘在内侧角色之上
 *    仅 Act4 使用分层；其他幕不传 layer，渲染不变。 */
export const CageLines: React.FC<{ t: number; opacity: number; heartGlow?: number; dark?: boolean; layer?: "full" | "back" | "front" }> =
  ({ t, opacity, heartGlow = 0, dark = false, layer = "full" }) => {
    const stroke = dark ? "#4A3B5C" : P2.lilac;
    const bar = (k: number) => (
      <path key={k} d={barPath(k)}
        fill="none" stroke={stroke} strokeWidth={barWidth(k)}
        strokeLinecap="round" opacity={dark ? 0.5 - Math.abs(k) * 0.04 : barBaseOpacity(k)} />
    );
    return (
      <g opacity={opacity}>
        {(layer === "full" || layer === "back") && (
          <>
            {[-3, -2, 2, 3].map((k) => bar(k))}
            <path d={archPath()} fill="none"
              stroke={stroke} strokeWidth={4} strokeLinecap="round" opacity={0.5} />
            <ellipse {...baseEllipse()} fill="none" stroke={stroke} strokeWidth={2.5} opacity={0.45} />
          </>
        )}
        {heartGlow > 0 && layer !== "front" && (
          <g opacity={heartGlow}>
            <circle cx={960} cy={392} r={44 + 3 * Math.sin(t * 2.2)} fill="url(#wispShared)" opacity={0.8} />
            <circle cx={960} cy={392} r={5.5} fill="#FFFFFF" />
          </g>
        )}
        {(layer === "full" || layer === "front") && (
          <>
            {[-1, 0, 1].map((k) => bar(k))}
            {layer === "front" && (
              <path d={baseFrontArc()} fill="none"
                stroke={stroke} strokeWidth={2.5} opacity={0.45} />
            )}
          </>
        )}
      </g>
    );
  };

/** 落瓣/光尘 */
export const Petals: React.FC<{ t: number; n?: number; opacity: number; color?: string }> =
  ({ t, n = 12, opacity, color = P2.pinkHi }) => (
    <g opacity={opacity}>
      {Array.from({ length: n }).map((_, i) => {
        const px = 200 + random(`pt${i}`) * 1520;
        const py = 120 + ((t * (14 + random(`ptv${i}`) * 12) + random(`pto${i}`) * 300) % 420);
        return (
          <ellipse key={i} cx={px} cy={py} rx={6} ry={3.5} fill={color}
            opacity={0.35 + 0.2 * Math.sin(t + i)} />
        );
      })}
    </g>
  );

/** 错误剧场：红裂缝 + 对象名 + ⚠（异常 N/3） */
export const ErrorTheater: React.FC<{
  t: number; a: number; b: number; nth: string; obj: string;
}> = ({ t, a, b, nth, obj }) => {
  const o = S(t, a, a + 1.5) * (1 - S(t, b - 1.5, b));
  if (o <= 0) return null;
  return (
    <g opacity={o}>
      <rect width="1920" height="614" fill="#0B0812" opacity={0.5} />
      <path d="M 300 0 L 620 240 L 520 614" stroke="#FF9B8A" strokeWidth={2} fill="none"
        opacity={0.35 + 0.15 * Math.sin(t * 9)} />
      <path d="M 1660 0 L 1330 260 L 1450 614" stroke="#FF9B8A" strokeWidth={2} fill="none"
        opacity={0.28 + 0.12 * Math.sin(t * 7 + 1)} />
      <text x={1700} y={140} fontFamily={FONT_MONO} fontSize={20} fill="#FF9B8A"
        opacity={0.85 * S(t, a + 1, a + 1.5)}>⚠ 异常 ({nth})</text>
      <text x={960} y={300} textAnchor="middle" fontFamily={FONT_MONO} fontSize={30} fill="#FF9B8A"
        opacity={0.9 * S(t, a + 2, a + 2.5)}>对象名:{obj}</text>
    </g>
  );
};

/** 记录卡（金标签检索结果）—— 长文自动换行；读完停留后自动退场（或 goneAt 强制） */
export const RecordCard: React.FC<{
  t: number; at: number; text: string; x: number; y: number; w?: number; gold?: boolean; goneAt?: number;
}> = ({ t, at, text, x, y, w = 470, gold = false, goneAt }) => {
  const rowChars = Math.max(12, Math.floor((w - 36) / 19));
  const rows: string[] = [];
  for (let i = 0; i < text.length; i += rowChars) rows.push(text.slice(i, i + rowChars));
  // 读完（打字完成）+ 停留 2.6s 再退场；goneAt 优先（串行弹窗由调用方编排）
  const typeDone = at + 0.3 + text.length / 16;
  const autoGone = typeDone + 2.6;
  const g = goneAt ?? autoGone;
  const o = S(t, at, at + 0.6) * (1 - S(t, g, g + 1.6));
  if (o <= 0) return null;
  const h = 46 + rows.length * 26;
  return (
    <g opacity={o} transform={`translate(${x} ${y + (1 - o) * 14})`} fontFamily={FONT_MONO}>
      {/* 弹窗体：半透明深底（不全透明——保证文字可读） */}
      <rect width={w} height={h} rx={10} fill="rgba(20,12,28,0.85)"
        stroke={gold ? "#E8C9A0" : P2.lilac} strokeWidth={gold ? 1.6 : 1.2} opacity={0.92} />
      <text x={20} y={28} fontSize={14} fill="#E8C9A0" letterSpacing={4}>记 录</text>
      {rows.map((r, i) => {
        const shown = Math.max(0, Math.min(r.length, Math.floor((t - at - 0.3) * 16) - i * rowChars));
        return (
          <text key={i} x={20} y={52 + i * 26} fontSize={18} fill={gold ? "#E8C9A0" : P2.ivory}>
            {r.slice(0, shown)}
          </text>
        );
      })}
    </g>
  );
};

/** 像素小人（L2）：发色/衣着/朝向可配 */
export const PixelFigure: React.FC<{
  x: number; y: number; t: number; scale?: number; hair: string; cloth: string; flip?: boolean; walk?: boolean;
}> = ({ x, y, t, scale = 1, hair, cloth, flip = false, walk = false }) => {
  const step = walk ? Math.floor(t * 3) % 2 : 0;
  return (
    <g transform={`translate(${x} ${y}) scale(${(flip ? -1 : 1) * scale} ${scale})`}>
      {/* 头 + 发 */}
      <rect x={-7} y={-26} width={14} height={12} fill={hair} />
      <rect x={-9} y={-22} width={3} height={10} fill={hair} />
      <rect x={6} y={-22} width={3} height={10} fill={hair} />
      {/* 眼睛 */}
      <rect x={-4} y={-21} width={2} height={3} fill="#3A2E4C" />
      <rect x={2} y={-21} width={2} height={3} fill="#3A2E4C" />
      {/* 身体 */}
      <rect x={-6} y={-14} width={12} height={14} fill={cloth} />
      {/* 腿（走路交替） */}
      <rect x={-5 + (walk ? step : 0)} y={0} width={4} height={8} fill="#4A3B5C" />
      <rect x={1 - (walk ? step : 0)} y={0} width={4} height={8} fill="#4A3B5C" />
    </g>
  );
};

/** 羽毛笔扫屏转场 */
export const QuillSweep: React.FC<{ t: number; a: number }> = ({ t, a }) => {
  const p = S(t, a, a + 2);
  if (p <= 0 || p >= 1) return null;
  return (
    <g opacity={Math.sin(p * Math.PI)}>
      <rect width="1920" height="614" fill={P2.bgPanel} opacity={0.55} />
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M ${-200 + p * 2400} ${-100 + i * 160} l 520 180 l -60 40 l -520 -180 z`}
          fill="rgba(242,167,184,0.35)" />
      ))}
      <circle cx={-200 + p * 2400 + 500} cy={-60 + p * 0 + 260} r={8} fill="#F3E9DC" opacity={0.9} />
    </g>
  );
};
