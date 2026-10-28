import React from "react";
import { P2 } from "../../v2/palette2";
import { S } from "../kit";

// ─────────────────────────────────────────────────────────────────
// 记忆页 · 一页展开的字迹（任务书 step09，仅 Act3 告别段 339.5–368 窗口）
//
// 暗线口径（总方案D / dsh 20261012-1952-001）：观众能看见损耗、她仍选择
// 温暖——不加「她在隐瞒」标签、不加后台秘密宣言、不引入未经证实的角色认知。
//
// 演出：给外侧昔涟身边加一页小记忆页（约165×185，暗墨/粉紫细线，
// 出现时已有字迹）。348 格式化到来时红色擦除线扫过，字迹逐条变浅、
// 留下浅淡压痕（opacity 0.5→0.18，可细看读出而非消失），页本身仍在。
// 纯绝对秒驱动；不碰 LINES/CHOICES/音轨/指标，不盖角色/LOG/pipeline/台词。
// ─────────────────────────────────────────────────────────────────

const INK = "#4A3B5C";      // 暗墨字迹
const FAINT = "#4A3B5C";    // 压痕（同色低透明——细看仍可读）
const SWEEP = "#FF9B8A";    // 格式化擦除线（局部红，不全屏）

export const MemoryPage: React.FC<{
  t: number;
  /** 组内局部坐标（左上），默认昔涟左侧空地 */
  x?: number;
  y?: number;
}> = ({ t, x = 295, y = 330 }) => {
  const o = S(t, 339.5, 341.5) * (1 - S(t, 365.5, 368));
  if (o <= 0) return null;

  const w = 165, h = 185;
  // 字迹行：擦除从上到下逐条发生（348 起每 0.28s 一条）
  const strokes = [
    { dx: 15, dy: 42, w: 120 },
    { dx: 15, dy: 64, w: 138 },
    { dx: 15, dy: 86, w: 100, pink: true },
    { dx: 15, dy: 108, w: 128 },
    { dx: 15, dy: 130, w: 84 },
    { dx: 15, dy: 152, w: 112 },
  ];
  const sweep = S(t, 348, 350.2); // 擦除线行程 0→1

  return (
    <g opacity={o} transform={`translate(0 ${(1 - S(t, 339.5, 341.5)) * 6})`}>
      {/* 页面本体（出现时已有字迹） */}
      <rect x={x} y={y} width={w} height={h} rx={7}
        fill="rgba(255,252,247,0.8)" stroke={P2.lilac} strokeWidth={1.2} opacity={0.92} />
      {/* 题头短粉线 */}
      <line x1={x + 15} y1={y + 22} x2={x + 58} y2={y + 22}
        stroke={P2.pink} strokeWidth={2.5} strokeLinecap="round" opacity={0.75} />
      {/* 字迹行：348 起逐条被擦成浅淡压痕（仍在，可细看读出） */}
      {strokes.map((s, i) => {
        const f = S(t, 348 + i * 0.28, 349 + i * 0.28);
        return (
          <line key={i} x1={x + s.dx} y1={y + s.dy} x2={x + s.dx + s.w} y2={y + s.dy}
            stroke={INK} strokeWidth={3} strokeLinecap="round"
            opacity={0.5 + (0.18 - 0.5) * f} />
        );
      })}
      {/* 格式化擦除线（348–350.2 扫过一次，局部红、非全屏） */}
      {sweep > 0 && sweep < 1 && (
        <line x1={x - 12 + sweep * (w + 24)} y1={y - 10}
          x2={x - 12 + sweep * (w + 24) - 26} y2={y + h + 10}
          stroke={SWEEP} strokeWidth={2.5} strokeLinecap="round"
          opacity={0.5 * Math.sin(sweep * Math.PI)} />
      )}
    </g>
  );
};
