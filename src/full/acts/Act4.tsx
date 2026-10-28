import React from "react";
import { AbsoluteFill, random, useCurrentFrame } from "remotion";
import { P2, FONT_MONO } from "../../v2/palette2";
import { FPS } from "../scriptFull";
import { S } from "../kit";
import { FairyGlyph } from "../scenes/FairyGlyph";
import { SavedMemoryPage } from "../scenes/SavedMemoryPage";
import { CageLines, Petals, RecordCard, Stars } from "./shared";
import { RuntimeErrorScene, ERROR_3_OF_3 } from "../scenes/RuntimeErrorScene";

/**
 * 第四幕 · 记忆的幼芽（493–848.5）
 * 494-526 笼边字符画（保存/学习）→ 527-529 黑屏重启 →
 * 530-551 异常(3/3)"新的...空白..." → 556-848 幼芽对话期（日/夜笼，658-672 守护，
 * 721 夜笼转场，779-792 智识/意识记录卡，805 白呼吸）
 * 517 起笼内角色＝共享 FairyGlyph 迷迷字符造型（任务书 step08）
 */

const SAVE_LETTERS = ["S", "A", "V", "E"];

export const Act4: React.FC = () => {
  const frame = useCurrentFrame();
  const t = 493 + frame / FPS;

  const day = (t >= 494 && t < 526.5) || (t >= 556 && t < 721) || (t >= 762 && t < 848.5);
  const night = t >= 721 && t < 756;
  const fairyGlow = S(t, 658, 660) * (1 - S(t, 673, 675));
  // 守护（658–672）：朝错误一侧回应（右倾）再回头面向笼外昔涟；不突破栏杆
  const lean = 16 * S(t, 658.5, 662) * (1 - S(t, 665, 668.5));
  // 姿态时间线（任务书 step08）：575 开心 C；658.5–668.5 伸爪 D 回应后回坐姿；
  // 728–748 她走后低头 E；748–756 伸爪向边界试探找「空白」（仍在笼内）；其余听讲 A/B
  const mood =
    t >= 575 && t < 583 ? "happy" :
    t >= 658.5 && t < 668.5 ? "reach" :
    t >= 728 && t < 737 ? "bow" :
    t >= 748 && t < 756 ? "reach" :
    t >= 795 && t < 802.5 ? "bow" :
    t >= 828 && t < 832 ? "happy" :
    t >= 836 && t < 840 ? "happy" :
    "listen";
  // step15：748 向右侧空白页小挪步 10–15px（纯时间连续，双脚在笼底，
  // 眼列 978.9/1008.6 与 k=1 栏 1053.5–1058.5 错开）
  const nightStep = 12 * S(t, 748, 749.5);
  // step13（总方案D 日间陪伴）：568 讲「钥匙/心里的门」时向她挪近 28px
  // （停靠 x=828，k=0 栏 957.5–962.5 与眼列 966.9/996.7 错开不劈眼）；
  // 纯时间连续保持到后续（658 守护/夜笼/762 回暖均基于新坐标），不跳回原点
  const fairyX = 800 + 28 * S(t, 568.5, 571) + nightStep;
  // step14 守护：649「为什么不开心」后先注意左侧工作页（2–3° 局部倾向，
  // 不镜像整层文字），653 擦除时看着它；658 起回正伸爪向昔涟
  const rot = -2.5 * S(t, 649.5, 650.5) * (1 - S(t, 657, 658));
  // step17 记忆入口：828「钥匙。门。故事。」对入口微倾观察（同 2–3° 手法）
  const rotEntry = -2.5 * S(t, 828, 829) * (1 - S(t, 831, 832));
  // 笼外昔涟：559 日间出现 → 719–721.5 夜笼前退场（留空位）→ 762 回暖恢复
  // （回暖提前 0.3s 起步＝纯灯光出场惯例，使 762 整秒帧可见；无剧透内容）→ 846 随幕退
  const outsideGlow = S(t, 559, 562) * (1 - S(t, 719, 721.5)) + S(t, 761.7, 764.7) * (1 - S(t, 846, 848.5));
  // 异常暗场（530–551）时笼内角色退背景，不与诊断面板争焦点
  const fairyDim = 1 - 0.72 * S(t, 530, 531.5) * (1 - S(t, 551, 552.5));

  return (
    <AbsoluteFill style={{ position: "absolute", top: 46, height: 718, overflow: "hidden" }}>
      <svg width="1920" height="718" viewBox="0 0 1920 718" preserveAspectRatio="none" style={{ display: "block" }}>
        <defs>
          <radialGradient id="a4wisp">
            <stop offset="0%" stopColor={P2.pinkHi} />
            <stop offset="100%" stopColor="rgba(242,167,184,0)" />
          </radialGradient>
        </defs>

        {/* 亮世界底 */}
        <rect width="1920" height="718" fill="#F2EDF4"
          opacity={(day ? 1 : 0) * S(t, 494, 496) * (1 - S(t, 847.5, 848.5))} />
        {/* 夜笼底 */}
        <rect width="1920" height="718" fill="#141230" opacity={S(t, 721, 723) * (1 - S(t, 755, 756.5))} />

        {(day || night) && <Stars t={t} n={night ? 30 : 14} />}
        {/* 延续第三幕：主体上移100px，给200%两角HUD留白。 */}
        <g transform="translate(0 30)">

        {/* step13 记忆页层次：故事留下的痕迹（疏朗 3 片，565–620 渐现，
            630–638 退背景——653 工作页既有行为不受影响；不盖耳尾/昔涟/LOG） */}
        {[
          { x: 250, y: 330, w: 100, h: 112, at: 565 },
          { x: 555, y: 285, w: 88, h: 98, at: 590 },
          { x: 1235, y: 300, w: 92, h: 102, at: 615 },
        ].map((pg, i) => {
          const o = S(t, pg.at, pg.at + 1.2) * (1 - S(t, 630, 638));
          if (o <= 0) return null;
          return (
            <g key={i} opacity={o * 0.55}>
              <rect x={pg.x} y={pg.y} width={pg.w} height={pg.h} rx={5}
                fill="rgba(255,252,247,0.7)" stroke={P2.lilac} strokeWidth={1} />
              {[0.3, 0.55].map((f, k) => (
                <line key={k} x1={pg.x + 12} y1={pg.y + pg.h * f + 8}
                  x2={pg.x + pg.w - 12} y2={pg.y + pg.h * f + 8}
                  stroke="#B9AEC6" strokeWidth={2} strokeLinecap="round" opacity={0.5} />
              ))}
            </g>
          );
        })}

        {/* 笼内外（任务书 step06）：后笼架 → 笼内小妖精 → 前栏杆 → 外侧昔涟 */}
        <CageLines t={t} opacity={S(t, 494, 496) * (1 - S(t, 847.5, 848.5))} dark={night} layer="back"
          heartGlow={day && !night ? S(t, 762, 765) : 0} />
        <Petals t={t} opacity={(day && !night ? 1 : 0.25) * S(t, 496, 498)} />

        {/* 笼内迷迷字符造型（FairyGlyph，任务书 step08 原位替换）：
            14×32 字格 size16（高 224），足线 y≈512 与笼底对齐（y=288），
            step13：568.5–571 向她挪近 28px（x 800→828，眼列与 k=0 栏错开），
            坐标纯时间连续保持到后续；姿态见 mood；暗场 dark；异常退背景 */}
        <g opacity={fairyDim}
          transform={`translate(${lean} ${Math.sin(t * 1.7) * 2}) rotate(${rot + rotEntry} ${fairyX + 100} ${500})`}>
          <FairyGlyph t={t} start={517} x={fairyX} y={288} size={16} cps={70}
            pose={mood} dark={night} />
        </g>

        {/* 前栏杆（k=-1,0,1）重绘于角色之上：k=0 栏压过腹部线与小星，眼睛（列4/6）完好 */}
        <CageLines t={t} opacity={S(t, 494, 496) * (1 - S(t, 847.5, 848.5))} dark={night} layer="front" />

        {/* step17 记忆入口（809–848.5）：她的故事回声——纸面折线门框+空白内面，
            非物理开笼（迷迷仍在笼内、栏杆完整、无角色穿越）；819 内光缓亮、
            822 少量粉紫晶体折面（故事想象，不画蓝/不画巨大花/不在本段完成
            水晶花剧情）；828 小钥匙纸光落到页边；845–848.5 收束顺接 Act5 */}
        <g opacity={S(t, 809, 811.5) * (1 - S(t, 845, 848.5))}>
          {/* 页边 2–3 层 */}
          {[0, 1, 2].map((i) => (
            <rect key={i} x={366 + i * 9} y={278 - i * 6} width={22 + i * 4}
              height={222 - i * 8} rx={4} fill="rgba(255,252,247,0.5)"
              stroke={P2.lilac} strokeWidth={1} opacity={0.7 - i * 0.12} />
          ))}
          {/* 门框形折线（外框/内框） */}
          <path d={`M 420 500 L 420 300 Q 420 278 442 278 L 578 278 Q 600 278 600 300 L 600 500`}
            fill="none" stroke={P2.lilac} strokeWidth={1.6} opacity={0.8} />
          <path d={`M 448 500 L 448 316 Q 448 300 466 300 L 554 300 Q 572 300 572 316 L 572 500`}
            fill="none" stroke={P2.lilac} strokeWidth={1.1} opacity={0.55} />
          {/* 空白内面 + 819「明天/黎明」淡粉象牙光缓亮 */}
          <rect x={456} y={316} width={108} height={168} fill="#FFF6EA"
            opacity={0.12 + 0.22 * S(t, 819, 824)} />
          {/* 822 少量粉紫晶体折面（故事想象，不大不蓝） */}
          <g opacity={S(t, 822, 826) * 0.55}>
            <path d={`M 486 366 L 510 344 L 522 372 L 498 384 Z`} fill="rgba(242,167,184,0.5)"
              stroke={P2.lilac} strokeWidth={1} />
            <path d={`M 522 372 L 546 352 L 556 380 L 534 392 Z`} fill="rgba(201,163,220,0.45)"
              stroke={P2.lilac} strokeWidth={1} />
          </g>
          {/* 828 小钥匙形纸光落到页边（短距、缓落） */}
          <g opacity={S(t, 828, 828.4) * (1 - S(t, 831.5, 832))}
            transform={`translate(0 ${76 * S(t, 828.4, 831.5)})`}>
            <circle cx={500} cy={380} r={8} fill="none" stroke="#FFD9E0" strokeWidth={2.5} />
            <line x1={500} y1={388} x2={500} y2={412} stroke="#FFD9E0" strokeWidth={2.5}
              strokeLinecap="round" />
            <line x1={500} y1={404} x2={508} y2={404} stroke="#FFD9E0" strokeWidth={2.5}
              strokeLinecap="round" />
          </g>
        </g>

        {/* 笼外昔涟（step13 坐姿）：柔光剪影无五官，559–562 轻轻坐下——
            身体变宽变矮、头向笼内倾 6px，坐垫影与地面相连；始终在笼右侧外部
            （x≈1394 > 笼右缘 1252）；719–721.5 夜笼前退场留空位，762 回暖恢复 */}
        <g opacity={outsideGlow * 0.9}>
          <circle cx={1400} cy={445} r={60} fill="url(#a4wisp)"
            opacity={0.5 + 0.15 * S(t, 658, 660) * (1 - S(t, 672, 675))} />
          <ellipse cx={1396} cy={505} rx={30 * S(t, 559, 562) + 6} ry={5}
            fill="#E5B7C6" opacity={0.18 * S(t, 559, 562)} />
          <ellipse cx={1400 - 4 * S(t, 559, 562)} cy={467 + 8 * S(t, 559, 562)}
            rx={26 + 8 * S(t, 559, 562)} ry={40 - 10 * S(t, 559, 562)}
            fill={P2.pinkHi} opacity={0.5} />
          <circle cx={1400 - 6 * S(t, 559, 562)} cy={415 + 6 * S(t, 559, 562)}
            r={15} fill={P2.pinkHi} opacity={0.75} />
        </g>

        {/* step15 空位：坐垫影+余光（721.5–756）——明显是空位而非半透明人，
            不重画她的头/身体；753–756 随白呼吸前退场 */}
        <g opacity={S(t, 721.3, 722.5) * (1 - S(t, 753, 756))}>
          <ellipse cx={1396} cy={505} rx={30} ry={5} fill="#E5B7C6" opacity={0.14} />
          <circle cx={1398} cy={488} r={26} fill="url(#a4wisp)" opacity={0.1} />
        </g>

        {/* step15 空白记忆页（笼内右侧小页边，90–130px 淡粉象牙轮廓，
            大片空白＝寻找可续写之处；748–750 淡入、754.5–756.5 白呼吸前退场；
            不是物理开笼，栏杆完整、角色仍在内部） */}
        <g opacity={S(t, 748, 750) * (1 - S(t, 754.5, 756.5))}>
          <rect x={1140} y={300} width={100} height={120} rx={5}
            fill="rgba(242,232,242,0.12)" stroke="#D8C0CE" strokeWidth={1.1} />
          <line x1={1152} y1={398} x2={1212} y2={398} stroke="#B9AEC6"
            strokeWidth={2} opacity={0.3} strokeLinecap="round" />
        </g>

        {/* step15 空位余光引向页边（748–755）：由空位漂向空白页缘后消散 */}
        <g opacity={S(t, 748, 749) * (1 - S(t, 754, 755))}>
          <circle cx={1390 - 230 * S(t, 748.5, 753)} cy={490 - 115 * S(t, 748.5, 753)}
            r={10} fill="url(#a4wisp)" opacity={0.6} />
        </g>

        {/* S·A·V·E（step12）：508 起逐个浮现（不早于底部原文 508），509.6 起
            依次升起短距落入记忆页成为四个小印记——「这一页被保存」；
            511.5 前全部落位，不永久漂浮。保存页见 SavedMemoryPage */}
        {SAVE_LETTERS.map((L, i) => {
          const at = 508.3 + i * 0.6;   // 晚于底部原文 S 的起显（TYPE_DELAY 后），不提前
          const rise = 509.6 + i * 0.35;
          const p = S(t, rise, rise + 0.6);
          const fx = 950 + i * 50, fy = 300 + (i % 2) * 7;      // 浮现位
          const ix = 940 + i * 50, iy = 207;                     // 页上印记位
          const o = S(t, at, at + 0.3) * (1 - S(t, rise + 0.45, rise + 0.6));
          if (o <= 0) return null;
          return (
            <text key={i} x={fx + (ix - fx) * p} y={fy + (iy - fy) * p}
              fontSize={52 - 26 * p} fontFamily={FONT_MONO} fill={P2.pinkHi}
              opacity={o} textAnchor="middle">{L}</text>
          );
        })}
        {/* 保存页（step12）：497 注释后生成（含上一段记忆小压痕），
            510.2–511.3 接住落入的 S/A/V/E 印记，512 后平静留下，
            525–527 淡出接原暗场（530 系统运行/534 第三异常既有代码不动） */}
        <SavedMemoryPage t={t} x={900} y={60} />

        {/* 异常 3/3（530–551）：诊断主体由 RuntimeErrorScene 承担；
            旧 shared.ErrorTheater 不再使用（shared 本身不动，免影响其他幕） */}
        <g opacity={S(t, 530, 531.5) * (1 - S(t, 550.2, 551.4))}>
          <rect width="1920" height="614" fill="#0B0812" opacity={0.5} />
          <path d="M 300 0 L 620 240 L 520 614" stroke="#FF9B8A" strokeWidth={2} fill="none"
            opacity={0.22 + 0.1 * Math.sin(t * 9)} />
          <path d="M 1660 0 L 1330 260 L 1450 614" stroke="#FF9B8A" strokeWidth={2} fill="none"
            opacity={0.18 + 0.08 * Math.sin(t * 7 + 1)} />
        </g>

        {/* step14 保存页回声（较后层，明暗与工作页错位）：已保存痕迹仍在——
            653 只擦当前工作页，回声不随之消失；717–721 夜笼前退场留余韵。
            复用第 12 处树洞/朋友小压痕 */}
        <g opacity={S(t, 645, 647) * (1 - S(t, 717, 721))}>
          <rect x={585} y={370} width={170} height={175} rx={7}
            fill="rgba(255,252,247,0.55)" stroke={P2.lilac} strokeWidth={1} opacity={0.85} />
          <g opacity={0.35} stroke="#B9AEC6" strokeWidth={1.3} fill="none">
            <path d={`M 601 396 L 617 396 L 627 414 L 622 430 L 598 430 L 593 412 Z`} />
            <circle cx={688} cy={404} r={11} />
            <circle cx={684.5} cy={402} r={1.4} fill="#B9AEC6" stroke="none" />
            <circle cx={691.5} cy={402} r={1.4} fill="#B9AEC6" stroke="none" />
          </g>
          <line x1={600} y1={452} x2={724} y2={452} stroke="#B9AEC6" strokeWidth={2.5}
            strokeLinecap="round" opacity={0.3} />
          <line x1={600} y1={472} x2={688} y2={472} stroke="#B9AEC6" strokeWidth={2.5}
            strokeLinecap="round" opacity={0.3} />
        </g>

        {/* 反复格式化（653 红）：当前工作页的字迹被抹去——但已保存的微弱痕迹还在。
            step14：工作页挪到角色左侧独立区域（x620，不再挡迷迷尾巴 x828+） */}
        {(() => {
          const pageO = S(t, 649, 651) * (1 - S(t, 676, 679));
          const wipe = S(t, 653, 655);          // 抹去当前字迹
          if (pageO <= 0) return null;
          return (
            <g opacity={pageO} transform="translate(620 400)">
              <rect width={190} height={128} rx={6} fill="#FFFDF6" opacity={0.85}
                stroke="#C9B8A8" strokeWidth={1.5} />
              {[0, 1, 2, 3, 4].map((i) => {
                const ghost = 0.55 * (1 - wipe) + 0.1;  // 抹后只剩微弱痕迹（为何还能学）
                return <line key={i} x1={16} y1={26 + i * 20} x2={16 + (i % 2 === 0 ? 150 : 118)} y2={26 + i * 20}
                  stroke="#8A7A98" strokeWidth={2.4} opacity={ghost} strokeLinecap="round" />;
              })}
              {wipe > 0 && wipe < 1 && (
                <line x1={-10 + wipe * 210} y1={-8} x2={30 + wipe * 210} y2={136}
                  stroke="#FF9B8A" strokeWidth={3} opacity={0.7} />
              )}
              <text x={4} y={-10} fontSize={12} fontFamily={FONT_MONO} fill={P2.ivoryDim}
                opacity={0.8 * (1 - S(t, 663, 665))}>working page · δ-me13</text>
            </g>
          );
        })()}

        {/* step16 读记录（762–804）：记录移到角色左侧独立阅读区（x110–710，
            不挡迷迷脸/尾巴 x828+，不入 LOG y≤83 / HUD / 字幕）；引文原样
            不提前（779/787 逐字）；779 第一条聚焦，787 第二条聚焦时第一条
            退低亮度；793 附近一起退下。共享 RecordCard 默认行为未改。 */}
        <g opacity={1 - 0.5 * S(t, 787.2, 788)}>
          <RecordCard t={t} at={779} x={110} y={200} w={560} goneAt={793}
            text="「『智识』的发展方向，与创造『意识』并无交集，底层原理甚至是相悖的。」" />
        </g>
        <RecordCard t={t} at={787} x={150} y={318} w={560} goneAt={793}
          text="「没有『意识』，也就没有『心』的基础，无法拥有真正的感情。」" />

        {/* 768「爱→昔涟→空白」小压痕联系：三个小而稀疏的痕迹（非结论、
            非掌握勾号），768–790 温和浮现后退净 */}
        {[
          { x: 745, at: 768, ch: "♡" },
          { x: 778, at: 768.5, ch: "✿" },
          { x: 806, at: 769, ch: "□" },
        ].map((tr, i) => {
          const o = S(t, tr.at, tr.at + 0.8) * (1 - S(t, 788, 790)) * 0.4;
          if (o <= 0) return null;
          return (
            <text key={i} x={tr.x} y={258} fontSize={18} fontFamily={FONT_MONO}
              fill="#C99DAF" opacity={o}>{tr.ch}</text>
          );
        })}

        {/* 收束：白呼吸 805-808 + 幕末渐暗 */}
        <rect width="1920" height="718" fill="#F7F3F0" opacity={S(t, 805, 805.6) * (1 - S(t, 807.6, 808.2)) * 0.55} />
        </g>
        {/* step13：556–637 日光缓慢变暖（克制局部光，无写实贴图/闪烁） */}
        <rect width="1920" height="718" fill="#FFE9D2"
          opacity={S(t, 556, 570) * (1 - S(t, 630, 638)) * 0.04} />

        {/* step16：795「不懂」光稍收（微暗、803 恢复，非毁灭预兆） */}
        <rect width="1920" height="718" fill="#141230"
          opacity={S(t, 795, 796) * (1 - S(t, 802.5, 803.5)) * 0.06} />
        <rect width="1920" height="718" fill="#0B0812" opacity={S(t, 846, 848.4) * 0.55} />
      </svg>

      {/* 守护时刻（658–672）：微光跟随笼内迷迷造型坐标（step13 后中心≈986），
          旧顶部重复大字降到不抢焦点（step14）；随 lean 朝错误侧轻回应再回头 */}
      <svg width={1920} height={718} style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none", opacity: fairyGlow }}>
        <circle cx={986 + lean} cy={300} r={90} fill="url(#a4wisp)" opacity={0.55} />
        <text x={830 + lean} y={162} fontFamily={FONT_MONO} fontSize={13} fill={P2.pinkHi} opacity={0.45}>
          不许它。打断你。
        </text>
      </svg>
      {/* 错误剧场 534–551：可读终端诊断面板（第三次异常复用，见任务书 step03） */}
      <RuntimeErrorScene {...ERROR_3_OF_3} t={t} compact />
    </AbsoluteFill>
  );
};
