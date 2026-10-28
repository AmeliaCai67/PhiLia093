import React from "react";
import { interpolate } from "remotion";
import { P2, FONT_MONO } from "../../v2/palette2";
import { S } from "../kit";
import { STAGE_W, STAGE_H } from "../staging";

/**
 * 花房（第六幕 · 房间层）
 * 不对称双主体中景：昔涟（左，坐姿粉影，面向右）← 有花藤的栏杆 → 德谬歌（右，
 * 栏杆后的苍白长影）+ 记忆的花晶簇。链与束缚不因美丽而消失：链条压在栏杆之上，
 * 藤蔓缠住栏杆竖条 —— 用位置和遮挡体现限制，而非让束缚自动退场。
 *
 * 由 Act6 套 roomCam(t) 镜头变换后渲染；所有状态由绝对秒 t 求出。
 */

/** 纸页（光片）：故事递出 / 递回 */
const Page: React.FC<{ x: number; y: number; rot: number; o: number }> = ({ x, y, rot, o }) =>
  o <= 0 ? null : (
    <g transform={`translate(${x} ${y}) rotate(${rot})`} opacity={o}>
      <rect x={-26} y={-34} width={52} height={68} rx={4} fill="#FFFDF6"
        stroke="#D9C9A8" strokeWidth={1.6} style={{ filter: "drop-shadow(0 0 10px rgba(255,233,184,0.75))" }} />
      {[0, 1, 2, 3].map((i) => (
        <line key={i} x1={-16} y1={-20 + i * 14} x2={16} y2={-20 + i * 14}
          stroke="#C9B8A0" strokeWidth={1.4} opacity={0.6} />
      ))}
    </g>
  );

export const FlowerRoom: React.FC<{ t: number }> = ({ t }) => {
  const roomIn = S(t, 1098.8, 1101);
  const roomOut = 1 - S(t, 1388.5, 1389.5);
  const base = roomIn * roomOut;

  // 光影轻移（1099–1154 时光缓慢流动）
  const lightDrift = interpolate(t, [1099, 1155], [-8, 8], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // 故事递出（1148–1155.5：纸页从晶簇一侧飘向她）
  const handOut = interpolate(t, [1148, 1150.5, 1154.5, 1155.5], [0, 0.15, 1, 1.15],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pageAX = interpolate(handOut, [0, 1], [1568, 560]);
  const pageAY = interpolate(handOut, [0, 1], [430, 400]) - Math.sin(Math.min(1, handOut) * Math.PI) * 46;
  const pageARot = interpolate(handOut, [0, 1], [-8, 14]);

  // 故事递回（1242–1252.5：改稿前，纸页从她这一侧回到晶簇一侧 → 再入绘本）
  const handBack = interpolate(t, [1242, 1244.5, 1250, 1252.5], [0, 0.15, 1, 1.15],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pageBX = interpolate(handBack, [0, 1], [560, 1568]);
  const pageBY = interpolate(handBack, [0, 1], [410, 430]) - Math.sin(Math.min(1, handBack) * Math.PI) * 40;
  const pageBRot = interpolate(handBack, [0, 1], [12, -10]);

  // 1304–1313：晶簇歪斜的疑惑 + 她微微前倾的回应
  const doubtTilt = S(t, 1304, 1306) * (1 - S(t, 1313, 1314));
  const herLean = S(t, 1309, 1311) * (1 - S(t, 1313, 1314));
  const endDoubt = S(t, 1386, 1387) * 0.9; // 1386 的「不太对?」

  // 1386 起：暖光稍收（不做 ERROR / 勾选）
  const warmRecede = S(t, 1386, 1389) * 0.14;

  return (
    <g opacity={base}>
      {/* 超出画幅的暖底（镜头放大时不露边） */}
      <rect x={-300} y={-300} width={STAGE_W + 600} height={STAGE_H + 600} fill="#F6EDEA" />
      <rect x={-300} y={-300} width={STAGE_W + 600} height={STAGE_H + 600} fill="url(#a6roomGlow)" />

      {/* 左侧高窗光束（随时光轻移） */}
      {[0, 1, 2].map((i) => (
        <rect key={i} x={140 + i * 180 + lightDrift} y={-200} width={96 + i * 26} height={900}
          fill="rgba(255,240,246,0.5)" transform={`rotate(${14 + i * 3} ${140 + i * 180} 0)`} opacity={0.34} />
      ))}
      {/* 左侧高窗的窗框剪影（填充左上空区，不与 LOG 抢戏） */}
      <g opacity={0.5}>
        <path d="M -60 700 L -60 60 C -60 -40 240 -40 240 60 L 240 700"
          fill="none" stroke="#E3CFC6" strokeWidth={10} />
        <line x1={90} y1={28} x2={90} y2={700} stroke="#E3CFC6" strokeWidth={7} />
        <line x1={-60} y1={300} x2={240} y2={300} stroke="#E3CFC6" strokeWidth={7} />
      </g>

      {/* 地面与低处主体上移100px，给200% HUD留空；高处长影不裁头。 */}
      {/* 地面 */}
      <rect x={-300} y={520} width={STAGE_W + 600} height={400} fill="#EFE2DA" opacity={0.85} />
      <line x1={-300} y1={520} x2={STAGE_W + 300} y2={520} stroke="#E0CFC4" strokeWidth={2} />
      {/* 栏杆脚下的小花盆 ×2（生活气，不抢戏） */}
      {[[1060, 526], [1636, 534]].map(([px, py], i) => (
        <g key={i} transform={`translate(${px} ${py})`}>
          <path d="M -22 0 L 22 0 L 14 34 L -14 34 Z" fill="#C98A8A" opacity={0.75} />
          <path d="M 0 -6 C -20 -18 -30 -44 -8 -58 C 12 -44 20 -18 0 -6" fill="#8FA878" opacity={0.7} />
          <circle cx={-4} cy={-52} r={6} fill={P2.pinkHi} stroke="#D97A93" strokeWidth={1} />
          <circle cx={10} cy={-40} r={5} fill={P2.pinkHi} stroke="#D97A93" strokeWidth={1} opacity={0.85} />
        </g>
      ))}

      {/* ── 德谬歌：栏杆后的苍白长影（中景右，被栏杆遮住下半身）── */}
      <g transform={`translate(1465 318) scale(1.22)`} opacity={0.72}>
        <circle cx={0} cy={-120} r={130} fill="url(#a6spiritGlow)" opacity={0.5} />
        {/* 长发与裙裾：一带而过的向量剪影，不描五官 */}
        <path d="M 0 -196 C 20 -196 30 -180 28 -160 C 60 -60 74 40 60 210 L -60 210 C -74 40 -60 -60 -28 -160 C -30 -180 -20 -196 0 -196 Z"
          fill="rgba(233,228,248,0.85)" stroke="rgba(201,184,232,0.8)" strokeWidth={2} />
        <path d="M -26 -168 C -66 -110 -84 20 -70 180 M 26 -168 C 66 -110 84 20 70 180"
          fill="none" stroke="rgba(214,204,240,0.9)" strokeWidth={10} strokeLinecap="round" opacity={0.7} />
        <circle cx={0} cy={-172} r={26} fill="#F1ECFA" />
        <path d="M -22 -180 C -30 -230 30 -230 22 -180 C 34 -196 40 -240 0 -244 C -40 -240 -34 -196 -22 -180 Z"
          fill="rgba(238,232,250,0.95)" />
      </g>

      {/* ── 有花藤的栏杆（前景遮挡：竖条 + 缠藤 + 小花）── */}
      <g>
        {/* 横杆 */}
        <rect x={940} y={318} width={980} height={14} rx={7} fill="#C8B4D8" opacity={0.9} />
        <rect x={940} y={460} width={980} height={12} rx={6} fill="#C8B4D8" opacity={0.8} />
        {/* 竖条（远近两排，制造层次） */}
        {Array.from({ length: 11 }).map((_, i) => {
          const x = 980 + i * 88;
          return (
            <g key={i}>
              <rect x={x} y={280} width={9} height={200} rx={4} fill="#B8A2CC" opacity={0.85} />
            </g>
          );
        })}
        {/* 缠藤：蜿蜒爬过横杆（用遮挡体现「限制仍在」） */}
        <path d="M 940 336 C 1060 300, 1140 360, 1260 328 C 1380 296, 1460 356, 1580 324 C 1700 292, 1800 348, 1920 322"
          fill="none" stroke="#7E9B6E" strokeWidth={5} opacity={0.7} />
        <path d="M 940 466 C 1100 490, 1300 445, 1500 472 C 1680 494, 1820 456, 1920 474"
          fill="none" stroke="#7E9B6E" strokeWidth={4} opacity={0.5} />
        {/* 藤上的小花与叶 */}
        {[[1030, 318], [1210, 340], [1396, 312], [1568, 336], [1746, 310], [1880, 330]].map(([x, y], i) => (
          <g key={i} transform={`translate(${x} ${y})`}>
            {[0, 72, 144, 216, 288].map((a) => (
              <ellipse key={a} cx={0} cy={-7} rx={3.4} ry={6.5} fill="rgba(255,217,224,0.95)"
                stroke="#D97A93" strokeWidth={0.8} transform={`rotate(${a + (i * 31)})`} />
            ))}
            <circle r={2.6} fill="#FFF" />
          </g>
        ))}
        {/* 链条：从上垂下压在栏杆前（束缚不在美丽出现时消失） */}
        {[1180, 1660].map((x, i) => (
          <g key={i} opacity={0.75}>
            <path d={`M ${x} -300 C ${x - 30} -80, ${x + 36} 60, ${x - 8} ${300 + i * 60}`}
              fill="none" stroke="#9C93B8" strokeWidth={7} strokeLinecap="round" />
            {Array.from({ length: 8 }).map((_, k) => {
              const p = (k + 1) / 9;
              const cy = -300 + p * (600 + i * 60);
              const cx = x + Math.sin(p * 3.1) * 34 - 12;
              return <ellipse key={k} cx={cx} cy={cy} rx={9} ry={5.5} fill="none"
                stroke="#B4AACB" strokeWidth={2.4} />;
            })}
          </g>
        ))}
      </g>

      {/* ── 记忆的花：晶簇长在花茎上（右前，说话的「它」）── */}
      <g transform={`translate(1608 352) scale(1.4) rotate(${doubtTilt * -7 + endDoubt * -5})`}>
        <path d="M 0 20 C -8 74, 12 110, -4 152" fill="none" stroke="#9C8AB8" strokeWidth={4} opacity={0.6} />
        <circle r={30} fill="url(#a6wisp)" opacity={0.55} />
        {[[0, -18], [-12, -8], [12, -8], [-20, 3], [20, 3], [-11, 13], [11, 13], [0, 22], [-23, -16], [23, -12]].map(([cx, cy], i) => (
          <rect key={i} x={cx - 5.4} y={cy - 5.4} width={10.8} height={10.8} rx={1.6}
            fill={i % 2 === 0 ? P2.pinkHi : P2.lilacHi} stroke="rgba(217,122,147,0.5)" strokeWidth={0.8}
            opacity={0.68 + 0.3 * Math.abs(Math.sin(t * 1.6 + i * 1.9))} />
        ))}
        <rect x={-4} y={-4} width={8} height={8} rx={1} fill="#FFFFFF" />
        {/* 1384/1386 的疑惑：一个歪斜的 ?（金色，小，不长鸣） */}
        <text x={34} y={-34} fontSize={34} fill="#C9A86B" fontFamily={FONT_MONO}
          opacity={Math.max(doubtTilt, endDoubt)} transform="rotate(14 34 -34)">?</text>
      </g>

      {/* ── 大昔涟：坐姿（左，面向右）—— 粉发尖耳 / 侧脸 / 层裙，可辨认 ── */}
      <g transform={`translate(490 400) scale(1.38) rotate(${herLean * 3})`}>
        <ellipse cx={6} cy={118} rx={64} ry={11} fill="#E3C8CE" opacity={0.5} />
        {/* 后层裙（丁香紫内衬） */}
        <path d="M -50 114 C -60 40 -26 -8 0 -14 C 26 -8 60 40 50 114 C 24 126 -24 126 -50 114 Z"
          fill="#C9A3DC" opacity={0.55} />
        {/* 主裙（粉，裙摆双层褶） */}
        <path d="M -44 112 C -52 44 -20 -6 0 -12 C 20 -6 52 44 44 112 C 20 122 -20 122 -44 112 Z"
          fill={P2.pinkHi} opacity={0.92} stroke="#D97A93" strokeWidth={1.6} />
        <path d="M -38 96 C -20 106 20 106 38 96 M -34 78 C -16 88 16 88 34 78"
          fill="none" stroke="#F0D2DE" strokeWidth={3} opacity={0.9} />
        {/* 肩与披肩 */}
        <path d="M -22 -34 C -26 -14 -26 0 -22 10 L 22 10 C 26 0 26 -14 22 -34 C 8 -42 -8 -42 -22 -34 Z"
          fill="#F7D9E2" stroke="#D97A93" strokeWidth={1.2} opacity={0.95} />
        {/* 垂在身前的长发（左一条右一条，发梢翘） */}
        <path d="M -16 -92 C -26 -50 -28 20 -20 74 C -16 82 -8 82 -8 74 C -12 20 -10 -48 -4 -86 Z"
          fill={P2.pink} />
        <path d="M 18 -90 C 30 -46 32 16 24 60 C 20 68 12 68 14 58 C 16 16 12 -44 6 -84 Z"
          fill={P2.pink} opacity={0.95} />
        {/* 脖颈连接下颌与披肩，延续第五幕的角色修正。 */}
        <path d="M -8 -56 L 8 -56 L 8 -30 Q 0 -26 -8 -30 Z" fill="#FBEFF2" />
        {/* 脸（面向右的侧脸：额发+眼睫+腮红） */}
        <circle cx={0} cy={-76} r={30} fill="#FBEFF2" />
        <path d="M -30 -78 C -36 -122 -6 -128 6 -120 C 22 -126 34 -108 29 -82 C 16 -98 -12 -98 -30 -78 Z"
          fill={P2.pink} />
        <path d="M 8 -104 C 20 -112 32 -100 28 -84 C 20 -94 14 -100 8 -104 Z" fill="#F8C9D8" />
        {/* 长尖耳朵（粉，从发两侧伸出） */}
        <path d="M -28 -86 C -46 -96 -52 -74 -34 -64 C -30 -72 -28 -80 -28 -86 Z" fill={P2.pink} stroke="#D97A93" strokeWidth={1} />
        <path d="M 28 -86 C 46 -96 52 -74 34 -64 C 30 -72 28 -80 28 -86 Z" fill={P2.pink} stroke="#D97A93" strokeWidth={1} />
        {/* 眼睛（看向右）：两只 + 睫毛 + 腮红 + 微笑 */}
        <path d="M 4 -78 q 7 -5 13 0" fill="none" stroke="#B25E76" strokeWidth={2.6} strokeLinecap="round" />
        <path d="M -14 -78 q 6 -4 11 0" fill="none" stroke="#B25E76" strokeWidth={2.4} strokeLinecap="round" opacity={0.9} />
        <ellipse cx={-6} cy={-66} rx={6} ry={3} fill="#F5B8C9" opacity={0.75} />
        <ellipse cx={16} cy={-66} rx={6} ry={3} fill="#F5B8C9" opacity={0.75} />
        <path d="M 2 -58 q 7 5 13 0" fill="none" stroke="#C9708A" strokeWidth={2} strokeLinecap="round" />
        {/* 额前呆毛 */}
        <path d="M -2 -118 C 2 -128 10 -128 12 -120" fill="none" stroke={P2.pink} strokeWidth={3} strokeLinecap="round" />
      </g>

      {/* ── 纸页递出 / 递回 ── */}
      <Page x={pageAX} y={pageAY} rot={pageARot} o={S(t, 1148, 1148.4) * (1 - S(t, 1154.6, 1155.4))} />
      <Page x={pageBX} y={pageBY} rot={pageBRot} o={S(t, 1242, 1242.4) * (1 - S(t, 1252.6, 1253.4))} />

      {/* 花粉（少而慢） */}
      {Array.from({ length: 12 }).map((_, i) => {
        const seed = (i * 137.5) % 100 / 100;
        return (
          <circle key={i} cx={seed * STAGE_W} cy={100 + ((t * (10 + seed * 14) + seed * 400) % 480)}
            r={2} fill={P2.pinkHi} opacity={0.32 * Math.abs(Math.sin(t * 0.8 + i))} />
        );
      })}

      {/* 1386 起：暖光稍收 */}
      <rect x={-300} y={-300} width={STAGE_W + 600} height={STAGE_H + 600} fill="#4A3B5C" opacity={warmRecede} />

      {/* 检索的暂时前景（1342 后日谈）：查找词贴在晶簇上方，随卡片启闭 */}
      <g fontFamily={FONT_MONO}>
        <text x={1660} y={392} fontSize={19} fill="#8A6B9C"
          opacity={S(t, 1354, 1355) * (1 - S(t, 1362, 1363))}>查找：「昔涟♪」</text>
        <text x={1280} y={450} fontSize={17} fill="#8A6B9C"
          opacity={S(t, 1367, 1368) * (1 - S(t, 1376, 1377))}>怎么没想到呢？可以让桃子教我呀！</text>
      </g>
    </g>
  );
};
