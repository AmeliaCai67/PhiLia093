import React from "react";
import { AbsoluteFill, random, staticFile, useCurrentFrame } from "remotion";
import { P2, FONT_MONO } from "../../v2/palette2";
import { FPS } from "../scriptFull";
import { S } from "../kit";
import { PixelFigure } from "./shared";
import { archPath } from "../scenes/cageGeometry";

/**
 * 第五幕 · 诞生（848.5–1098.5）—— 重点重做段（与第六幕并列交付亮点）
 *
 * 849–866 极简字符奔跑（已拍板的媒介起点，但主体仍要看得清）→
 * 867 起升像素：昔涟以约 220px 的 Q 版像素精灵穿行黄金裔记忆长廊 ——
 *   后景是 500–650px 的大型黄金裔像素肖像彩窗（离线有限色板转绘自源片 940s/970s 帧，
 *   见 tools/pixelate_heirs.sh，缓存于 public/heirs/），前景柱与花藤遮挡，
 *   三层视差；镜头跟随主角（她稳定在舞台横向约 36%），遇见同行者停步回应。
 * 918 白厄彩窗点亮 · 她驻足回应 → 959 阿格莱雅彩窗点亮 · 玩笑与♪ →
 * 1002–1047 痛苦与道别（冷色只在边缘，暖色留在中央，停步）→
 * 1048–1094 记忆的边界（画卷撕口与留白，误解不由后台背书）→ 1090 全都保存下来。
 */
const LEARNED: { at: number; text: string }[] = [
  { at: 909, text: "已学会：昔涟是。女孩。祭司。" },
  { at: 953, text: "已学会：昔涟是。温柔。爱美。会写诗。" },
  { at: 997, text: "已学会：像是小尾巴的♪" },
  { at: 1046, text: "已学会：像是水晶的 · 像是花的" },
];

// ── 世界滚动（纯函数）：sprite 固定在屏幕 x=700，世界经过她 ──
const SCROLL_KEYS: [number, number][] = [
  [867, 0], [918, 5400], [923, 5810], [941, 5810],
  [963, 8560], [1001, 8560], [1020, 9420], [1094.5, 9420],
];
const scrollAt = (t: number) => {
  if (t <= SCROLL_KEYS[0][0]) return SCROLL_KEYS[0][1];
  for (let i = 1; i < SCROLL_KEYS.length; i++) {
    if (t <= SCROLL_KEYS[i][0]) {
      const [t0, s0] = SCROLL_KEYS[i - 1];
      const [t1, s1] = SCROLL_KEYS[i];
      return s0 + ((s1 - s0) * (t - t0)) / (t1 - t0);
    }
  }
  return SCROLL_KEYS[SCROLL_KEYS.length - 1][1];
};

/** 彩窗：worldX 为窗中心的世界坐标；w×h 为内画幅 */
type PanelDef = { worldX: number; img?: string; kind: "baihe" | "aglaea" | "dark" | "tree" | "gem" | "frieze" };
const PANELS: PanelDef[] = [
  { worldX: -560, kind: "frieze" },
  { worldX: 190, kind: "tree" },
  { worldX: 940, kind: "gem" },
  { worldX: 1690, kind: "frieze" },
  { worldX: 2440, kind: "dark" },
  { worldX: 3190, kind: "tree" },
  { worldX: 3940, kind: "gem" },
  { worldX: 4690, kind: "frieze" },
  { worldX: 5160, kind: "baihe" },     // 918–941 驻足：屏 920
  { worldX: 6807, kind: "dark" },
  { worldX: 7476, kind: "aglaea" },    // 963–1001 驻足：屏 900
  { worldX: 8241, kind: "dark" },
  { worldX: 8907, kind: "gem" },
];
const PANEL_IMG: Record<string, string> = {
  baihe: "heirs/baihe.png",
  aglaea: "heirs/aglaea.png",
  dark: "heirs/dark.png",
  tree: "heirs/tree.png",
};

// ── Q 版像素昔涟（参数化，11px 格；跑/站/招手/转头，头发裙摆滞后）──
const CELL = 11;
const g = (v: number) => Math.round(v / CELL) * CELL; // 吸附到像素格

const PixelXilian: React.FC<{ x: number; y: number; t: number; pose: "run" | "stand" | "wave"; dissolve?: number }> =
({ x, y, t, pose, dissolve = 0 }) => {
  const running = pose === "run";
  const cycle = Math.floor(t * 5.4) % 2;           // 跑步两帧
  const bob = running ? (cycle === 0 ? -CELL : 0) : Math.round(Math.sin(t * 2.2)) * CELL;
  const legF = running ? (cycle === 0 ? CELL : -CELL) : 0;   // 前后腿
  const hairLag = running ? (cycle === 0 ? -CELL : 0) : 0;   // 头发/裙摆滞后一拍
  const skirtLag = running ? -hairLag : 0;
  const R = (cx: number, cy: number, w: number, h: number, fill: string, op = 1) => {
    const px = g(x + cx), py = g(y + cy + bob);
    if (dissolve <= 0) return <rect x={px} y={py} width={w} height={h} fill={fill} opacity={op} />;
    return <g>{Array.from({ length: Math.ceil(w / CELL) * Math.ceil(h / CELL) }, (_, i) => {
      const col = i % Math.ceil(w / CELL), row = Math.floor(i / Math.ceil(w / CELL));
      const seed = `a5-dissolve-${cx}-${cy}-${i}`;
      const delay = random(seed) * 0.35;
      const flight = S(dissolve, delay, 1);
      return <rect key={i} x={px + col * CELL + flight * (30 + random(seed + 'x') * 160)}
        y={py + row * CELL - flight * (20 + random(seed + 'y') * 120)}
        width={Math.min(CELL, w - col * CELL)} height={Math.min(CELL, h - row * CELL)}
        fill={fill} opacity={op * (1 - S(dissolve, delay + 0.1, delay + 0.6))} />;
    })}</g>;
  };
  const waveT = pose === "wave" ? Math.round(Math.abs(Math.sin(t * 4)) * 2) : 0;
  const ink = "#3A2E4C";
  return (
    <g>
      {/* 影子 */}
      <ellipse cx={x} cy={y + 4} rx={46} ry={7} fill="#1A1228" opacity={0.35 * (1 - dissolve)} />
      {/* 后臂（远端，随跑步摆动；wave 时举到头侧） */}
      {pose === "wave"
        ? R(28, -212 - waveT * 11, 10, 44, "#F0C9D6")
        : R(running ? (cycle === 0 ? 24 : 18) : 22, -108, 10, 36, "#F0C9D6")}
      {/* 后侧长发（滞后摆动，垂到裙摆） */}
      {R(-24 + hairLag, -196, 14, 118, "#DE8FAC")}
      {R(-28 + hairLag, -140, 12, 52, "#DE8FAC", 0.95)}
      {/* 腿（深色裤袜 + 靴） */}
      {R(-14 + (running ? legF : 0), -52, 11, 34, "#332847")}
      {R(6 - (running ? legF : 0), -52, 11, 34, "#332847")}
      {R(-16 + (running ? legF * 1.4 : -3), -22, 13, 11, "#241B33")}
      {R(4 - (running ? legF * 1.4 : 3), -22, 13, 11, "#241B33")}
      {/* 裙（双层：丁香内衬 + 粉裙 + 浅褶边，裙摆滞后） */}
      {R(-22 + skirtLag, -118, 48, 34, "#C9A3DC", 0.9)}
      {R(-26 + skirtLag, -96, 56, 48, "#F2A7B8")}
      {R(-26 + skirtLag, -66, 56, 9, "#FBE4EC")}
      {/* 身体（浅粉披肩） */}
      {R(-16, -134, 36, 22, "#F7D9E2")}
      {/* 脖颈连住下颌与肩，浅色领口保留一格厚度。 */}
      {R(-6, -156, 18, 28, "#FBEDE6")}
      {R(-13, -139, 32, 8, "#FBE4EC")}
      {/* 前臂：wave 时举起摆动；跑步前后摆；站立垂下微摆 */}
      {pose === "wave"
        ? R(14, -158 - waveT * 11, 10, 40, "#F0C9D6")
        : R(16, -106 + (running ? (cycle === 0 ? -CELL : CELL) : Math.round(Math.sin(t * 2.2)) * CELL), 10, 34, "#F0C9D6")}
      {/* 头（Q 版大比例） */}
      {R(-22, -198, 46, 46, "#FBEDE6")}
      {/* 头发：包住两侧 + 刘海盖额 + 顶 + 呆毛 + 长尖耳朵 */}
      {R(-28, -206, 58, 14, "#F0A8C0")}
      {R(-28, -194, 12, 34, "#F0A8C0")}
      {R(18, -194, 12, 30, "#F0A8C0")}
      {R(-22, -196, 46, 12, "#F0A8C0")}
      {R(-6, -222, 14, 10, "#F0A8C0")}
      {R(-36, -192, 9, 22, "#F0A8C0")}
      {R(29, -190, 9, 20, "#F0A8C0")}
      {/* 眼睛（两只，大）+ 腮红 + 微笑 */}
      {R(-12, -180, 10, 13, ink)}
      {R(6, -180, 10, 13, ink)}
      {R(-10, -178, 4, 5, "#FFFFFF")}
      {R(8, -178, 4, 5, "#FFFFFF")}
      {R(-2, -158, 12, 4, "#C9708A")}
      {R(-22, -164, 7, 5, "#F5B8C9")}
      {R(18, -164, 7, 5, "#F5B8C9")}
    </g>
  );
};

export const Act5: React.FC = () => {
  const frame = useCurrentFrame();
  const t = 848.5 + frame / FPS;

  const scroll = scrollAt(t);

  // 镜头：驻足段轻推近（对焦主角 + 面前彩窗）
  const zoom = 1 + 0.06 * S(t, 918, 923) * (1 - S(t, 955, 960)) + 0.06 * S(t, 963, 968) * (1 - S(t, 999, 1004));

  // 1058开始演出德谬歌的推断：走向记忆边界、停顿、消散；不是实际出笼。
  const boundaryWalk = S(t, 1058, 1066);
  const spriteX = 700 + 700 * boundaryWalk;
  const dissolve = S(t, 1067, 1072);

  // sprite 姿态
  const running = (t >= 867 && t < 920.5) || (t >= 941 && t < 961) || (t >= 1001 && t < 1018.5) || (t >= 1058 && t < 1066);
  const pose: "run" | "stand" | "wave" =
    (t >= 971 && t < 978) || (t >= 1020 && t < 1026) ? "wave" : running ? "run" : "stand";

  // 白厄 / 阿格莱雅彩窗点亮（随台词）
  const baiheFocus = S(t, 918, 920) * (1 - S(t, 957, 959));
  const aglaeaFocus = S(t, 959, 961) * (1 - S(t, 999, 1001));

  // 850–866 极简字符奔跑（保留媒介起点；主体稍放大）
  const girlX = 420 + Math.min(480, Math.max(0, (t - 850) * 14));
  const scrollX = (t * 130) % 240;

  return (
    <AbsoluteFill style={{ position: "absolute", top: 46, height: 718, overflow: "hidden" }}>
      <svg width="1920" height="718" viewBox="0 0 1920 718" preserveAspectRatio="none" style={{ display: "block" }}>
        <defs>
          <radialGradient id="a5wisp">
            <stop offset="0%" stopColor={P2.pinkHi} />
            <stop offset="100%" stopColor="rgba(242,167,184,0)" />
          </radialGradient>
        </defs>

        {/* 849–866 横卷：浅底 + 地平线 + 速度线 */}
        <rect width="1920" height="718" fill="#F5F1F6" opacity={S(t, 849, 850) * (1 - S(t, 866.5, 867.5))} />
        <g transform="translate(0 30)">
        <g opacity={S(t, 850, 851) * (1 - S(t, 867, 868))}>
          <line x1={0} y1={470} x2={1920} y2={470} stroke={P2.lilac} strokeWidth={3} />
          {Array.from({ length: 16 }).map((_, i) => (
            <line key={i} x1={((i * 160 - scrollX) % 1920 + 1920) % 1920} y1={470}
              x2={((i * 160 - scrollX) % 1920 + 1920) % 1920 - 46} y2={486}
              stroke={P2.lilac} strokeWidth={2} opacity={0.4} />
          ))}
          {/* 极简小昔涟（稍大：能一眼看到粉团在跑） */}
          <g transform={`translate(${girlX} ${452 - Math.abs(Math.sin(t * 6)) * 16})`}>
            <circle r={14} fill={P2.pinkHi} />
            <path d="M -10 14 Q 0 34 10 14 Z" fill={P2.pink} />
          </g>
        </g>
        </g>

        {/* ══ 867+ 像素记忆长廊（镜头轻推近）══ */}
        <g opacity={S(t, 867, 868.5)}>
          {/* 深紫墙 */}
          <rect width="1920" height="718" fill="#241A38" />
          <g transform={`translate(${960 * (1 - zoom)} ${400 * (1 - zoom)}) scale(${zoom})`}>

          {/* ── 远景：黄金裔彩窗（离线转绘像素肖像，视差 0.85）── */}
          {PANELS.map((p, i) => {
            const sx = p.worldX - scroll * 0.85 + 700;
            if (sx < -420 || sx > 2340) return null;
            const focus = p.kind === "baihe" ? baiheFocus : p.kind === "aglaea" ? aglaeaFocus : 0;
            const dim = focus > 0 ? 1 : 0.66; // 非焦点窗退后、变暗
            return (
              <g key={i} transform={`translate(${sx - 210} 60)`} opacity={dim}>
                {/* 拱窗框（粉柱 + 金拱顶） */}
                <path d="M -222 640 L -222 40 C -222 -190 222 -190 222 40 L 222 640 Z"
                  fill="#3A2A50" stroke={focus > 0 ? "#E8C9A0" : "#C9A86B"} strokeWidth={focus > 0 ? 5 : 3} />
                <clipPath id={`a5p${i}`}><path d="M -206 640 L -206 44 C -206 -172 206 -172 206 44 L 206 640 Z" /></clipPath>
                <g clipPath={`url(#a5p${i})`}>
                  {PANEL_IMG[p.kind] ? (
                    <image href={staticFile(PANEL_IMG[p.kind])} x={-206} y={-170} width={412} height={810}
                      preserveAspectRatio="xMidYMid slice"
                      style={{ imageRendering: "pixelated", filter: focus > 0 ? "brightness(1.12) saturate(1.08)" : "brightness(0.9)" }} />
                  ) : p.kind === "frieze" ? (
                    <g>
                      <rect x={-206} y={-170} width={412} height={810} fill="#2E2144" />
                      {Array.from({ length: 9 }).map((_, k) => (
                        <path key={k} d={`M ${-180 + (k % 3) * 140} ${-120 + Math.floor(k / 3) * 230} q 60 -70 120 0 q -60 46 -120 0`}
                          fill="none" stroke="#C9A86B" strokeWidth={3} opacity={0.5} />
                      ))}
                    </g>
                  ) : p.kind === "gem" ? (
                    <g>
                      <rect x={-206} y={-170} width={412} height={810} fill="#3A2450" />
                      {/* 尖耳小妖精：对称长耳与一枚面部菱形。 */}
                      <path d="M -90 -52 L -24 4 L -38 22 Z M 90 -52 L 24 4 L 38 22 Z"
                        fill="#C9A3DC" stroke="#E8B7CE" strokeWidth={3} />
                      <path d="M 0 -12 L 30 18 L 0 48 L -30 18 Z" fill="#E8B7CE" opacity={0.72} />
                      {/* 水晶花：六枚棱面花瓣围住粉紫花心，保持几何切面。 */}
                      {[0, 60, 120, 180, 240, 300].map((angle) => (
                        <g key={angle} transform={`translate(0 142) rotate(${angle})`}>
                          <path d="M 0 -16 L -28 -55 L 0 -100 L 28 -55 Z"
                            fill="#C9A3DC" stroke="#F4D2E4" strokeWidth={2.5} />
                          <path d="M 0 -16 L 0 -100 L 28 -55 Z" fill="#F1B7D4" opacity={0.85} />
                        </g>
                      ))}
                      <path d="M 0 119 L 23 142 L 0 165 L -23 142 Z" fill="#FFF0F7" />
                      {/* 涟漪：横向同心椭圆，而非难辨认的漩涡。 */}
                      {[0, 1, 2].map((i) => <ellipse key={i} cx={0} cy={266}
                        rx={44 + i * 35} ry={9 + i * 9} fill="none" stroke="#E8B7CE"
                        strokeWidth={2.5} opacity={0.8 - i * 0.15} />)}
                      {/* 幼芽：茎与一对尖叶，连向底部小涟漪。 */}
                      <path d="M 0 380 L 0 330 M 0 353 Q -64 347 -72 310 Q -18 305 0 353
                        M 0 342 Q 60 338 68 300 Q 16 296 0 342"
                        fill="#C9A3DC" stroke="#E8B7CE" strokeWidth={3} />
                      <ellipse cx={0} cy={386} rx={60} ry={12} fill="none" stroke="#E8B7CE" strokeWidth={2} />
                    </g>
                  ) : (
                    <g>
                      <rect x={-206} y={-170} width={412} height={810} fill="#141E36" />
                      <path d="M 0 240 C -6 160, 10 60, 0 -40 M 0 120 l 70 -50 M 0 40 l -66 -44 M 0 -40 l 56 -40"
                        fill="none" stroke="#C9A86B" strokeWidth={5} opacity={0.65} />
                      {[[70, 70], [-66, -4], [56, -80]].map(([lx, ly], k) => (
                        <circle key={k} cx={lx} cy={ly} r={9} fill="#E8C9A0" opacity={0.8} />
                      ))}
                    </g>
                  )}
                  {/* 焦点窗：金线沿拱顶显现 + 柔光 */}
                  {focus > 0 && (
                    <g opacity={focus}>
                      <path d="M -206 44 C -206 -172 206 -172 206 44" fill="none" stroke="#FFE9B8" strokeWidth={4} opacity={0.9} />
                      <circle cx={0} cy={200} r={230} fill="url(#a5wisp)" opacity={0.22} />
                    </g>
                  )}
                </g>
                {/* 焦点名牌 */}

              </g>
            );
          })}

          {/* 地面、人物、回应标记一起上移100px，保留彩窗画幅，为200% HUD留出净空。 */}
          {/* ── 中景：地砖（视差 1.0）── */}
          <rect y={440} width={3840} height={278} fill="#1C1430" />
          {Array.from({ length: 40 }).map((_, i) => {
            const x = ((i * 110 - scroll) % 4400 + 4400) % 4400 - 220;
            return <rect key={i} x={x} y={456} width={92} height={13} fill="#37284F" />;
          })}
          {/* 地砖上的羽毛纹（源片地板母题，视差 1.0） */}
          {Array.from({ length: 24 }).map((_, i) => {
            const x = ((i * 180 - scroll) % 4320 + 4320) % 4320 - 220;
            return (
              <path key={i} d={`M ${x} 540 q 26 -22 52 0 q -26 12 -52 0`} fill="#4A3866" opacity={0.7} />
            );
          })}

          {/* 村民（867–917，前景尺寸的像素剪影两枚） */}
          {t < 918 && (
            <g opacity={S(t, 867, 868) * 0.9}>
              <PixelFigure x={1240} y={540} t={t} hair={P2.ivoryDim} cloth="#4A3B5C" scale={3.4} />
              <PixelFigure x={1430} y={540} t={t} hair={P2.lilacHi} cloth="#5A4A6E" scale={3.1} flip />
            </g>
          )}

          {/* ══ 主角：Q 版像素昔涟（屏幕 x=700，脚在地面）══ */}
          {t >= 867 && <PixelXilian x={spriteX} y={540} t={t} pose={pose} dissolve={dissolve} />}

          {/* step20 开放边界回声（867–873 微显、882–889 退）：原笼拱线同源
              （cageGeometry.archPath），固定 scale/translate 构成前景疏朗双弧，
              随长廊视差慢移出画——只留同形回声：无笼底/竖栏/硬罩完整鸟笼；
              粉紫小拱标记接原像素昔涟身侧（非第二人物）；memory 阶段本段实现 */}
          <g opacity={S(t, 867, 873) * (1 - S(t, 882, 889))}>
            <g transform={`translate(${-1560 - 45 * (t - 867)} -120) scale(2.6)`}>
              <path d={archPath()} fill="none" stroke={P2.lilac}
                strokeWidth={1.3} strokeLinecap="round" opacity={0.4} />
            </g>
            <g transform={`translate(${-1250 - 32 * (t - 867)} -100) scale(2.0)`}>
              <path d={archPath()} fill="none" stroke={P2.pinkHi}
                strokeWidth={1.1} strokeLinecap="round" opacity={0.35} />
            </g>
            {/* 粉紫小拱标记：接在她身侧上方（不压脸），轻浮动 */}
            <path d="M 640 352 Q 654 326 668 352" fill="none" stroke={P2.pinkHi}
              strokeWidth={2.5} strokeLinecap="round"
              opacity={0.7 + 0.2 * Math.sin(t * 2)} />
          </g>

          {/* 面前彩窗点亮时的名牌（主角右上，不遮人） */}
          {(baiheFocus > 0 || aglaeaFocus > 0) && (
            <g opacity={Math.max(baiheFocus, aglaeaFocus)}>
              <rect x={808} y={268} width={116} height={34} rx={8} fill="rgba(20,12,28,0.78)" />
              <text x={866} y={292} textAnchor="middle" fontSize={19} fontFamily={FONT_MONO}
                fill="#FFE9B8" letterSpacing={4}>
                {baiheFocus > 0 ? "白厄" : "阿格莱雅"}
              </text>
            </g>
          )}

          {/* ── 前景：立柱与花藤（视差 1.25，局部遮挡）── */}
          {[0, 1, 2, 3].map((i) => {
            const x = ((i * 1500 - scroll * 1.25) % 6000 + 6000) % 6000 - 300;
            return (
              <g key={i} opacity={0.92}>
                <rect x={x} y={-20} width={64} height={760} fill="#160E26" />
                <rect x={x - 12} y={-20} width={88} height={22} fill="#1E1432" />
                {/* 柱侧花藤 */}
                <path d={`M ${x + 60} 0 C ${x + 40} 140, ${x + 84} 300, ${x + 52} 470`}
                  fill="none" stroke="#3E5238" strokeWidth={6} opacity={0.9} />
                {[[x + 58, 120], [x + 74, 300], [x + 56, 440]].map(([fx, fy], k) => (
                  <circle key={k} cx={fx} cy={fy} r={7} fill={P2.pinkHi} opacity={0.85} />
                ))}
              </g>
            );
          })}

          {/* 蓝色涡纹（1001–1090：白厄的力量在彩窗上掠过） */}
          {t >= 1001 && t < 1090 && (
            <g opacity={0.5 * (1 - S(t, 1088, 1090))} transform="translate(1350 240)">
              {[26, 17, 9].map((r, i) => (
                <circle key={i} r={r} fill="none" stroke="#6FA8DC" strokeWidth={3}
                  strokeDasharray={`${r * 2} ${r}`} opacity={0.7 - i * 0.15}
                  transform={`rotate(${t * 40 + i * 90})`} />
              ))}
            </g>
          )}

          {/* 1002–1047 痛苦与道别：冷色只压边缘 */}
          <rect x={-300} y={-200} width={560} height={1118} fill="#16203C"
            opacity={S(t, 1002, 1005) * (1 - S(t, 1042, 1045)) * 0.42} />
          <rect x={1660} y={-200} width={560} height={1118} fill="#16203C"
            opacity={S(t, 1002, 1005) * (1 - S(t, 1042, 1045)) * 0.42} />

          {/* 定义句×2 的双色高亮（水晶/花） */}
          {t >= 1024 && t < 1090 && (
            <g fontFamily={FONT_MONO} opacity={0.9}>
              <rect x={130} y={300} width={330} height={54} rx={9} fill="rgba(255,255,255,0.05)"
                stroke={P2.lilacHi} strokeWidth={1} opacity={S(t, 1024, 1025) * (1 - S(t, 1035, 1036))} />
              <text x={150} y={334} fontSize={18} fill={P2.lilacHi} opacity={S(t, 1024, 1025) * (1 - S(t, 1035, 1036))}>像是水晶的 · 透明的</text>
              <rect x={130} y={370} width={330} height={54} rx={9} fill="rgba(255,255,255,0.05)"
                stroke={P2.pinkHi} strokeWidth={1} opacity={S(t, 1035, 1036)} />
              <text x={150} y={404} fontSize={18} fill={P2.pinkHi} opacity={S(t, 1035, 1036)}>像是花的 · 柔软的</text>
            </g>
          )}

          {/* 1048–1094 记忆的边界：画卷右端撕口与留白 */}
          <g opacity={S(t, 1048, 1051)}>
            <rect x={1440} y={80} width={480} height={460} fill="#241A38" opacity={0.6} />
            <path d="M 1440 70 L 1478 98 L 1452 138 L 1494 174 L 1462 218 L 1500 262 L 1470 310 L 1508 358 L 1476 406 L 1502 450 L 1440 510 Z"
              fill="#F5F1F6" opacity={0.15} stroke={P2.lilac} strokeWidth={1.6} />
            <text x={1462} y={456} fontSize={15} fontFamily={FONT_MONO} fill={P2.ivoryDim}
              opacity={0.75}>memory · 边界</text>
          </g>

          {/* 墙后幼苗：重用开幕粉团的轮廓，低透明度浮现，是“桃子一直在”的想象。 */}
          <g transform="translate(1630 506) scale(1.6)"
            opacity={S(t, 1071, 1075) * (0.17 + 0.06 * Math.sin(t * 2.1))}>
            <circle r={14} fill={P2.pinkHi} />
            <path d="M -10 14 Q 0 34 10 14 Z" fill={P2.pink} />
            <ellipse cy={39} rx={18} ry={3} fill={P2.pinkHi} opacity={0.5} />
          </g>

          {/* 1090 全都保存下来：粉色保存粒子 */}
          <g opacity={S(t, 1090, 1090.6) * (1 - S(t, 1094.5, 1095.5))}>
            {Array.from({ length: 26 }).map((_, i) => {
              const x = 300 + random(`sv${i}`) * 1320;
              const y = 130 + ((t * (40 + random(`svv${i}`) * 60) + random(`svo${i}`) * 300) % 420);
              return <rect key={i} x={x} y={614 - y} width={8} height={8} fill={P2.pinkHi} opacity={0.7} />;
            })}
            <text x={960} y={150} textAnchor="middle" fontSize={30} fill={P2.pinkHi}
              fontFamily={FONT_MONO} letterSpacing={6}>SAVING …</text>
          </g>

          {/* 玩笑的♪（971–977） */}
          <text x={790} y={230 - Math.abs(Math.sin(t * 2.4)) * 12} fontSize={24}
            fill={P2.pinkHi} fontFamily={FONT_MONO}
            opacity={S(t, 971, 971.5) * (1 - S(t, 977, 978))}>♪</text>

          </g>
        </g>

        {/* 幕末：升维白屏由 Loading 接管；这里先压一层 */}
        <rect width="1920" height="718" fill="#F7F3F0" opacity={S(t, 1095, 1096) * 0.9} />
      </svg>

      {/* 已学会卡片（每次学习确认后归档一张） */}
      <div style={{ position: "absolute", right: 66, top: 70, fontFamily: FONT_MONO }}>
        {LEARNED.map((l, i) => {
          const o = S(t, l.at, l.at + 0.5) * (1 - S(t, 1088, 1090));
          if (o <= 0) return null;
          return (
            <div key={i} style={{
              fontSize: 15, color: P2.pinkHi, opacity: o * 0.9, marginBottom: 8,
              border: `1px solid ${P2.pinkHi}44`, borderRadius: 8, padding: "6px 12px",
              background: "rgba(20,12,28,0.55)",
            }}>
              ✓ {l.text}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
