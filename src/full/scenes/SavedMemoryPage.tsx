import React from "react";
import { P2 } from "../../v2/palette2";
import { S } from "../kit";

// ─────────────────────────────────────────────────────────────────
// 保存页 · SAVE 落入的记忆页（任务书 step12，仅 Act4 494–526 段）
//
// 与 step09 MemoryPage 区分：那页是「擦除」（损耗），这一页是「保存」——
// 497 注释后淡纸面里生成（粉紫细线、少量字迹、上一段记忆的小压痕：
// 树洞轮廓与小朋友脸），510.2–511.3 S/A/V/E 依次落入成为四个小印记，
// 512 后平静留下；右下留一处未满的浅淡边缘——保存不等于抹平伤痕。
// 525–527 淡出接原暗场。纯绝对秒驱动；无进度条、无庆典、无新标签。
// ─────────────────────────────────────────────────────────────────

export const SavedMemoryPage: React.FC<{
  t: number;
  /** 组内局部坐标（左上），默认悬于笼内上空、避开 517 迷迷位置 */
  x?: number;
  y?: number;
}> = ({ t, x = 900, y = 60 }) => {
  const o = S(t, 497, 498.5) * (1 - S(t, 525, 527));
  if (o <= 0) return null;

  const w = 200, h = 200;
  // 字迹行（暖墨，少量）
  const strokes = [
    { dx: 20, dy: 52, w: 120 },
    { dx: 20, dy: 74, w: 96 },
    { dx: 20, dy: 96, w: 132 },
  ];
  // S/A/V/E 印记：与 Act4 落字坐标对应，落位时刻逐个显现
  const imprints = "SAVE".split("").map((ch, i) => ({
    ch, x: x + 40 + i * 50, y: y + 150, at: 510.2 + i * 0.35,
  }));

  return (
    <g opacity={o}>
      {/* 页面本体（粉紫细线） */}
      <rect x={x} y={y} width={w} height={h} rx={8}
        fill="rgba(255,252,247,0.85)" stroke={P2.lilac} strokeWidth={1.2} opacity={0.95} />
      {/* 上一段记忆的小压痕：树洞轮廓 + 小朋友脸（淡，视觉联系） */}
      <g opacity={0.3} stroke="#B9AEC6" strokeWidth={1.4} fill="none">
        <path d={`M ${x + 26} ${y + 34} L ${x + 44} ${y + 34} L ${x + 56} ${y + 56}
                   L ${x + 50} ${y + 74} L ${x + 22} ${y + 74} L ${x + 16} ${y + 54} Z`} />
        <circle cx={x + 132} cy={y + 50} r={13} />
        <circle cx={x + 128} cy={y + 48} r={1.6} fill="#B9AEC6" stroke="none" />
        <circle cx={x + 136} cy={y + 48} r={1.6} fill="#B9AEC6" stroke="none" />
      </g>
      {/* 少量字迹 */}
      {strokes.map((s, i) => (
        <line key={i} x1={x + s.dx} y1={y + s.dy} x2={x + s.dx + s.w} y2={y + s.dy}
          stroke="#8A7A98" strokeWidth={3} strokeLinecap="round" opacity={0.4} />
      ))}
      {/* SAVE 四个小印记（字母落位时逐个显现） */}
      {imprints.map((im, i) => (
        <text key={i} x={im.x} y={im.y} fontSize={26} textAnchor="middle"
          fontFamily="monospace" fill="#C99DAF"
          opacity={S(t, im.at, im.at + 0.35) * 0.85}>{im.ch}</text>
      ))}
      {/* 未满的边缘：右下角一段浅淡未完成笔触（保存≠抹平伤痕） */}
      <path d={`M ${x + 132} ${y + 176} Q ${x + 152} ${y + 172}, ${x + 168} ${y + 180}`}
        fill="none" stroke="#B9AEC6" strokeWidth={2} strokeLinecap="round" opacity={0.25} />
    </g>
  );
};
