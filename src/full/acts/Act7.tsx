import React from "react";
import { AbsoluteFill, random, useCurrentFrame } from "remotion";
import { P2, FONT_MONO } from "../../v2/palette2";
import { FPS } from "../scriptFull";
import { S } from "../kit";
import { RecordCard, PixelFigure } from "./shared";
import { FairyGlyph } from "../scenes/FairyGlyph";
import { HeirMemorySymbols } from "../scenes/HeirMemorySymbols";
import { ARC_GAP } from "../data/heirSymbols";
import { boundaryAt } from "../narrative";

/**
 * 第七幕 · 涟漪（1389.5–1597）
 * 1394-1444 画廊卷轴（白毛小身影自左向右 + 四因子记录卡）→
 * 1445-1523 昔涟的哀怜独白（语义色彩：孤独/不甘/毁灭/黑潮→烈火→冻结）→
 * 1524 羽毛笔翻页 → 1526-1594 收束独白（一滴湿润的眼泪 → 漾开最初的涟漪 →
 * 倒映一切美丽的事物 → 金字「所有的「记忆」」）→ 1595 白屏双身影 + 片尾会话框
 */
const WALKER_FROM = 1394;
const WALKER_TO = 1523;

export const Act7: React.FC = () => {
  const frame = useCurrentFrame();
  const t = 1389.5 + frame / FPS;

  const walkerX = 200 + Math.min(1, Math.max(0, (t - WALKER_FROM) / (WALKER_TO - WALKER_FROM))) * 1300;
  // step23 越界行走（1526–1552，纯绝对秒分段，承接 step22 坐标表）：
  // 1526–1531 靠近缺口（1500→1610）→ 1534–1539 短停（看见故事外的痛苦）→
  // 1539–1545 跨缺口 → 1547–1552 外侧站稳（1730）。脚点地面 y=500。
  // ★ Rev.2 校准：中心 x = 1500 + crossX（线性 S）——t1540 中心 1625 **尚未到**
  //   门槛竖线 x1655；真正中心跨越在 t1542（S=0.5，x=1655），1542.5=1662.5。
  const crossX =
    110 * S(t, 1526, 1531) +
    90 * S(t, 1539, 1545) +
    30 * S(t, 1547, 1552);
  // ★ Rev.2 步态门控：真步行窗口 = 1394–1523（原画廊行走，保留）∪
  //   1526–1531 / 1539–1545 / 1547–1552（行动段）；停靠（1523–1526）与
  //   短停/落脚（1531–1539、1545–1547）收步——摆臂/抬步归零，只留很小呼吸。
  const walking =
    S(t, WALKER_FROM, WALKER_FROM + 0.8) * (1 - S(t, 1523, 1524)) +
    S(t, 1526, 1526.8) * (1 - S(t, 1530.2, 1531)) +
    S(t, 1539, 1539.8) * (1 - S(t, 1544.2, 1545)) +
    S(t, 1547, 1547.8) * (1 - S(t, 1551.2, 1552));
  const gaitBob = walking * Math.abs(Math.sin(t * 3)) * -7; // 步行起伏
  const breathBob = (1 - walking) * Math.sin(t * 1.6) * -1.5; // 停顿呼吸（≤1.5px）
  const armSwing = walking * Math.sin(t * 3) * 20 + (1 - walking) * Math.sin(t * 1.6) * 3;
  const legSwing = walking * Math.sin(t * 3) * 12;
  // step24 同位凝聚（1552.8–1573，只动 1552 之后，不改 1526–1552 轨迹）：
  // 白毛行动形态沿同一脚点（落脚 1730,500）与同位粉紫微光，经逐字凝聚
  // 转为可辨迷迷（长耳/耳根卷/额前卷毛/星瞳/大尾巴/小爪，FairyGlyph dark
  // 配色）——同位 alpha 交接、共用一个坐标与状态，非并排第二主体。
  // 凝聚后允许一小步（1558–1566 外移 55px，朝同行方向）：左耳离开门槛
  // 实线 x1655，右耳/尾不碰屏边与 HUD；尾巴经缺口开口区（380–506）不碰实线。
  // 1572–1573 迷迷与守望一起淡出，给 1572.5 起的泪影与 1573 眼角泪滴让位。
  const MEM_SIZE = 13;                          // 14行×13px = 182px 高
  const MEM_CPS = 105;                          // 448格 ÷105 ≈ 4.27s → 1557.1 完成
  const MEM_START = 1552.8;                     // 逐字凝聚起点（承接 1552 微光）
  const memStepX = 55 * S(t, 1558, 1566);       // 凝聚后的那一小步
  const memX = 1730 + memStepX;                 // 迷迷中心（脸/脚同列 15.5）
  const memFade = 1 - S(t, 1572, 1573.2);       // 给泪影让位的淡出
  const memGX = memX - 15.5 * 0.62 * MEM_SIZE;  // 字符画左上 x
  const memGY = 500 - 14 * MEM_SIZE;            // 字符画左上 y（脚底贴地 y=500）
  // ★ Rev.2（Codex 实读首稿 1557：完整迷迷左耳被 i5 右上竖线贯穿，
  //   直到 1565 一小步走完才分开——不能只用 1565 证明全程不碰）：
  //   i5 右上/右下竖段随同位凝聚在 1553–1555 淡去，完整迷迷 1557 出现时
  //   左耳不再被竖线穿过；顶拱保留为开放回声，画廊其余/时序不动。
  const gateEarFade = 1 - S(t, 1553, 1555);
  // step22 Rev.2：画廊视差/焦点改用「原记忆行走进度」独立变量——后续出笼项
  // 改变 walker 显示坐标时，不会拖动门槛/画廊位置
  const memoryWalkX = walkerX;
  // 返工⑥（第三轮）：眼泪从「模糊身形」的眼角滑落——身形见下方 1572.5 起的泪影
  const dropX = t < 1577 ? 915 : Math.min(932, 915 + (t - 1577) * 20);
  const dropY = t < 1577 ? 202 : Math.min(392, 202 + (t - 1577) * 240);
  const ripple = S(t, 1581, 1581.3);

  const galleryO = 1 - S(t, 1573, 1577); // 泪滴落下时，画廊让位给水面

  // step22 边界缓慢开放（1449–1523）：独白锚点逐条累积 sep（每步 0.9s 渐变），
  // 画廊整体左移 170px 让出**有方向的右侧间隙**；跨羽毛笔扫屏连续（纯 t 函数，
  // 无复位）；gate 实际消费 boundaryAt（opening/crossing/open 期间保持成形）
  const SEP_NODES = [1449, 1456, 1463, 1473, 1483, 1491, 1496, 1513, 1519];
  const sep = SEP_NODES.reduce((a, at) => a + S(t, at, at + 0.9), 0) / SEP_NODES.length;
  const boundaryOpen = ["opening", "crossing", "open"].includes(boundaryAt(t));

  // 语义色彩洗
  const wash = (a: number, b: number, color: string, op: number) =>
    t >= a && t < b ? <rect key={color + a} width="1920" height="614" fill={color} opacity={S(t, a, a + 1.5) * (1 - S(t, b - 1, b)) * op} /> : null;

  return (
    <AbsoluteFill style={{ position: "absolute", top: 46, height: 718, overflow: "hidden" }}>
      <svg width="1920" height="718" viewBox="0 0 1920 718" preserveAspectRatio="none" style={{ display: "block" }}>
        <defs>
          <radialGradient id="a7wisp">
            <stop offset="0%" stopColor={P2.pinkHi} />
            <stop offset="100%" stopColor="rgba(242,167,184,0)" />
          </radialGradient>
          <radialGradient id="a7gold">
            <stop offset="0%" stopColor="#FFE9B8" />
            <stop offset="100%" stopColor="rgba(232,201,160,0)" />
          </radialGradient>
        </defs>

        {/* 画廊深底 */}
        <rect width="1920" height="718" fill="#2A2138" opacity={S(t, 1394, 1395.5)} />
        {/* 地板 */}
        <rect y={470} width="1920" height={248} fill="#1E1730" opacity={S(t, 1394, 1395.5)} />
        <line x1={0} y1={470} x2={1920} y2={470} stroke="#C9A86B" strokeWidth={1.6}
          opacity={0.55 * S(t, 1394, 1395.5) * galleryO} />
        <g transform="translate(0 30)" opacity={1 - S(t, 1594, 1594.6)}>

        {/* 记忆画廊：六扇拱窗各回收一个前幕母题；镜头随小身影有视差，焦点窗亮、旧窗暗。
            step22：sep 让画廊整体左移，右侧留出渐开的间隙（1449–1523 逐条滑离） */}
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const drift = ((memoryWalkX - 200) / 1300) * (i - 2.5) * -14; // 视差：远窗慢移
          const x = 140 + i * 300 + drift - sep * 170 * (boundaryOpen ? 1 : 0);
          const o = S(t, 1394 + i * 0.3, 1395 + i * 0.3);
          const focus = 1 - Math.min(1, Math.abs(memoryWalkX - (x + 110)) / 620) * 0.55;
          // step22 Rev.2：最后一扇（i=5）＝认知界面右边——填充与描线拆开，
          // 顶拱同形弧保留；右竖边拆上下两段、sep 开出可通行缺口（脚点地面附近）；
          // 左竖边延到地面（长度随 sep），sep=0 时与已验收阅读窗一致
          const isLast = i === 5;
          return (
            <g key={i} opacity={o * focus * galleryO}>
              <rect x={x + 14} y={164} width={192} height={262} fill="#182238"
                opacity={isLast ? 1 - sep * 0.45 : 1} />
              {isLast ? (
                <>
                  {/* 顶拱同形弧（保留）+ 左竖边原段（190→440 不动）；
                      ★ Rev.2：step22 的地面延伸（440→440+65·sep）单独成线，
                      随迷迷让位 memFade 收退到原 440，给泪影退场 */}
                  <path d={`M ${x} 440 L ${x} 190 C ${x + 36} 138, ${x + 184} 138, ${x + 220} 190`}
                    fill="none" stroke="#C9A86B" strokeWidth={2.5} strokeLinejoin="round" />
                  <line x1={x} y1={440} x2={x} y2={440 + 65 * sep}
                    stroke="#C9A86B" strokeWidth={2.5} strokeLinecap="round" opacity={memFade} />
                  {/* 右竖边拆两段：sep 开出可通行缺口——★ step23 Rev.2 有效范围
                      小幅放宽为 442−62·sep ~ 442+64·sep（sep=1：380–506），容纳
                      全身穿越（头顶最低 383、脚底 500），不再擦线。
                      ★ step24 Rev.2：两段随凝聚 1553–1555 淡去（gateEarFade），
                      完整迷迷 1557 起左耳不再被竖线贯穿；顶拱留开放回声 */}
                  <line x1={x + 220} y1={190} x2={x + 220} y2={442 - 62 * sep}
                    stroke="#C9A86B" strokeWidth={2.5} strokeLinecap="round"
                    opacity={(1 - sep * 0.7) * gateEarFade} />
                  <line x1={x + 220} y1={442 + 64 * sep} x2={x + 220} y2={440 + 65 * sep}
                    stroke="#C9A86B" strokeWidth={2.5} strokeLinecap="round"
                    opacity={(1 - sep * 0.5) * gateEarFade} />
                  {/* 内拱细线退低亮度（拱廊层次） */}
                  <path d={`M ${x + 16} 420 L ${x + 16} 196 C ${x + 40} 152, ${x + 180} 152, ${x + 204} 196`}
                    fill="none" stroke="#C9A86B" strokeWidth={1} opacity={0.25} />
                </>
              ) : (
                <>
                  <path d={`M ${x} 440 L ${x} 190 C ${x + 36} 138, ${x + 184} 138, ${x + 220} 190 L ${x + 220} 440`}
                    fill="#1E2A4A" stroke="#C9A86B" strokeWidth={2.5} strokeLinejoin="round" />
                  <path d={`M ${x + 16} 420 L ${x + 16} 196 C ${x + 40} 152, ${x + 180} 152, ${x + 204} 196`}
                    fill="none" stroke="#C9A86B" strokeWidth={1}
                    opacity={0.5 - sep * 0.2 * (boundaryOpen ? 1 : 0)} />
                </>
              )}
              {/* 画中物：树洞 / 同伴 / 水晶花与碎片 / 记忆的晶簇 / 双身影 / 泪滴 */}
              {i === 0 && (
                <g opacity={0.9}>
                  <path d={`M ${x + 52} 380 L ${x + 60} 300 C ${x + 66} 240, ${x + 154} 240, ${x + 160} 300 L ${x + 168} 380 Z`}
                    fill="#0E1424" stroke="#3A2E4C" strokeWidth={3} />
                  <ellipse cx={x + 110} cy={318} rx={30} ry={24} fill="#0A0E1C" />
                  <circle cx={x + 110} cy={322} r={5} fill={P2.pinkHi} opacity={0.9} />
                  <text x={x + 92} y={228} fontSize={16} fontFamily={FONT_MONO} fill={P2.ivoryDim}>( o.o )</text>
                </g>
              )}
              {i === 1 && (
                <g opacity={0.9}>
                  <PixelFigure x={x + 78} y={380} t={t} hair="#F3E9DC" cloth="#E8C9A0" scale={1.6} />
                  <PixelFigure x={x + 138} y={380} t={t} hair={P2.pinkHi} cloth={P2.pink} scale={1.6} flip />
                  <path d={`M ${x + 96} 300 Q ${x + 110} 282, ${x + 124} 300`} fill="none" stroke={P2.pinkHi} strokeWidth={2} opacity={0.6} />
                </g>
              )}
              {i === 2 && (
                <g opacity={0.9}>
                  {[0, 60, 120, 180, 240, 300].map((a) => (
                    <path key={a} d="M 0 -12 L -8 -22 L 0 -34 L 8 -22 Z"
                      fill="rgba(247,214,228,0.9)" stroke="#B87AA8" strokeWidth={1.6}
                      transform={`translate(${x + 110} 262) rotate(${a})`} />
                  ))}
                  <circle cx={x + 110} cy={262} r={7} fill="#FFF0F7" stroke="#C98BB4" strokeWidth={1.4} />
                  {/* 两枚碎片映着眼 */}
                  <ellipse cx={x + 66} cy={352} rx={13} ry={20} fill="rgba(247,214,228,0.85)" stroke="#B87AA8" strokeWidth={1.4}
                    transform={`rotate(-24 ${x + 66} 352)`} />
                  <circle cx={x + 66} cy={350} r={2.6} fill="#4A3B5C" />
                  <ellipse cx={x + 154} cy={352} rx={13} ry={20} fill="rgba(247,214,228,0.85)" stroke="#B87AA8" strokeWidth={1.4}
                    transform={`rotate(24 ${x + 154} 352)`} />
                  <circle cx={x + 154} cy={350} r={2.6} fill="#4A3B5C" />
                </g>
              )}
              {i === 3 && (
                <g opacity={0.9}>
                  <path d={`M ${x + 110} 396 C ${x + 104} 360, ${x + 116} 330, ${x + 110} 300`} fill="none" stroke="#9C8AB8" strokeWidth={3} />
                  {[[0, -14], [-9, -6], [9, -6], [-15, 2], [15, 2], [-8, 10], [8, 10], [0, 17]].map(([cx, cy], k) => (
                    <rect key={k} x={x + 110 + cx - 4.4} y={268 + cy - 4.4} width={8.8} height={8.8} rx={1.2}
                      fill={k % 2 === 0 ? P2.pinkHi : P2.lilacHi} opacity={0.9} />
                  ))}
                  <circle cx={x + 110} cy={268} r={4} fill="#FFF" />
                </g>
              )}
              {i === 4 && (
                <g opacity={0.9}>
                  <circle cx={x + 84} cy={300} r={13} fill={P2.pinkHi} />
                  <path d={`M ${x + 66} 372 C ${x + 64} 322, ${x + 74} 316, ${x + 84} 316 C ${x + 94} 316, ${x + 104} 322, ${x + 102} 372 Z`} fill={P2.pinkHi} opacity={0.8} />
                  <circle cx={x + 136} cy={288} r={12} fill="#F3E9DC" />
                  <path d={`M ${x + 118} 372 C ${x + 114} 322, ${x + 126} 310, ${x + 136} 310 C ${x + 146} 310, ${x + 158} 322, ${x + 154} 372 Z`} fill="#F3E9DC" />
                </g>
              )}
              {i === 5 && <g opacity={0.9}><path d={`M ${x + 110} 240 q 22 34 0 62 q -22 -28 0 -62`} fill="#6FA8DC" opacity={0.85} /></g>}
            </g>
          );
        })}

        {/* 白毛小身影（Q版，向右走；step23：1526 起连续越界——唯一主体，
            无换层无重复叠画）。
            ★ Rev.2：步态按 walking 门控（停顿收步只留呼吸）；
            1526 起渐显简洁腿脚，脚点落在地面 y=500 与影子对应（1394–1523 原形态不动）。
            ★ step24：1553–1557.5 原位淡出——同一脚点(1730,500)上由下方迷迷
            逐字凝聚接管（同位 alpha 交接），不是消失或换角色 */}
        {t >= WALKER_FROM && t < 1558 && (
          <g transform={`translate(${walkerX + crossX} 470)`}
            opacity={0.95 * (1 - S(t, 1553, 1557.5))}>
            <ellipse cx={0} cy={30} rx={19 + 4 * walking} ry={4.5} fill="#0B0812" opacity={0.3} />
            <g transform={`translate(0 ${gaitBob + breathBob})`}>
              <rect x={-16} y={-52} width={32} height={30} rx={8} fill="#F3E9DC" />
              <circle cx={0} cy={-64} r={14} fill="#FFF" />
              <circle cx={-4} cy={-66} r={2.2} fill="#4A3B5C" />
              <circle cx={4} cy={-66} r={2.2} fill="#4A3B5C" />
              {/* 腿脚：身体底 local448 → 脚点 local500（影子同层） */}
              <g opacity={S(t, 1526, 1528)}>
                <rect x={-10.5} y={-26} width={5.5} height={48} rx={2.7} fill="#FFF" opacity={0.92}
                  transform={`rotate(${legSwing} -8 -26)`} />
                <rect x={5} y={-26} width={5.5} height={48} rx={2.7} fill="#FFF" opacity={0.92}
                  transform={`rotate(${-legSwing} 8 -26)`} />
                <rect x={-14} y={25} width={12} height={5} rx={2.5} fill="#FFF" />
                <rect x={2} y={25} width={12} height={5} rx={2.5} fill="#FFF" />
              </g>
              <rect x={-24} y={-46} width={8} height={22} rx={4} fill="#FFF" opacity={0.9}
                transform={`rotate(${armSwing} -20 -46)`} />
              <rect x={16} y={-46} width={8} height={22} rx={4} fill="#FFF" opacity={0.9}
                transform={`rotate(${-armSwing} 20 -46)`} />
              <line x1={-18} y1={30} x2={18} y2={30} stroke="#FFF" strokeWidth={2} opacity={0.4} />
            </g>
          </g>
        )}

        {/* 同位粉紫微光（1552 跨过后渐显，step24 起随迷迷驻留并同位移动，
            1572–1573 随迷迷一起淡出；仍非新主体）——
            ★ Rev.2：本幕渐变是 a7wisp（此前误引 Act4 的 a4wisp，光点无定义） */}
        <circle cx={memX} cy={440} r={26 + 3 * Math.sin(t * 2)}
          fill="url(#a7wisp)" opacity={0.4 * S(t, 1552, 1554) * memFade} />

        {/* step24 迷迷（1552.8 逐字凝聚 → 1557.1 完成；FairyGlyph A 帧 listen，
            暗场 dark 配色）：长耳/耳根卷/额前卷毛/星形瞳/大尾巴/小爪——
            与白毛形态同位同状态 alpha 交接，完成后低幅呼吸＋短眨眼，
            经一小步（1558–1566，+55px）朝同行方向驻留间隙外侧；
            1572–1573 淡出给泪影让位。脚点连续贴地 y=500；
            左耳不穿门槛实线 x1655，尾巴经缺口开口区（380–506） */}
        <g opacity={memFade}>
          <ellipse cx={memX} cy={500} rx={40} ry={6} fill="#0B0812"
            opacity={0.3 * S(t, 1553, 1555)} />
          <g transform={`translate(0 ${Math.sin(t * 1.6) * -1.5})`}>
            <FairyGlyph t={t} start={MEM_START} x={memGX} y={memGY}
              size={MEM_SIZE} cps={MEM_CPS} pose="listen" dark />
          </g>
        </g>

        {/* step22 守望剪影：很淡的粉色无五官坐姿，固定在界面外左侧旧讲述位置——
            与白毛行动形态区别（同一人的不同存在方式，非第三主体）；
            不随行走离开；boundaryAt 开放期间保持。
            ★ step24：1572–1573 原位淡出（x262 不移动、不跟随走出），
            与迷迷一起给 1572.5 起的泪影与 1573 眼角泪滴让位 */}
        {boundaryOpen && (
          <g opacity={S(t, 1449.5, 1452) * 0.5 * memFade}>
            <ellipse cx={262} cy={492} rx={30} ry={8} fill="#E5B7C6" opacity={0.3} />
            <ellipse cx={262} cy={452} rx={32} ry={44} fill="#E5B7C6" opacity={0.45} />
            <circle cx={256} cy={398} r={14} fill="#E5B7C6" opacity={0.6} />
          </g>
        )}

        {/* 四因子记录卡：顺序阅读——当前项聚焦，读完/下一项出现即退场，不累积遮住画廊 */}
        <RecordCard t={t} at={1394} x={1000} y={72} text="「『智识』的发展方向，与创造『意识』并无交集，底层原理甚至是相悖的。」" w={560} goneAt={1401.6} />
        <RecordCard t={t} at={1402} x={1000} y={72} text="「没有『意识』，也就没有『心』的基础，无法拥有真正的感情。」" w={560} goneAt={1408.6} />
        <RecordCard t={t} at={1409} x={1000} y={72} text="「但这不妨碍因子学习、识别情感反应，并通过模仿，与生命进行沟通。这是一种客观的、没有『你我』之分的模式识别。」" w={640} goneAt={1421.6} />
        <RecordCard t={t} at={1422} x={1000} y={72} text="「但阴差阳错，踏上另一条命途的PhiLia093掌握了不同的力量……」" w={640} goneAt={1428.6} />
        <RecordCard t={t} at={1429} x={1000} y={72} text="「『记忆』：以自我为核心的，具备情感投射能力的共情机制。」" w={560} goneAt={1435.6} />
        <RecordCard t={t} at={1436} x={1000} y={72} text="「而『哀怜』是最接近这一行为的因子。或者，这就是她被选中的原因。」" w={640} gold goneAt={1444} />

        {/* 独白段的语义色彩洗 */}
        {wash(1463, 1473, "#1E2A4A", 0.32)}
        {wash(1473, 1483, "#3A2040", 0.3)}
        {wash(1483, 1491, "#4A1030", 0.38)}
        {/* 黑潮：升起的暗浪 */}
        {t >= 1491 && t < 1497 && (
          <path d={`M 0 ${560 - S(t, 1491, 1494) * 320} C 400 ${560 - S(t, 1491, 1494) * 320 - 60}, 900 ${560 - S(t, 1491, 1494) * 320 + 40}, 1920 ${560 - S(t, 1491, 1494) * 320 - 20} L 1920 718 L 0 718 Z`}
            fill="#0B0618" opacity={0.85} />
        )}
        {/* 烈火 */}
        {t >= 1496 && t < 1513 && (
          <rect width="1920" height="718" fill="#801818" opacity={S(t, 1496, 1498) * 0.3 * (1 - S(t, 1508, 1512))} />
        )}
        {/* 冻结的浪（1513-1518：毁灭停下脚步） */}
        {t >= 1513 && t < 1524 && (
          <path d="M 0 300 C 400 240, 900 340, 1920 280 L 1920 718 L 0 718 Z"
            fill="#801818" opacity={0.28 + 0.04 * Math.sin(t * 1.2)} />
        )}

        {/* 羽毛笔扫屏 1524-1525.5 */}
        {t >= 1524 && t < 1525.8 && (() => {
          const p = (t - 1524) / 1.8;
          return (
            <g opacity={Math.sin(p * Math.PI)}>
              <rect width="1920" height="718" fill={P2.bgPanel} opacity={0.5} />
              {[0, 1, 2].map((i) => (
                <path key={i} d={`M ${-300 + p * 2500} ${-80 + i * 150} l 560 190 l -64 44 l -560 -190 z`}
                  fill="rgba(242,167,184,0.4)" />
              ))}
            </g>
          );
        })()}

        {/* 1526–1552 故事的表层：纸面上有裂痕，背面透出深色笔迹（故事之外的挣扎） */}
        {t >= 1526 && t < 1553 && (
          <g opacity={S(t, 1526, 1528) * (1 - S(t, 1551, 1553))}>
            <rect x={330} y={170} width={1260} height={300} rx={10} fill="#FFF7EC" opacity={0.1} />
            {/* 背面透出的深色笔迹（反向、模糊） */}
            {[[420, 240], [700, 300], [1020, 220], [1300, 320], [560, 380], [1180, 390]].map(([tx, ty], i) => (
              <text key={i} x={tx} y={ty} fontSize={26} fontFamily={FONT_MONO} fill="#241A38"
                opacity={0.4} transform={`rotate(${i % 2 === 0 ? -4 : 3} ${tx} ${ty})`}>
                {["痛", "别离", "不敢说", "泪", "无人见", "碎"].map((w) => w)[i]}
              </text>
            ))}
            {/* 表层裂痕：细，被温柔盖着，但不消失 */}
            <path d="M 480 180 L 560 300 L 520 460 M 900 170 L 980 260 L 940 470 M 1360 180 L 1300 320 L 1340 460"
              fill="none" stroke="rgba(90,74,110,0.55)" strokeWidth={1.6} />
          </g>
        )}

        {/* 1553-1560 一本小小的书 */}
        <g opacity={S(t, 1553, 1554) * (1 - S(t, 1559.5, 1560.5))} transform="translate(960 420)">
          <path d="M -90 0 C -50 -16, -10 -16, 0 -8 C 10 -16, 50 -16, 90 0 L 90 26 C 50 12, 10 12, 0 20 C -10 12, -50 12, -90 26 Z"
            fill="rgba(255,241,249,0.14)" stroke="#E8C9A0" strokeWidth={1.6} />
          <line x1={0} y1={-8} x2={0} y2={20} stroke="#E8C9A0" strokeWidth={1.2} />
          <circle r={70} fill="url(#a7gold)" opacity={0.35} />
        </g>

        {/* 1561-1572 神明的柔软（远景巨大柔和轮廓） */}
        <g opacity={S(t, 1561, 1563) * (1 - S(t, 1585, 1588)) * 0.14}>
          <circle cx={960} cy={-160} r={560} fill="#FFE9F2" />
          <path d="M 180 614 C 420 220, 620 60, 960 60 C 1300 60, 1500 220, 1740 614 Z" fill="#FFF" opacity={0.6} />
        </g>

        {/* 返工③：模糊身形（无五官，保持神秘感）——
            拱窗让位后不是空白，泪滴从她的眼角出发；随涟漪扩散淡去，接 1595 白屏双身影 */}
        <filter id="a7soft" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="13" />
        </filter>
        <g opacity={S(t, 1572.5, 1574) * (1 - S(t, 1583, 1586)) * 0.62} filter="url(#a7soft)">
          <ellipse cx={890} cy={200} rx={64} ry={72} fill="#F5C3D0" />
          <path d="M 806 584 C 816 384, 846 296, 890 292 C 934 296, 964 384, 974 584 C 934 606, 846 606, 806 584 Z"
            fill="#F2A7B8" />
          <ellipse cx={890} cy={300} rx={46} ry={98} fill="#F7D3DD" opacity={0.7} />
          <ellipse cx={890} cy={162} rx={40} ry={26} fill="#F9DCE4" opacity={0.85} />
        </g>
        {/* 1573-1584 一滴湿润的眼泪 → 漾开最初的涟漪（涟漪起后泪滴落定消失） */}
        <g opacity={S(t, 1573, 1574) * (1 - S(t, 1582, 1583.5))}>
          <circle cx={dropX} cy={dropY} r={7 + Math.sin(t * 9) * (t < 1577 ? 1.6 : 0)} fill="#BFE3F2"
            style={{ filter: "drop-shadow(0 0 10px rgba(191,227,242,0.95))" }} />
          <circle cx={dropX + 2} cy={dropY - 3} r={2.4} fill="#FFFFFF" opacity={0.9} />
        </g>
        {ripple > 0 && (
          <g opacity={1 - S(t, 1594, 1595)}>
            {[0, 1, 2, 3].map((i) => {
              const r = (t - 1581 - i * 0.9) * 150;
              if (r <= 0) return null;
              return (
                <ellipse key={i} cx={960} cy={400} rx={Math.min(r, 940)} ry={Math.min(r * 0.24, 210)}
                  fill="none" stroke={i === 0 ? "#E8C9A0" : P2.pinkHi}
                  strokeWidth={i === 0 ? 3 : 1.8} opacity={Math.max(0, 0.8 - r / 900)} />
              );
            })}
          </g>
        )}
        {/* step25（E）★ cup-revision 追加：涟漪中的十二代表物——不闭合浅弧
            （近大远小、克制倒影），三组渐显（1585/1587/1589，每组0.6s），
            1591–1594 全 12 件稳定同屏；左右展开后相邻真实轮廓 ≥12px 间距。
            ★ 用户追加指示：中央昔涟碎晶体（Rev.2 曾补的两枚粉紫碎片＋眼/星光）
              整组删除，中央留白、不以另一昔涟物件替换；十二件角色映射与时序
              不变（详见 docs/plans/2026-10-13-cycle-step25-cup-revision.md）。
            金字(1590, y240–290)/LOG/原字幕/HUD 无挡 */}
        {t >= 1585 && <HeirMemorySymbols t={t} />}
        {/* 迷迷同行光点：从不闭合弧的右端缺口朝画外轻行（呼应开场 26s 光点、
            1552 同位微光；step24 的预留标记由此接管），1594.6 起随白屏收束 */}
        {t >= 1585 && (
          <g opacity={S(t, 1586, 1587)}>
            <circle cx={ARC_GAP.x + 106 * S(t, 1586, 1595)}
              cy={ARC_GAP.y - 16 * S(t, 1586, 1595)}
              r={14 + 2 * Math.sin(t * 2.4)} fill="url(#a7wisp)" opacity={0.7} />
            <circle cx={ARC_GAP.x + 106 * S(t, 1586, 1595)}
              cy={ARC_GAP.y - 16 * S(t, 1586, 1595)}
              r={4.5 + 0.8 * Math.sin(t * 2.4)} fill="#FFE9F2" />
          </g>
        )}

        {/* 1590-1594 金字 */}
        <g opacity={S(t, 1590, 1591.5)}>
          <text x={960} y={280} textAnchor="middle" fontSize={44} fill="#E8C9A0"
            fontFamily='"Songti SC",serif' letterSpacing={4}
            style={{ filter: "drop-shadow(0 0 16px rgba(232,201,160,0.85))" }}>
            是这故事里，所有的「记忆」。
          </text>
        </g>

        </g>

        {/* 1595-1596 白屏 + 双身影 */}
        <rect width="1920" height="718" fill="#FFFFFF"
          opacity={S(t, 1594.6, 1595.6)} />
        <g opacity={S(t, 1595.4, 1596.8) * 0.9}>
          <g transform="translate(880 400)">
            <circle cx={0} cy={-34} r={13} fill={P2.pinkHi} />
            <path d="M -18 24 C -20 -8, -10 -24, 0 -24 C 10 -24, 20 -8, 18 24 Z" fill={P2.pinkHi} opacity={0.8} />
          </g>
          <g transform="translate(1060 392)">
            <circle cx={0} cy={-58} r={12} fill="#F3E9DC" />
            <path d="M -20 30 C -24 -18, -12 -44, 0 -44 C 12 -44, 24 -18, 20 30 Z" fill="#F3E9DC" />
          </g>
        </g>
      </svg>

      {/* 片尾会话框（从 v5 的 211.5 挪来：全片只有一次） */}
      <div style={{
        position: "absolute", left: 1280, top: 368, width: 452, height: 196, borderRadius: 12,
        background: "rgba(20,12,28,0.9)", border: "1.2px solid rgba(242,167,184,0.75)",
        fontFamily: FONT_MONO, opacity: S(t, 1595.2, 1595.8),
      }}>
        <div style={{ position: "absolute", left: 28, top: 14, display: "flex", alignItems: "center" }}>
          <svg width={34} height={34} viewBox="-22 -22 44 44">
            {[[0, -14], [-9, -6], [9, -6], [-15, 2], [15, 2], [-8, 10], [8, 10], [0, 17]].map(([cx, cy], i) => (
              <rect key={i} x={cx - 3.6} y={cy - 3.6} width={7.2} height={7.2} rx={1}
                fill={i % 2 === 0 ? P2.pinkHi : P2.lilacHi} opacity={0.9} />
            ))}
            <rect x={-3.4} y={-3.4} width={6.8} height={6.8} fill="#FFFFFF" />
          </svg>
          <span style={{ fontSize: 18, color: P2.ivory, marginLeft: 12 }}>Philia093.exe · 会话已保存</span>
        </div>
        <div style={{ position: "absolute", left: 24, top: 62, fontSize: 17, color: P2.ivory, lineHeight: "30px" }}>
          <div>Session: #8128</div>
          <div>任务: ——（已由「爱」改写）</div>
          <div style={{ color: P2.pinkHi }}>心:   已找到 ✓</div>
        </div>
      </div>

      {/* 尾帧压暗（到 1597 截止） */}
      <rect width="1920" height="718" fill="#0B0812" opacity={t > 1596.85 ? 0.8 : 0} style={{ position: "absolute", top: 0, left: 0 }} />
    </AbsoluteFill>
  );
};
