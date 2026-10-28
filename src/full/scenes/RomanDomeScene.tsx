import React from "react";
import { P2 } from "../../v2/palette2";
import { S } from "../kit";

// ─────────────────────────────────────────────────────────────────
// 古罗马穹顶 · 大空间（Act2 宫殿 140–159，纯时间组件，任务书 step04）
// 接入点在 Act2 svg 的 translate(0 130) 组内 → 本组件全部使用组内局部坐标。
//
// Rev.2（QA 返修，首稿五条意见全收）：
//   1. 经线改为曲线：从天窗左右/下沿以贝塞尔曲线自然落到两侧鼓座/拱座线，
//      覆盖半球下半面（首稿直线扇形只扫过顶部，下半面无结构）；
//      环线改为同一曲面族的同心弧（共圆心、等比半径）。
//   2. 列拱 6→4 座，增高为瘦高圆拱＋可读立柱/柱头/柱基＋内弧线示纵深。
//   3. 地面去科幻网格，改为少量透视石材接缝（收敛缝＋错缝石板短线）。
//   4. 按用户反馈取消 LOG 背景遮罩，保持连续的宫殿画面。
//   5. 台词节奏不变：140 描线拉开 / 146 光束与层次展开（起步提前 0.3s）/
//      157 安静不崩塌；德谬歌方块仍落于地平 svg y461；配色细线绘本风。
// ─────────────────────────────────────────────────────────────────

const HORIZON = 331;        // 地平/拱座线（组内局部 y；svg y 461）
const DOME_R = 640.8;       // 主弧半径（弦 1120px＝舞台宽 58.3%）
const DOME_CY = 535.8;      // 主弧圆心 y（画面下方外侧——内景仰视）
// 四座列拱的左右边界560–1548，中轴1054；穹顶与天窗统一使用该轴。
const DOME_X = (560 + 1548) / 2;
const OC = { x: DOME_X, y: -35, r: 44 }; // 天窗

export const RomanDomeScene: React.FC<{ t: number }> = ({ t }) => {
  const domeP = S(t, 140, 142);        // 140「多么壮观」主轮廓拉开
  const layerP = S(t, 145.7, 148.7);   // 146「未来色彩」内部层次
  const beamP = S(t, 145.8, 147.8);    // 天窗光束
  const floorP = S(t, 146.2, 148.8);   // 石材地面
  const calm = 1 - S(t, 156.5, 158);   // 157「不会」光与远景安静（建筑保留）

  // 经线：从天窗边缘/下沿出发，曲线（明显外弓）落到拱座线，覆盖半球下半面
  const meridians = [-460, -280, -100, 0, 100, 280, 460].map((off) => {
    const sx = off === 0 ? OC.x : OC.x + Math.sign(off) * (OC.r - 6) * 0.55 + off * 0.1;
    const sy = off === 0 ? OC.y + OC.r - 4 : OC.y + 14;
    const cx = DOME_X + off * 0.82;
    const cy = 196 + Math.abs(off) * 0.1;
    return { d: `M ${sx} ${sy} Q ${cx} ${cy} ${DOME_X + off} ${HORIZON - 2}` };
  });

  // 环线：同一曲面族的同心弧（共圆心；端点落在拱座线上，不垂到地平以下）
  const rings = [250, 385, 515].map((r) => {
    const cy = DOME_CY - (DOME_R - r) * 0.72;
    const ry = r * 0.42;
    const dx = r * Math.sqrt(1 - ((HORIZON - cy) / ry) ** 2);
    return { d: `M ${DOME_X - dx} ${HORIZON} A ${r} ${ry} 0 0 1 ${DOME_X + dx} ${HORIZON}` };
  });

  // 列拱 ×4：瘦高圆拱 + 立柱/柱头/柱基 + 内弧线（纵深）
  const arches = [560, 826, 1092, 1358].map((x) => ({ x, w: 190, colW: 26, top: 154 }));

  return (
    <g>
      <defs>
        <radialGradient id="rdGlow">
          <stop offset="0%" stopColor="rgba(242,167,184,0.14)" />
          <stop offset="60%" stopColor="rgba(201,163,220,0.05)" />
          <stop offset="100%" stopColor="rgba(201,163,220,0)" />
        </radialGradient>
        <linearGradient id="rdBeam" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(255,235,246,0.5)" />
          <stop offset="100%" stopColor="rgba(255,235,246,0)" />
        </linearGradient>
      </defs>

      {/* 殿内环境微光 */}
      <circle cx={DOME_X} cy={130} r={430} fill="url(#rdGlow)" opacity={domeP} />

      {/* 天窗光束（146 展开，157 安静熄灭） */}
      <polygon points={`${DOME_X - 38},-30 ${DOME_X + 38},-30 ${DOME_X + 220},331 ${DOME_X - 220},331`} fill="url(#rdBeam)"
        opacity={0.34 * beamP * calm} />
      {Array.from({ length: 9 }).map((_, i) => {
        const px = 800 + ((i * 47) % 360);
        const py = 40 + ((t * (14 + (i % 4) * 6) + i * 61) % 280);
        return <circle key={i} cx={px} cy={py} r={1.6} fill="#FFF0F7"
          opacity={0.5 * floorP * calm * Math.abs(Math.sin(t * 1.3 + i * 1.9))} />;
      })}

      {/* 穹顶主弧（140–142 描线拉开）+ 鼓座上沿 */}
      <path d={`M ${DOME_X - 560} 225 A ${DOME_R} ${DOME_R} 0 0 1 ${DOME_X + 560} 225`} fill="none"
        stroke={P2.lilacHi} strokeWidth={2.2} opacity={domeP * 0.9}
        pathLength={1} strokeDasharray={1} strokeDashoffset={1 - domeP} />

      {/* 天窗（oculus）：双圈 + 柔光，完整不裁切 */}
      <g opacity={S(t, 140.4, 141.6)}>
        <circle cx={OC.x} cy={OC.y} r={58} fill={P2.pinkHi} opacity={0.12 + 0.05 * Math.sin(t * 1.6)} />
        <circle cx={OC.x} cy={OC.y} r={OC.r - 4} fill="rgba(20,12,30,0.75)" stroke={P2.pinkHi} strokeWidth={2} />
        <circle cx={OC.x} cy={OC.y} r={OC.r - 16} fill="none" stroke={P2.lilacHi} strokeWidth={1} opacity={0.7} />
      </g>

      {/* 经线：天窗 → 拱座，覆盖半球下半面 */}
      {meridians.map((m, i) => (
        <path key={i} d={m.d} fill="none" stroke={P2.lilac} strokeWidth={1.3}
          opacity={S(t, 140.8 + i * 0.07, 141.9 + i * 0.07) * 0.55} />
      ))}

      {/* 环线：同心弧族（同一穹顶曲面） */}
      {rings.map((r, i) => (
        <path key={i} d={r.d} fill="none" stroke={P2.lilac} strokeWidth={1}
          opacity={S(t, 141.2 + i * 0.15, 142.4 + i * 0.15) * (0.26 + layerP * 0.14)} />
      ))}

      {/* 远壁列拱 ×4：瘦高圆拱 + 立柱/柱头/柱基 + 内弧纵深 */}
      {arches.map((a, i) => {
        const o = S(t, 141.5 + i * 0.12, 142.6 + i * 0.12);
        const { x, w, colW, top } = a;
        const pxL = x + colW / 2, pxR = x + w - colW / 2;
        return (
          <g key={i} opacity={o}>
            {/* 立柱 */}
            <rect x={x} y={top + 82} width={colW} height={HORIZON - top - 82} fill="rgba(201,163,220,0.07)"
              stroke={P2.lilacHi} strokeWidth={1.3} />
            <rect x={x + w - colW} y={top + 82} width={colW} height={HORIZON - top - 82} fill="rgba(201,163,220,0.07)"
              stroke={P2.lilacHi} strokeWidth={1.3} />
            {/* 柱头 / 柱基 */}
            <rect x={x - 6} y={top + 70} width={colW + 12} height={12} fill="none" stroke={P2.lilacHi} strokeWidth={1.2} />
            <rect x={x + w - colW - 6} y={top + 70} width={colW + 12} height={12} fill="none" stroke={P2.lilacHi} strokeWidth={1.2} />
            <rect x={x - 4} y={HORIZON - 7} width={colW + 8} height={7} fill="none" stroke={P2.lilac} strokeWidth={1} opacity={0.7} />
            <rect x={x + w - colW - 4} y={HORIZON - 7} width={colW + 8} height={7} fill="none" stroke={P2.lilac} strokeWidth={1} opacity={0.7} />
            {/* 圆拱（外弧 + 内弧示纵深） */}
            <path d={`M ${pxL} ${top + 76} A ${w / 2 - colW / 2} ${w / 2 - colW / 2} 0 0 1 ${pxR} ${top + 76}`}
              fill="rgba(201,163,220,0.05)" stroke={P2.lilacHi} strokeWidth={1.5} />
            <path d={`M ${pxL + 7} ${top + 80} A ${w / 2 - colW / 2 - 7} ${w / 2 - colW / 2 - 7} 0 0 1 ${pxR - 7} ${top + 80}`}
              fill="none" stroke={P2.lilac} strokeWidth={1} opacity={0.45} />
            {/* 拱心石 */}
            <rect x={x + w / 2 - 7} y={top + 4} width={14} height={16} fill="none"
              stroke={P2.lilacHi} strokeWidth={1.2} opacity={0.8} />
          </g>
        );
      })}
      <line x1={DOME_X - 600} y1={HORIZON} x2={DOME_X + 600} y2={HORIZON} stroke={P2.ivoryDim} strokeWidth={1}
        opacity={S(t, 141.5, 142.5) * 0.8} />

      {/* 地面：少量透视石材接缝（去网格感） */}
      <g opacity={floorP * 0.9}>
        {[-330, -110, 110, 330].map((dx, i) => (
          <line key={i} x1={DOME_X + dx * 0.25} y1={HORIZON} x2={DOME_X + dx * 1.9} y2={560}
            stroke={P2.lilac} strokeWidth={1} opacity={0.2} />
        ))}
        {[[348, 3], [378, 2], [416, 4], [462, 2], [516, 3]].map(([y, n], r) => (
          <g key={r}>
            {Array.from({ length: n as number }).map((_, k) => {
              const seg = 340 + r * 130;
              const x0 = DOME_X - ((n as number) * seg) / 2 + k * seg + (r % 2) * 60;
              return <line key={k} x1={x0} y1={y as number} x2={x0 + seg - 26} y2={y as number}
                stroke={P2.lilac} strokeWidth={1} opacity={0.14 + r * 0.03} />;
            })}
          </g>
        ))}
      </g>

      {/* 殿内星尘（157 后安静） */}
      {Array.from({ length: 10 }).map((_, i) => (
        <circle key={i} cx={460 + ((i * 173) % 1000)} cy={60 + ((i * 97) % 230)}
          r={1.6} fill="#FFFFFF"
          opacity={domeP * (0.18 + 0.22 * calm * Math.abs(Math.sin(t * 1.1 + i * 2.1)))} />
      ))}

    </g>
  );
};
