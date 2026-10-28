// ─────────────────────────────────────────────────────────────────
// cageGeometry.ts · 笼子共享几何唯一来源（任务书 step19）
//
// 七栏（k=−3..3，间距 96）、中心 960、底 y512、底椭圆 292×16、拱顶曲线——
// 开场生长（Act1 M2）、中段 full/back/front（shared.CageLines）、
// Act3 告别段内联栏杆全部从本源求形；完全长成后与已验收几何逐像素一致。
// 纯数据/纯函数，无渲染依赖。
// ─────────────────────────────────────────────────────────────────

export const CAGE = {
  cx: 960,
  baseY: 512,
  spacing: 96,
  baseRx: 292,
  baseRy: 16,
} as const;

export const CAGE_BARS = [-3, -2, -1, 0, 1, 2, 3] as const;

export const barX = (k: number) => CAGE.cx + k * CAGE.spacing;
export const barH = (k: number) => 292 - Math.abs(k) * 34;
export const barWidth = (k: number) => 5 - Math.abs(k) * 0.5;
export const barBaseOpacity = (k: number) => 0.55 - Math.abs(k) * 0.04;

/** 栏杆路径。topScale=1 为完整长成（与已验收几何逐字一致）；<1 用于开场
 *  生长——两个 Bezier 控制点纵向高度随 topScale 同比缩放，0 时退为底线
 *  极短线，不产生高回折曲线（step19 Rev.2）。中段默认 1 不受影响。 */
export const barPath = (k: number, topScale = 1) => {
  const x = barX(k);
  const h = barH(k);
  return `M ${x - Math.abs(k) * 3} ${CAGE.baseY} C ${x - Math.abs(k) * 5} ${CAGE.baseY - h * 0.4 * topScale}, ${x + Math.abs(k) * 4} ${CAGE.baseY - h * 0.75 * topScale}, ${x} ${CAGE.baseY - h * topScale}`;
};

/** 顶拱曲线 */
export const archPath = () => `M 674 322 C 780 198, 1140 198, 1246 322`;

/** 顶拱两端点（供边界回声等从实际端点延续，避免手工坐标） */
export const archEnds = {
  left: { x: 674, y: 322 },
  right: { x: 1246, y: 322 },
} as const;

/** 底椭圆（完整） */
export const baseEllipse = () => ({ cx: CAGE.cx, cy: CAGE.baseY, rx: CAGE.baseRx, ry: CAGE.baseRy });

/** 底缘前弧（layer="front" 用，椭圆下半） */
export const baseFrontArc = () =>
  `M ${CAGE.cx - CAGE.baseRx} ${CAGE.baseY} A ${CAGE.baseRx} ${CAGE.baseRy} 0 0 0 ${CAGE.cx + CAGE.baseRx} ${CAGE.baseY}`;
