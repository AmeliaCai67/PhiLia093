import React from "react";
import { AbsoluteFill, random, useCurrentFrame } from "remotion";
import { P2, FONT_MONO } from "../../v2/palette2";
import { FPS } from "../scriptFull";
import { S, AsciiArt, AsciiSprite } from "../kit";
import { FairyGlyph } from "../scenes/FairyGlyph";
import { MemoryPage } from "../scenes/MemoryPage";
import { RuntimeErrorScene, ERROR_2_OF_3 } from "../scenes/RuntimeErrorScene";
import { barPath, barWidth, barBaseOpacity, archPath, baseFrontArc } from "../scenes/cageGeometry";

/**
 * 第三幕 · 查找「记录」（214–493）
 * A 214–290 记忆检索：搜索词 + 三张记录卡 + 关联涟漪（它的内心长这样）
 * B 290–310 错误剧场：异常(2/3) 对象名:"天真的…梦…"（选节选信息→忽略继续）
 * C 311–432 小昔涟告别：白光花田，线稿鸟笼，字符画背影，红字百分比，笼心复燃
 * D 433–493 童年歌谣：树洞 + 字符画小妖精首秀 + 一二三四五六七♪ 哆来咪发嗦啦嘻♪
 */

const SHE_BACK = `   .-~~~-.
  (       )
   |     |
  /|     |\\
 d |.__.| b`;

/** 笼内小妖精（记忆实体）：现有小妖精的简化坐姿，两帧眨眼（任务书 step05：
 *  不提前替换为结尾完整迷迷，不加标签/第三人物） */
const FAIRY_IN_A = `  (\\.-./)
  ( o.o )
 /|   |\\
  d   b`;
const FAIRY_IN_B = `  (\\.-./)
  ( -.- )
 /|   |\\
  d   b`;
/** step10「我在」回应姿态：朝左（笼外昔涟方向）轻抬左爪——手写左爪变体，
 *  不用 scaleX(-1)（避免反字）；脸行/双脚原点不变 */
const FAIRY_IN_REACH_L = `  (\\.-./)
  ( o.o )
(')   |\\
  d   b`;
/** step10「桃子。开心。」放松帧（^.^ 眼，身体/脚不动） */
const FAIRY_IN_HAPPY = `  (\\.-./)
  ( ^.^ )
 /|   |\\
  d   b`;

const TREE_HOLE = `   .-~~~~-.
  /         \\
 |     __    |
 |    /  \\   |
  \\   \\__/   /
   '---------'`;

const RECORD_CARDS: { text: string; x: number; y: number; at: number }[] = [
  { text: "电信号序列：PoleMos600。路径：纷争。", x: 620, y: 300, at: 244 },
  { text: "电信号序列：SkeMma720。路径：理性。", x: 620, y: 420, at: 257 },
  { text: "电信号序列：PhiLia093……", x: 1240, y: 372, at: 271 },
];

const NOTES = ["一", "二", "三", "四", "五", "六", "七"];
const SOLFA = ["哆", "徕", "咪", "发", "嗦", "啦", "嘻"];

/** step11 七个字符朋友：昔涟故事里的角色（同风格圆脸+小爪，脸谱细微区分，
 *  非迷迷克隆、无名字无设定）；3 行 × size17 ≈ 51px 高 */
const FRIEND_FACES = [
  "( o.o )",
  "( -.- )~",
  "( ^.^ )",
  "( @.@ )o",
  "( o.o )'",
  "( =.= )",
  "( ^o^ )~",
];
const friendArt = (face: string, armUp: boolean) =>
  `  ${face}\n${armUp ? "('   |\\" : " /|   |\\"}\n   d b`;

/** step11 Rev.2 记忆树：弯干 + 两根分叉枝 + 不规则树冠轮廓（绘本细线）。
 *  outline=false 远层淡色剪影（粗笔填充）；true 中层描线。原点在树脚 (x,512)。 */
const TreeSketch: React.FC<{
  x: number; h: number; lean: number; s?: number; outline?: boolean; o: number;
}> = ({ x, h, lean, s = 1, outline, o }) => {
  const ink = outline ? P2.lilac : "rgba(201,184,232,0.5)";
  const canopyFill = outline ? "none" : "rgba(233,178,204,0.4)";
  return (
    <g transform={`translate(${x} 512) scale(${s})`} opacity={o}>
      <path d={`M 0 0 C ${lean} ${-h * 0.38}, ${lean + 8} ${-h * 0.62}, ${lean * 0.3} ${-h}`}
        fill="none" stroke={ink} strokeWidth={outline ? 2 : 7} strokeLinecap="round" />
      <path d={`M ${lean * 0.35} ${-h * 0.58} C ${lean * 0.3 - 12} ${-h * 0.68}, -16 ${-h * 0.74}, -24 ${-h * 0.82}`}
        fill="none" stroke={ink} strokeWidth={outline ? 1.6 : 4.5} strokeLinecap="round" />
      <path d={`M ${lean * 0.4} ${-h * 0.48} C ${lean * 0.4 + 14} ${-h * 0.6}, 20 ${-h * 0.68}, 28 ${-h * 0.76}`}
        fill="none" stroke={ink} strokeWidth={outline ? 1.6 : 4.5} strokeLinecap="round" />
      <path d={`M -40 ${-h - 16} Q -52 ${-h - 34} -30 ${-h - 44} Q -26 ${-h - 62} -4 ${-h - 56} ` +
        `Q 16 ${-h - 66} 30 ${-h - 50} Q 52 ${-h - 44} 44 ${-h - 24} Q 56 ${-h - 8} 30 ${-h - 6} ` +
        `Q 4 ${-h - 14} -14 ${-h - 6} Q -34 ${-h - 2} -40 ${-h - 16} Z`}
        fill={canopyFill} stroke={outline ? P2.lilac : "none"} strokeWidth={outline ? 1.3 : 0}
        opacity={outline ? 0.55 : 1} />
    </g>
  );
};

export const Act3: React.FC = () => {
  const frame = useCurrentFrame();
  const t = 214 + frame / FPS;
  // 返工①：奖励函数候选框（与 4:45「哀、矮、爱……桃子 = 爱？」同步；原第一幕 92.5 的框移来）
  const a284 = 284.5;
  // step09（总方案D）：338 她开始不安——昔涟动作停顿、笼内实体观察后缓慢靠近
  const pauseAnx = S(t, 338, 338.6) * (1 - S(t, 349, 350));   // 338–349 观察/靠近期：双方动作静止
  const approach = 1 - Math.pow(1 - S(t, 344.5, 348.5), 2);   // 缓慢靠近（easeOut）
  const fairyX = 850 - 88 * approach;                          // 靠近 88px，停靠 x=762（眼睛避开 k=−1 栏）
  const fairyFade = 1 - S(t, 431, 433);                        // 笼内实体退场包络
  // step10「我在」双向回应（400–432）：实体朝左抬爪→412 放松→416 收住；
  // 昔涟 406.5–408.5 向内倾身 28px（仍完整在笼外，不抖动）；431–433 随段退场
  const spriteArt =
    t >= 400.3 && t < 412 ? FAIRY_IN_REACH_L :
    t >= 412 && t < 416 ? FAIRY_IN_HAPPY :
    Math.floor(t / 2.8) % 2 === 0 ? FAIRY_IN_A : FAIRY_IN_B;
  const herLean = 28 * S(t, 406.5, 408.5);                     // 倾身：416 后保持，不回抖
  const rcCur = t < a284 + 1.3 ? 0 : t < a284 + 2.1 ? 1 : 2;
  const rcChosen = S(t, a284 + 2.7, a284 + 3.3);
  const rcRows: [string, string][] = [["I", "「自我」"], ["AI", "「人工智能」"], ["哀", "「哀怜」"]];
  const rcGlyph = (i: number) => (rcCur === i && rcChosen < 0.5 ? "❯" : "");

  return (
    <AbsoluteFill style={{ position: "absolute", top: 46, height: 718, overflow: "hidden" }}>
      <svg width="1920" height="718" viewBox="0 0 1920 718" preserveAspectRatio="none" style={{ display: "block" }}>
        <defs>
          <radialGradient id="a3wisp">
            <stop offset="0%" stopColor={P2.pinkHi} />
            <stop offset="100%" stopColor="rgba(242,167,184,0)" />
          </radialGradient>
          <radialGradient id="a3warm">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="45%" stopColor={P2.pinkHi} />
            <stop offset="100%" stopColor="rgba(242,167,184,0)" />
          </radialGradient>
        </defs>

        {/* 亮世界底（全幅，不随场景下移） */}
        <rect width="1920" height="718" fill="#F2EDF4"
          opacity={S(t, 313, 316.5) * (1 - S(t, 431, 434))} />
        <rect width="1920" height="718" fill="#F4E9EC"
          opacity={S(t, 433, 436) * (1 - S(t, 491, 493.5))} />
        {/* 为200%两角HUD保留底部区域，整组上移100px；人物/笼子相对关系不变。 */}
        <g transform="translate(0 30)">

        {/* 星尘（常驻底色） */}
        {Array.from({ length: 22 }).map((_, i) => (
          <circle key={i} cx={random(`s3${i}`) * 1920} cy={30 + random(`s3y${i}`) * 480}
            r={1 + random(`s3r${i}`)} fill={P2.ivoryDim}
            opacity={(0.18 + 0.15 * Math.abs(Math.sin(t * 0.8 + i))) * (1 - S(t, 313, 316))} />
        ))}

        {/* ── A · 记忆检索 214–290 ── */}
        <g fontFamily={FONT_MONO} opacity={S(t, 240, 241.5) * (1 - S(t, 289, 291))}>
          {/* 搜索词 */}
          <g transform={`translate(960 ${t < 244 ? 280 : 190})`} opacity={t < 244 ? 1 : 0.85}
            style={{ transition: "none" }}>
            <text textAnchor="middle" fontSize={t < 244 ? 58 : 40} fill="#E8C9A0" fontFamily='"Songti SC",serif'>「记录」</text>
            <rect x={92} y={16} width={20} height={t < 244 ? 42 : 30} fill="#E8C9A0"
              opacity={0.5 + 0.5 * Math.abs(Math.sin(t * 3))} />
          </g>
          {/* 三张记录卡：一次只有一个焦点——旧项在新项出现时退入背景 */}
          {RECORD_CARDS.map((c, i) => {
            const o = S(t, c.at, c.at + 0.6);
            const nextAt = RECORD_CARDS[i + 1]?.at ?? 290;
            const focus = 1 - S(t, nextAt, nextAt + 0.6) * 0.72; // 失焦变暗、不消失（归入背景）
            return (
              <g key={i} opacity={o * focus} transform={`translate(${c.x} ${c.y + (1 - o) * 14})`}>
                <rect width={470} height={78} rx={10} fill="rgba(255,255,255,0.04)"
                  stroke={P2.lilac} strokeWidth={i === 2 ? 1.8 : 1.2} opacity={0.75} />
                <text x={20} y={30} fontSize={14} fill="#E8C9A0" letterSpacing={4}>记 录</text>
                <text x={20} y={58} fontSize={19} fill={P2.ivory}>{c.text.slice(0, Math.max(0, Math.floor((t - c.at - 0.3) * 16)))}</text>
              </g>
            );
          })}
          {/* 关联涟漪：卡下方的联想词 */}
          <g opacity={S(t, 251, 251.5) * (1 - S(t, 257, 258))}>
            <text x={660} y={412} fontSize={18} fill={P2.pinkHi}>↳ 关联：粉蒸 <tspan fill={P2.ivoryDim}>→ 注释：好吃</tspan></text>
          </g>
          <g opacity={S(t, 264, 264.5) * (1 - S(t, 271, 272))}>
            <text x={660} y={532} fontSize={18} fill={P2.pinkHi}>↳ 关联：梨。杏。 <tspan fill={P2.ivoryDim}>→ 注释：都是花</tspan></text>
          </g>
          <g opacity={S(t, 276, 276.5)}>
            <text x={1240} y={484} fontSize={18} fill={P2.pinkHi}>↳ 关联：哀、矮、爱……</text>
          </g>
        </g>
        {/* 桃子 = 爱？（检索的结论，独立浮现） */}
        <g fontFamily={FONT_MONO} opacity={S(t, 284, 285) * (1 - S(t, 289, 291))}>
          <text x={960} y={536} textAnchor="middle" fontSize={36} fill={P2.pinkHi}
            opacity={0.6 + 0.4 * Math.abs(Math.sin(t * 2.2))}>注释：桃子 = 爱？</text>
        </g>
        {/* 奖励函数候选框（返工①：自第一幕 92.5 移来，此刻他选了「爱」） */}
        <g fontFamily={FONT_MONO} opacity={S(t, a284, a284 + 0.5) * (1 - S(t, a284 + 5.7, a284 + 6.5))}>
          <rect x={80} y={252} width={380} height={222} rx={12} fill="rgba(14,10,24,0.72)"
            stroke={P2.lilac} strokeWidth={1} opacity={0.9} />
          <text x={104} y={286} fontSize={16} fill={P2.ivoryDim} letterSpacing={1}>inverse_rl · 奖励函数候选 ⋯</text>
          {rcRows.map((r, i) => {
            const isCur = rcCur === i && rcChosen < 0.5;
            const dim = rcChosen > 0.5 ? 0.35 : 1;
            return (
              <g key={r[0]} opacity={dim}>
                <text x={106} y={322 + i * 34} fontSize={18} fill={isCur ? P2.pinkHi : P2.ivoryFaint}>{rcGlyph(i)}</text>
                <text x={132} y={322 + i * 34} fontSize={18} fill={P2.ivory}>{r[0]}</text>
                <text x={190} y={322 + i * 34} fontSize={18} fill={P2.ivoryDim}>{r[1]}</text>
              </g>
            );
          })}
          <g opacity={rcChosen}>
            <text x={106} y={322 + 3 * 34} fontSize={19} fill={P2.pinkHi}>❯</text>
            <text x={132} y={322 + 3 * 34} fontSize={20} fill={P2.pinkHi}>爱</text>
            <text x={190} y={322 + 3 * 34} fontSize={19} fill={P2.pinkHi}>—— ✓</text>
          </g>
          <text x={104} y={452} fontSize={14} fill={P2.ivoryDim} opacity={S(t, a284 + 3.5, a284 + 4) * 0.95}>
            不是推演的必然，是被温暖吸引
          </text>
        </g>

        {/* ── B · 错误剧场 290–310（诊断主体由 RuntimeErrorScene 承担）── */}
        <g opacity={S(t, 290, 292) * (1 - S(t, 309, 311))}>
          <rect width="1920" height="718" fill="#0B0812" opacity={0.5} />
          <path d="M 300 0 L 620 240 L 520 614" stroke="#FF9B8A" strokeWidth={2} fill="none"
            opacity={0.22 + 0.1 * Math.sin(t * 9)} />
          <path d="M 1660 0 L 1330 260 L 1450 614" stroke="#FF9B8A" strokeWidth={2} fill="none"
            opacity={0.18 + 0.08 * Math.sin(t * 7 + 1)} />
        </g>

        {/* ── C · 小昔涟告别 311–433（白光花田）── */}
        {/* 笼内外位置（任务书 step05，全部组内局部坐标）：
            后层笼架 → 笼内小妖精（记忆实体）→ 前栏杆 → 笼外昔涟。
            内侧角色与笼底同地面（足线 y≈507），不悬空不外出；
            433 故事页切换时一起退场（431–433 淡出，修正原 SHE_BACK 泄漏）。 */}
        <g opacity={S(t, 315, 318) * (1 - S(t, 431, 434))}>
          {/* 后层笼架：顶拱 + 远侧栏（k=±2,±3）+ 笼底（几何同源 cageGeometry） */}
          {[-3, -2, 2, 3].map((k) => (
            <path key={k} d={barPath(k)}
              fill="none" stroke={P2.lilac} strokeWidth={barWidth(k)}
              strokeLinecap="round" opacity={barBaseOpacity(k)} />
          ))}
          <path d={archPath()} fill="none"
            stroke={P2.lilac} strokeWidth={4} strokeLinecap="round" opacity={0.5} />
          <ellipse cx={960} cy={512} rx={292} ry={16} fill="none" stroke={P2.lilac} strokeWidth={2.5} opacity={0.45} />

          {/* 笼内小妖精：简化字符稿（记忆实体），坐笼底、朝左望向笼外昔涟。
              step09 Rev.2（QA 返修）：删除双副本与 z 交接——单一角色始终在
              前栏杆之后；338–344 观察停顿（呼吸静止），344.5–348.5 缓慢向她
              靠近 88px（easeOut，移动中经栏为短暂真实遮挡），停靠 x=762 使
              k=−1 栏落右耳外缘（row0 `/`），眼睛（列 4/6）全程不被劈开；
              双脚不离开笼底；349 起呼吸恢复。431–433 随故事页退场。 */}
          <g opacity={fairyFade}
            transform={`translate(${fairyX - 850} ${Math.sin(t * 1.8) * 2 * (1 - pauseAnx)})`}>
            <AsciiArt art={spriteArt}
              x={850} y={421} size={22} color="#4A3B5C" t={t} start={318.5} cps={30} />
          </g>

          {/* 前栏杆（k=-1,0,1）重绘于角色之上：真实遮挡（始终在前，无换层） */}
          {[-1, 0, 1].map((k) => (
            <path key={k} d={barPath(k)}
              fill="none" stroke={P2.lilac} strokeWidth={barWidth(k)}
              strokeLinecap="round" opacity={barBaseOpacity(k)} />
          ))}
          <path d={`M 668 512 A 292 16 0 0 0 1252 512`} fill="none"
            stroke={P2.lilac} strokeWidth={2.5} opacity={0.45} />

          {/* step10「我在」（400）：原笼心单光团转译为局部双向光——
              内侧光从实体处向左、外侧光从昔涟处向右，隔着栏杆相向靠近后停住
              （不合并不穿笼，是回应的光而非第三/四人物）；431–433 随段退场 */}
          <g opacity={S(t, 400.5, 402) * (1 - S(t, 431, 433))}>
            <circle cx={810 - 30 * S(t, 401, 406)} cy={420}
              r={20 + 3 * Math.sin(t * 2.1)} fill="url(#a3wisp)" opacity={0.7} />
            <circle cx={620 + 36 * S(t, 401, 406)} cy={436}
              r={18 + 3 * Math.sin(t * 2.4 + 1)} fill="url(#a3wisp)" opacity={0.65} />
          </g>
        </g>

        {/* 笼外昔涟：粉紫背影（左外侧，与笼内同地面；431–433 退场）。
            step09：338–349 不安停顿；step10：406.5–408.5 向内倾身 28px 回应
            （右缘 634 < 笼左缘 668，仍完整在笼外；416 后保持不回抖） */}
        <g opacity={S(t, 317.5, 319.5) * (1 - S(t, 431, 433))}
          transform={`translate(${herLean} ${Math.sin(t * 1.6) * 2 * (1 - pauseAnx)})`}>
          <AsciiArt art={SHE_BACK} x={470} y={395} size={22} color="#D97A93" t={t} start={318} cps={11} />
        </g>

        {/* 记忆页（step09）：她左侧的一页小字迹，348 格式化擦除线扫过、
            字迹成浅淡压痕，页仍在；368 前自然退场，不影响 400 回应 */}
        <MemoryPage t={t} x={295} y={330} />

        {/* 落瓣/光尘 */}
        {Array.from({ length: 12 }).map((_, i) => {
          const px = 200 + random(`p3${i}`) * 1520;
          const py = 120 + ((t * (14 + random(`p3v${i}`) * 12) + random(`p3o${i}`) * 300) % 420);
          return (
            <ellipse key={i} cx={px} cy={py} rx={6} ry={3.5} fill={P2.pinkHi}
              opacity={(0.35 + 0.2 * Math.sin(t + i)) * S(t, 316, 318)} />
          );
        })}

        {/* 红字百分比（格式化逼近的读数） */}
        <g fontFamily={FONT_MONO} opacity={S(t, 348, 348.4) * (1 - S(t, 353.5, 354))}>
          <text x={1620} y={200} fontSize={22} fill="#FF9B8A">格式化进程：94.423%</text>
        </g>
        <g fontFamily={FONT_MONO} opacity={S(t, 386, 386.4) * (1 - S(t, 390.5, 391))}>
          <text x={1620} y={200} fontSize={22} fill="#FF9B8A">格式化进程：96.024%</text>
        </g>

        {/* ── D · 童年歌谣 433–493 ── */}
        {/* D0 记忆森林（step11 Rev.2）：弯干分叉 + 不规则树冠轮廓（QA 返修：
            Rev.1 圆冠+直杆像气球/路标），疏朗两层；中层原 x420 穿过树洞 → 挪 x520；
            448–451 逐棵显现，491–493 随段退场；树顶 abs≥290 不入 LOG */}
        <g opacity={1 - S(t, 491, 493)}>
          {[ // 远层：淡色剪影
            { x: 210, h: 250, lean: -10, s: 1.0 },
            { x: 585, h: 220, lean: 8, s: 0.95 },
            { x: 905, h: 265, lean: 6, s: 1.1 },
            { x: 1500, h: 235, lean: -8, s: 0.95 },
          ].map((tr, i) => (
            <TreeSketch key={i} {...tr} outline={false}
              o={S(t, 448 + i * 0.4, 448.5 + i * 0.4) * 0.5} />
          ))}
          {[ // 中层：描线树（x520 避开树洞 300–464）
            { x: 520, h: 200, lean: -8, s: 0.95 },
            { x: 760, h: 230, lean: 10, s: 1.0 },
            { x: 1180, h: 205, lean: -6, s: 0.95 },
          ].map((tr, i) => (
            <TreeSketch key={i} {...tr} outline={true}
              o={S(t, 449.6 + i * 0.4, 450.1 + i * 0.4) * 0.8} />
          ))}
        </g>
        {/* 数字提示（step11 Rev.2）：与各朋友中心对齐（x490+i×125+50），479 起
            依次出现，484.3–485 全体退场——之后才换唱名，两层不长期同屏 */}
        <g fontFamily={FONT_MONO}>
          {NOTES.map((n, i) => {
            const o = S(t, 479 + i * 0.55, 479.35 + i * 0.55) * (1 - S(t, 484.3, 485));
            return <text key={n} x={490 + i * 125 + 50} y={405 - 3 * Math.abs(Math.sin(t * 1.4 + i))}
              textAnchor="middle" fontSize={26} fill={P2.pink} opacity={o * 0.9}>{i + 1}</text>;
          })}
        </g>
        {/* 唱名（step11 Rev.2）：与数字同一提示位置，485 起按原节律依次出现 */}
        <g fontFamily={FONT_MONO}>
          {SOLFA.map((s2, i) => {
            const o = S(t, 485 + i * 0.35, 485.4 + i * 0.35) * (1 - S(t, 490, 491.5));
            const bounce = Math.abs(Math.sin((t - 485 - i * 0.35) * 5)) * 8;
            return (
              <text key={s2} x={490 + i * 125 + 50} y={408 - bounce} textAnchor="middle" fontSize={30}
                fill={P2.pink} fontFamily='"Songti SC",serif' opacity={o * 0.9}>{s2}</text>
            );
          })}
          <text x={1310} y={430} fontSize={26} fill={P2.pinkHi}
            opacity={0.8 * S(t, 485, 485.5) * (1 - S(t, 490, 491.5))}>♪</text>
        </g>

        {/* 七个字符朋友（step11）：479 起依数字节律（0.55s/个）逐个显现并轻抬爪，
            485 起随唱名（0.35s/个）顺序再回应一次；稳定横排站位（x490–1240，
            足线 y≈500 与地面同），不永久摇晃、不挡主迷迷（x≥1340）；491–493 退场 */}
        {FRIEND_FACES.map((face, i) => {
          const appearAt = 479 + i * 0.55;
          const singAt = 485 + i * 0.35;
          const armUp = (t >= appearAt && t < appearAt + 0.45) || (t >= singAt && t < singAt + 0.4);
          const o = S(t, appearAt, appearAt + 0.33) * (1 - S(t, 491, 493));
          if (o <= 0) return null;
          return (
            <g key={i} opacity={o}>
              <AsciiArt art={friendArt(face, armUp)} x={490 + i * 125} y={449} size={17}
                color="#4A3B5C" t={t} start={appearAt} cps={60} />
            </g>
          );
        })}

        {/* 迷迷 · 共享字符造型（任务书 step07）：仅童年故事段接入。
            452 起逐字生成，完成后短暂眨眼，479 歌谣切开心 C 帧（轻抬爪）；
            14×32 字格 size16，耳/尾完整，右侧避开音符与 HUD；491–493 随幕淡出 */}
        <FairyGlyph t={t} start={452} x={1340} y={266} size={16} cps={70} happyAt={479}
          opacity={1 - S(t, 491, 493)} />

        </g>

        {/* step10：400–432 局部色温缓慢回暖（幅度克制，维持淡纸面粉紫） */}
        <rect width="1920" height="718" fill="#FFE9D2"
          opacity={S(t, 400, 412) * (1 - S(t, 429, 433)) * 0.05} />

        {/* 收束：第三次格式化的暗（全幅，不下移） */}
        <rect width="1920" height="718" fill="#0B0812" opacity={S(t, 491, 493.4) * 0.62} />
      </svg>

      {/* ── 字符画（HTML 层，保证等宽对齐）── */}
      {/* 树洞（D 段，她记忆里的入口）；491–493 随幕淡出，修幕切换残留 */}
      <div style={{ opacity: 1 - S(t, 491, 493) }}>
        <AsciiSprite art={TREE_HOLE} t={t} start={441} cps={13} x={300} y={260} size={22}
          color="#4A3B5C" />
      </div>
      {/* 错误剧场 297–310：可读终端诊断面板（第二次异常复用，见任务书 step02） */}
      <RuntimeErrorScene {...ERROR_2_OF_3} t={t} compact />
    </AbsoluteFill>
  );
};
