import React from "react";
import { FONT_MONO } from "../../v2/palette2";
import { S, AsciiArt } from "../kit";
import {
  STAGE_W, STAGE_H, FLOWER, GROUND_Y, FAIRY_POS, SHARD_POS, OPEN_POS, winO, storyCam, STAGE_CY,
} from "../staging";

/**
 * 绘本世界 · 水晶花的故事（第六幕核心）
 *
 * 叙事铁律（改稿依据，见 docs/plans/2026-10-12）：
 *  A 1155–1241 德谬歌的初稿：无瑕封闭的花 → 小妖精只看见倒影 → 守候 →
 *    第一次破碎（它的措辞：「掉在地上，碎掉了」）→ 碎片里的光 → 金色「爱」→
 *    暖光连接双方、接近闭合的环 —— 这是它当时的确信，不是全片结论。
 *  B 1253.5–1303.5 昔涟的改稿：提笔擦去「答案之光」→ 空荡荡的地面什么也没有 →
 *    封闭花面的示意：外部的字符痕迹触及边缘却进不去 → 杂色（他者的笔触）逐步显形。
 *  C 1313.5–1341.5 同一次破碎被重新解释：纸页回放 → 破碎是主动抗争 →
 *    边缘敞开、他者的笔触进入 → 每枚碎片映出双眼 → 不闭合的花，缝隙仍在。
 *
 *  ★ 严禁把结尾做成碎片复原为更完整、更闪亮的无瑕花；1346 时它仍不懂爱。
 */

// ── 小妖精（故事里永远是字符画，且必须大到能认出眼睛）────────────
const FAIRY_SIZE = 42;
const ART_SIT = "  (\\.-./)\n  ( o.o )\n /|   |\\\n  d   b";
const ART_BLINK = "  (\\.-./)\n  ( -.- )\n /|   |\\\n  d   b";
const ART_DOWN = "  (\\.-./)\n  ( . . )\n /|   |\\\n  d   b";
const ART_JOY = "  (\\.-./)\n  ( ^.^ )\n /|   |\\\n  d   b";

const INK = "#4A3B5C";
// 粉紫晶体色系（用户校正：水晶花 = 昔涟本色，不许冰蓝）
const CRYST = {
  body: "rgba(247,214,228,0.94)",     // 粉色主体
  bodyDeep: "rgba(233,178,204,0.95)", // 深粉切面
  facet: "rgba(201,163,220,0.55)",    // 丁香紫切面/阴影
  edge: "#B87AA8",                    // 深粉紫描边
  hi: "#FFF0F7",                      // 淡粉象牙高光
  rim: "rgba(255,240,247,0.9)",       // 边缘光
};

/** 花瓣（指向上的晶瓣，底在原点） */
const PETAL_D = "M 0 0 C -48 -42, -52 -112, 0 -168 C 52 -112, 48 -42, 0 0";
const PETALS = 8;

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
/** 线性推进 0→1（a..b 秒） */
const prog = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));
/** 重力下落曲线 */
const fallE = (p: number) => p * p;

// ── 水晶花（无瑕 · 封闭）─────────────────────────────────────
const CrystalFlower: React.FC<{ t: number; intactO: number }> = ({ t, intactO }) => (
  <g opacity={intactO}>
    {/* 茎（晶质，粉紫） */}
    <path d={`M ${FLOWER.cx} ${GROUND_Y} C ${FLOWER.cx - 8} ${GROUND_Y - 70}, ${FLOWER.cx + 8} ${GROUND_Y - 130}, ${FLOWER.cx} ${FLOWER.cy + 168}`}
      fill="none" stroke="#B48BBE" strokeWidth={7} opacity={0.75} />
    <path d={`M ${FLOWER.cx + 2} ${GROUND_Y - 40} l 26 -12 M ${FLOWER.cx - 3} ${GROUND_Y - 92} l -24 -14`}
      stroke="#B48BBE" strokeWidth={4} opacity={0.5} />
    {/* 8 枚粉紫晶瓣：每瓣三块切面（亮/中/暗）+ 棱线高光 + 外缘边缘光 */}
    {Array.from({ length: PETALS }).map((_, i) => {
      const a = i * 45;
      const lit = i % 2 === 0; // 迎光面交替，形成体积
      return (
        <g key={i} transform={`translate(${FLOWER.cx + Math.cos(a * Math.PI / 180) * 30} ${FLOWER.cy + Math.sin(a * Math.PI / 180) * 30}) rotate(${a + 90})`}
          style={{ filter: "drop-shadow(0 0 7px rgba(242,167,184,0.55))" }}>
          {/* 瓣身 */}
          <path d={PETAL_D} fill={CRYST.body} stroke={CRYST.edge} strokeWidth={2.6} />
          {/* 左切面（丁香阴影）与右切面（深粉），交错受光 */}
          <path d="M 0 0 C -48 -42, -52 -112, 0 -168 C -30 -110, -28 -46, 0 0 Z"
            fill={CRYST.facet} opacity={lit ? 0.85 : 0.6} />
          <path d="M 0 0 C 48 -42, 52 -112, 0 -168 C 26 -106, 24 -44, 0 0 Z"
            fill={CRYST.bodyDeep} opacity={lit ? 0.5 : 0.75} />
          {/* 中央棱线高光（淡粉象牙）+ 顶部边缘光 */}
          <path d="M 0 -10 C -8 -44, -9 -84, 0 -128" fill="none" stroke={CRYST.hi} strokeWidth={3.2} opacity={0.9} />
          <path d="M 0 -128 C -6 -142, 6 -142, 0 -168" fill="none" stroke={CRYST.rim} strokeWidth={2.4} opacity={0.85} />
          {/* 根部粉晕 */}
          <ellipse cy={-12} rx={9} ry={16} fill="rgba(255,217,228,0.6)" />
        </g>
      );
    })}
    {/* 封闭的花心：淡粉象牙核 + 丁香棱环，无开口（天衣无缝） */}
    <circle cx={FLOWER.cx} cy={FLOWER.cy} r={38} fill={CRYST.hi} stroke="#C98BB4" strokeWidth={2.4} />
    <circle cx={FLOWER.cx} cy={FLOWER.cy} r={24} fill="none" stroke="rgba(201,163,220,0.75)" strokeWidth={1.6} />
    <circle cx={FLOWER.cx} cy={FLOWER.cy} r={9} fill="#FFFFFF" stroke="#E8B7CE" strokeWidth={1.2} />
    {/* 呼吸的微光（不全程震动） */}
    <circle cx={FLOWER.cx} cy={FLOWER.cy} r={70 + 5 * Math.sin(t * 0.9)} fill="url(#a6wisp)" opacity={0.34} />
  </g>
);

// ── 碎片（花瓣的碎落形态）────────────────────────────────────
const Shard: React.FC<{
  x: number; y: number; rot: number; o?: number; dashed?: boolean; glint?: number; scale?: number;
}> = ({ x, y, rot, o = 1, dashed = false, glint = 0, scale = 0.78 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${scale})`} opacity={o}>
    <path d={PETAL_D} fill={dashed ? "none" : CRYST.body}
      stroke={dashed ? "#9A8FB4" : CRYST.edge} strokeWidth={dashed ? 2 : 2.4}
      strokeDasharray={dashed ? "7 8" : undefined} />
    {!dashed && <path d="M 0 0 C -48 -42, -52 -112, 0 -168 C -28 -104, -26 -44, 0 0 Z"
      fill={CRYST.facet} opacity={0.65} />}
    {!dashed && <path d="M 0 -10 C -8 -44, -9 -84, 0 -128" fill="none" stroke={CRYST.hi} strokeWidth={2.6} opacity={0.85} />}
    {glint > 0 && (
      <g opacity={glint}>
        <text x={-9} y={-52} fontSize={30} fontFamily={FONT_MONO} fill={INK}>o</text>
      </g>
    )}
  </g>
);

// ── 特写碎片（拿起一块，里面是巨大的字符眼）────────────────────
const FeaturedShard: React.FC<{
  x: number; y: number; rot: number; o: number; eye: "left" | "right";
}> = ({ x, y, rot, o, eye }) => {
  if (o <= 0) return null;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`} opacity={o}>
      <g style={{ filter: "drop-shadow(0 6px 14px rgba(90,74,110,0.3))" }}>
        <path d="M 0 0 C -58 -50, -62 -134, 0 -200 C 62 -134, 58 -50, 0 0 Z"
          fill={CRYST.hi} stroke={CRYST.edge} strokeWidth={3} />
      </g>
      <clipPath id={`feat${eye}`}>
        <path d="M 0 0 C -58 -50, -62 -134, 0 -200 C 62 -134, 58 -50, 0 0 Z" />
      </clipPath>
      <g clipPath={`url(#feat${eye})`}>
        {/* 碎片表面映出的小妖精半张脸：两只眼 + 鼻尖 + 脸轮廓，随碎片倾斜、被瓣形裁切 */}
        <g transform={eye === "left" ? "rotate(-14) translate(-6 0)" : "rotate(12) translate(4 0)"}>
          {/* 脸的轮廓（字符画的圆头） */}
          <circle cx={eye === "left" ? -8 : -20} cy={-96} r={62} fill="none"
            stroke="rgba(74,59,92,0.5)" strokeWidth={7} strokeDasharray="70 40" />
          {/* 双眼：字符画的 o o，一大一小（透视） */}
          <text x={eye === "left" ? -52 : -44} y={-84} fontSize={64} fontFamily={FONT_MONO}
            fill={INK} opacity={0.95}>o</text>
          <text x={eye === "left" ? 6 : 14} y={-92} fontSize={52} fontFamily={FONT_MONO}
            fill={INK} opacity={0.8}>o</text>
          {/* 眼上睫毛弧 */}
          <path d={eye === "left" ? "M -58 -128 Q -36 -140 -12 -130" : "M -50 -136 Q -28 -148 -4 -138"}
            fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round" opacity={0.85} />
          {/* 鼻尖与小嘴 */}
          <path d={eye === "left" ? "M -16 -52 q 8 6 16 2" : "M -8 -60 q 8 6 16 2"}
            fill="none" stroke="rgba(74,59,92,0.65)" strokeWidth={4} strokeLinecap="round" />
          {/* 晶面反光斜掠过面部（明暗） */}
          <path d="M -70 -40 L 10 -200" stroke="rgba(255,255,255,0.55)" strokeWidth={16} opacity={0.5} />
          <path d="M -40 -20 L 44 -184" stroke="rgba(201,163,220,0.4)" strokeWidth={9} opacity={0.6} />
        </g>
      </g>
      {/* 外缘边缘光 */}
      <path d="M 0 -2 C -40 -34, -48 -110, 0 -164" fill="none" stroke={CRYST.rim} strokeWidth={2.4} opacity={0.9} />
    </g>
  );
};

// ── 他者的笔触（杂色小记号）─────────────────────────────────
const SCRIBS = [
  { c: "#7FA8CE", g: "ˊ" }, { c: "#C9B8E8", g: "。" }, { c: "#C9A86B", g: "/" },
  { c: "#7FA8CE", g: "、" }, { c: "#D97A93", g: "ˇ" }, { c: "#8A9BCE", g: "·" },
];

export const CrystalStory: React.FC<{ t: number }> = ({ t }) => {
  const oA = winO(t, 1154.5, 1241);
  const oB = winO(t, 1253.5, 1303.5);
  const oC = winO(t, 1313.5, 1341.5);
  const oAny = Math.max(oA, oB, oC);
  if (oAny <= 0) return null;
  // 推近过程中地面可能越过固定HUD；只淡去地面线，主体和纸面不受影响。
  const camera = storyCam(t);
  const groundScreenY = STAGE_CY + (GROUND_Y - camera.fy) * camera.s - 90;
  const groundO = 1 - S(groundScreenY, 560, 580);

  // ── A 段状态 ──
  const fairyIn = t >= 1164;
  const blink = Math.floor(t / 1.6) % 2 === 1;
  const freeze = t >= 1196 && t < 1204;          // 破碎瞬间它停住
  const searching = t >= 1186 && t < 1196;        // 守候期微微前倾
  const sway = freeze || !fairyIn ? 0 : Math.sin(t * 1.2) * (searching ? 1.5 : 3);
  const intactO_A = 1 - prog(t, 1196.2, 1197);    // 花的完整形态
  const cracksO = S(t, 1196, 1196.6) * (1 - S(t, 1197.4, 1198));

  // 纸页层叠 / 光影轻移（1186–1195 时光）
  const timeP = prog(t, 1186, 1195);

  // 破碎后碎片位置（A 段）
  const shardStateA = (i: number) => {
    const delay = i * 0.12;
    const p = fallE(prog(t, 1196.2 + delay, 1197.4 + delay));
    const a = i * 45 * Math.PI / 180;
    const sx = FLOWER.cx + Math.cos(a) * 30;
    const sy = FLOWER.cy + Math.sin(a) * 30;
    const g = SHARD_POS[i];
    return {
      x: sx + (g.x - sx) * p,
      y: sy + (g.y - sy) * p - Math.sin(p * Math.PI) * 26,
      rot: i * 45 + 90 + g.r * p,
      o: 1,
    };
  };

  // 碎片里的光（1206 起，从小到大但不过曝；B 段被擦去）
  const glowO_A = S(t, 1206, 1212) * (1 - S(t, 1238.5, 1240.5)) * oA;
  const glowR = 10 + prog(t, 1206, 1224) * 36;

  // 金色「爱」（1225–1228，它当时的确信）
  const loveO = S(t, 1225, 1225.6) * (1 - S(t, 1228.5, 1229.5));

  // 暖光连接环（1229–1240：接近闭合，留一个缺口）
  const loopO = S(t, 1229.5, 1231.5) * (1 - S(t, 1238, 1240)) * oA;

  // ── B 段状态 ──
  const quillP = prog(t, 1254, 1258.5);
  const quillO = S(t, 1253.5, 1254) * (1 - S(t, 1260, 1261.5));
  const eraseO = S(t, 1258, 1260);                 // 提笔后，碎片轮廓被擦去
  const emptyP = S(t, 1261, 1263);                 // 空荡荡的地面
  const walkP = prog(t, 1263, 1271);               // 小妖精寻找
  const fairyBX = FAIRY_POS.x + walkP * 120;
  const schematicO = S(t, 1277, 1279);             // 封闭花面示意

  // ── C 段状态 ──
  const pageP = prog(t, 1313.5, 1316);             // 纸页翻动
  const intactO_C = S(t, 1315, 1316) * (1 - prog(t, 1317.2, 1318));
  const cracksC = S(t, 1317, 1317.6) * (1 - S(t, 1318.4, 1319));
  // 回放的破碎：同构，但落地即「有方向地散开」
  const shardStateC = (i: number) => {
    const delay = i * 0.12;
    const p = fallE(prog(t, 1317.2 + delay, 1318.4 + delay));
    const a = i * 45 * Math.PI / 180;
    const sx = FLOWER.cx + Math.cos(a) * 30;
    const sy = FLOWER.cy + Math.sin(a) * 30;
    const g = SHARD_POS[i];
    return { x: sx + (g.x - sx) * p, y: sy + (g.y - sy) * p - Math.sin(p * Math.PI) * 26, rot: i * 45 + 90 + g.r * p };
  };
  // 主动敞开：从落点向 OPEN_POS 弧线外推（1321–1328）
  const openP = (i: number) => {
    const p = prog(t, 1321 + i * 0.14, 1327 + i * 0.14);
    const e = p * p * (3 - 2 * p);
    const s = SHARD_POS[i];
    const d = OPEN_POS[i];
    return {
      x: s.x + (d.x - s.x) * e,
      y: s.y + (d.y - s.y) * e - Math.sin(e * Math.PI) * 44,
      rot: s.r + (d.r - s.r) * e,
      e,
    };
  };
  // 特写：拿起两块（1328.5 拿起 A，1332.5 放回、拿起 B，1336 放回）
  const liftA = S(t, 1328.5, 1329.5) * (1 - S(t, 1332, 1332.8));
  const liftB = S(t, 1332.8, 1333.6) * (1 - S(t, 1336, 1336.8));
  const joyP = S(t, 1334, 1335.5);
  const joyBounce = joyP > 0 ? Math.abs(Math.sin(t * 3.2)) * 6 * joyP : 0;

  // 他者的笔触进入（1323–1330：从外部穿过缝隙走进来）
  const inP = (k: number) => prog(t, 1323 + k * 0.9, 1327 + k * 0.9);

  const fairyJoy = t >= 1334 && oC > 0;
  const fairyArtC = fairyJoy ? (Math.floor(t / 1.6) % 2 === 1 ? ART_BLINK : ART_JOY) : ART_SIT;

  // C 段碎片的透明度：特写时其他碎片稍退
  const dimC = (i: number) => {
    const feat = i === 1 ? liftA : i === 4 ? liftB : 0;
    return 1 - feat * 0.55;
  };

  return (
    <g opacity={oAny}>
      {/* 纸面（超出画幅，C 段略带回放的暖调） */}
      <rect x={-300} y={-300} width={STAGE_W + 600} height={STAGE_H + 600} fill="#FFFCF3" />
      {oC > 0 && <rect x={-300} y={-300} width={STAGE_W + 600} height={STAGE_H + 600} fill="#FDF6E8" opacity={oC * 0.55} />}
      {/* 有方向的留白：左侧窗光，右侧渐空 */}
      <rect x={-300} y={-300} width={STAGE_W + 600} height={STAGE_H + 600} fill="url(#a6paperLight)" />

      {/* 地面：在固定信息层前淡出，避免镜头过渡时穿字。 */}
      <g opacity={groundO}>
      <line x1={-300} y1={GROUND_Y} x2={STAGE_W + 300} y2={GROUND_Y} stroke="#D9CBB8" strokeWidth={2.4} opacity={0.8} />
      {Array.from({ length: 26 }).map((_, i) => (
        <path key={i} d={`M ${-160 + i * 92} ${GROUND_Y} l 7 -12`} stroke="#D9CBB8" strokeWidth={1.6} opacity={0.45} />
      ))}

      </g>

      {/* ════ A · 初稿 ════ */}
      <g opacity={oA}>
        <CrystalFlower t={t} intactO={intactO_A} />
        {/* 破碎裂纹（1196 受控裂纹，先裂后落） */}
        {cracksO > 0 && (
          <g stroke="#A75B8E" strokeWidth={2.4} opacity={cracksO} fill="none">
            <path d={`M ${FLOWER.cx} ${FLOWER.cy} l -46 -38 l -18 -44`} />
            <path d={`M ${FLOWER.cx} ${FLOWER.cy} l 52 -30 l 26 -40`} />
            <path d={`M ${FLOWER.cx} ${FLOWER.cy} l -20 52 l -40 30`} />
          </g>
        )}
        {/* A 段碎片 */}
        {t >= 1196.2 && t < 1241 && Array.from({ length: PETALS }).map((_, i) => {
          const s = shardStateA(i);
          const isGlow = i === 2;
          return <Shard key={i} x={s.x} y={s.y} rot={s.rot}
            o={isGlow ? Math.max(0.75, glowO_A) : 1} />;
        })}
        {/* 碎片里的光 */}
        {glowO_A > 0 && (
          <g>
            <circle cx={SHARD_POS[2].x + 4} cy={SHARD_POS[2].y - 26} r={glowR} fill="url(#a6gold)"
              opacity={glowO_A * 0.95} />
            <circle cx={SHARD_POS[2].x + 4} cy={SHARD_POS[2].y - 26} r={glowR * 0.4} fill="#FFF6DC" opacity={glowO_A * 0.9} />
          </g>
        )}
        {/* 金色「爱」 */}
        {loveO > 0 && (
          <text x={SHARD_POS[2].x + 4} y={SHARD_POS[2].y - 74} textAnchor="middle" fontSize={46}
            fill="#C9A86B" fontFamily='"Songti SC",serif' opacity={loveO}
            style={{ filter: "drop-shadow(0 0 12px rgba(232,201,160,0.9))" }}>爱</text>
        )}
        {/* 暖光连接环：接近闭合，留一个缺口（此刻的想象，不是全片结论） */}
        {loopO > 0 && (
          <g opacity={loopO} fill="none">
            <path d={`M ${FAIRY_POS.x + 60} ${FAIRY_POS.y - 10} C ${FAIRY_POS.x + 160} ${FAIRY_POS.y - 190}, ${SHARD_POS[4].x - 60} ${SHARD_POS[4].y - 240}, ${SHARD_POS[4].x - 4} ${SHARD_POS[4].y - 60}`}
              stroke="#E8C9A0" strokeWidth={3.4} strokeLinecap="round" opacity={0.85}
              style={{ filter: "drop-shadow(0 0 8px rgba(232,201,160,0.6))" }} />
            <path d={`M ${FAIRY_POS.x + 66} ${FAIRY_POS.y + 8} C ${FAIRY_POS.x + 170} ${FAIRY_POS.y + 90}, ${SHARD_POS[4].x - 40} ${SHARD_POS[4].y + 80}, ${SHARD_POS[4].x + 6} ${SHARD_POS[4].y + 16}`}
              stroke="#E8C9A0" strokeWidth={2.6} strokeLinecap="round" opacity={0.6} />
            <circle cx={FAIRY_POS.x + 60} cy={FAIRY_POS.y - 10} r={5} fill="#FFE9B8" />
            <circle cx={SHARD_POS[4].x - 4} cy={SHARD_POS[4].y - 60} r={5} fill="#FFE9B8" />
          </g>
        )}
        {/* 时光（1186–1195）：纸页层叠缓落 + 光影角度轻移 */}
        {timeP > 0 && timeP < 1 && (
          <g opacity={(1 - S(t, 1194, 1195.5)) * 0.5}>
            {[0, 1, 2].map((i) => {
              const p = (timeP + i * 0.33) % 1;
              return (
                <rect key={i} x={1200 + p * 260} y={200 + p * 210} width={64} height={84} rx={4}
                  fill="#FFFDF6" stroke="#E4D6BC" strokeWidth={1.2}
                  transform={`rotate(${-14 + p * 10} ${1200 + p * 260} ${200 + p * 210})`}
                  opacity={0.85 - p * 0.5} />
              );
            })}
          </g>
        )}
      </g>

      {/* ════ B · 她的改稿 ════ */}
      <g opacity={oB}>
        {/* 碎片淡出为轮廓，再被擦去（1254 提笔 → 1261 空荡地面） */}
        {t < 1263 && Array.from({ length: PETALS }).map((_, i) => {
          const g = SHARD_POS[i];
          return <Shard key={i} x={g.x} y={g.y} rot={i * 45 + 90 + g.r} dashed
            o={(1 - eraseO) * 0.85} />;
        })}
        {/* 提笔：清晰的一次擦改（她的笔迹盖过「答案之光」的位置） */}
        {quillO > 0 && (
          <g opacity={quillO}>
            <path d="M 880 486 C 1000 508, 1120 516, 1250 490" fill="none" stroke="#5A4A6E"
              strokeWidth={5} strokeLinecap="round" pathLength={1}
              strokeDasharray={1} strokeDashoffset={1 - quillP} />
            <path d="M 880 514 C 1010 534, 1140 538, 1258 516" fill="none" stroke="#5A4A6E"
              strokeWidth={2.4} strokeLinecap="round" opacity={0.55} pathLength={1}
              strokeDasharray={1} strokeDashoffset={1 - clamp01(quillP * 1.15 - 0.15)} />
          </g>
        )}
        {/* 空荡荡的地面：有方向的留白（不是叠灰） */}
        {emptyP > 0 && (
          <g opacity={emptyP}>
            <rect x={520} y={GROUND_Y - 130} width={900} height={150} fill="#FFFCF3" opacity={0.75} />
            <path d="M 560 520 q 60 -8 120 0 M 1220 500 q 50 -6 100 0" stroke="#D9CBB8"
              strokeWidth={1.6} fill="none" opacity={0.55} />
          </g>
        )}
        {/* 封闭花面的示意（1277–1303）：外部的字符痕迹触及边缘却进不去 */}
        {schematicO > 0 && (
          <g opacity={schematicO}>
            <g transform={`translate(${FLOWER.cx} ${FLOWER.cy - 10}) scale(0.72)`} strokeDasharray="8 9">
              {Array.from({ length: PETALS }).map((_, i) => (
                <path key={i} d={PETAL_D} fill="none" stroke="#9A8FB4" strokeWidth={2.6}
                  transform={`rotate(${i * 45 + 90})`} />
              ))}
              <circle r={38} fill="none" stroke="#9A8FB4" strokeWidth={2.2} />
            </g>
            {/* 边界：封闭的轮廓 */}
            <circle cx={FLOWER.cx} cy={FLOWER.cy - 10} r={140} fill="none"
              stroke="rgba(143,184,220,0.5)" strokeWidth={1.8} strokeDasharray="3 10" />
            {/* 他者的笔触在边界外堆叠（逐步显形，进不去） */}
            {SCRIBS.map((sc, k) => {
              const o = S(t, 1281 + k * 3.2, 1282 + k * 3.2);
              const ang = 150 + k * 24;
              const rad = ang * Math.PI / 180;
              const rr = 172 + (k % 2) * 26;
              return (
                <text key={k} x={FLOWER.cx + Math.cos(rad) * rr} y={FLOWER.cy - 10 + Math.sin(rad) * rr}
                  fontSize={30} fill={sc.c} fontFamily={FONT_MONO} opacity={o * 0.9}>{sc.g}</text>
              );
            })}
            {/* 试图进入的一笔：停在边界上 */}
            <g opacity={S(t, 1290, 1291) * 0.9}>
              <text x={FLOWER.cx - 196} y={FLOWER.cy - 4} fontSize={34} fontFamily={FONT_MONO}
                fill="#7FA8CE">o</text>
              <path d={`M ${FLOWER.cx - 178} ${FLOWER.cy - 12} l 26 8`} stroke="#7FA8CE" strokeWidth={3} />
            </g>
          </g>
        )}
      </g>

      {/* ════ C · 改写的回放 ════ */}
      <g opacity={oC}>
        {/* 纸页翻动（区分于初稿：这是纸上的回放） */}
        {pageP > 0 && pageP < 1 && (
          <g opacity={Math.sin(pageP * Math.PI) * 0.85}>
            <rect x={-300 + pageP * (STAGE_W + 600)} y={-300} width={STAGE_W + 600} height={STAGE_H + 600}
              fill="#FFF9EC" opacity={0.4} />
            <line x1={-300 + pageP * (STAGE_W + 600)} y1={-300}
              x2={-300 + pageP * (STAGE_W + 600)} y2={STAGE_H + 300} stroke="#D9C9A8" strokeWidth={3} opacity={0.7} />
          </g>
        )}
        <CrystalFlower t={t} intactO={intactO_C} />
        {cracksC > 0 && (
          <g stroke="#A75B8E" strokeWidth={2.4} opacity={cracksC} fill="none">
            <path d={`M ${FLOWER.cx} ${FLOWER.cy} l -46 -38 l -18 -44`} />
            <path d={`M ${FLOWER.cx} ${FLOWER.cy} l 52 -30 l 26 -40`} />
          </g>
        )}
        {/* 回放碎片 → 主动敞开（不复原花心，缺口保留） */}
        {t >= 1317.2 && Array.from({ length: PETALS }).map((_, i) => {
          const s = openP(i);
          const landed = t >= 1318.4 + i * 0.12;
          const pre = shardStateC(i);
          const x = landed ? s.x : pre.x;
          const y = landed ? s.y : pre.y;
          const rot = landed ? s.rot : pre.rot;
          const o = dimC(i);
          return <Shard key={i} x={x} y={y} rot={rot} o={o}
            glint={t >= 1329 ? 0.55 * o : 0} />;
        })}
        {/* 他者的笔触进入（穿过缝隙，走进花里） */}
        {[0, 1, 2].map((k) => {
          const p = inP(k);
          if (p <= 0 || p >= 1) return null;
          const sc = SCRIBS[k];
          const x = FLOWER.cx - 320 + p * (240 + k * 40);
          const y = GROUND_Y - 90 - k * 36 - Math.sin(p * Math.PI) * 40;
          return (
            <text key={k} x={x} y={y} fontSize={30} fill={sc.c} fontFamily={FONT_MONO}
              opacity={0.85}>{sc.g}</text>
          );
        })}
        {/* 花心位置：空的（不复原） */}
        {t >= 1321 && (
          <circle cx={FLOWER.cx} cy={FLOWER.cy} r={34} fill="none" stroke="#C9BBDB"
            strokeWidth={1.8} strokeDasharray="5 9" opacity={0.5} />
        )}
      </g>

      {/* ════ 小妖精（字符画，共享舞台变换）════ */}
      {/* A 段 */}
      {fairyIn && oA > 0 && (
        <g opacity={1 - S(t, 1173.5, 1174.5) * (1 - S(t, 1185, 1186))}
          transform={`translate(${FAIRY_POS.x + sway} ${FAIRY_POS.y}) rotate(${sway * 0.6} ${FAIRY_POS.x + 90} ${FAIRY_POS.y + 160})`}>
          <AsciiArt art={blink && !freeze ? ART_BLINK : ART_SIT} t={t} start={1164} cps={12}
            x={0} y={-FAIRY_SIZE * 4} size={FAIRY_SIZE} color={INK} opacity={oA} />
        </g>
      )}
      {/* A 段倒影（1175–1185：兜兜转转只看见自己的倒影——表面封闭的证据）。
          倒影贴在左侧晶瓣的表面上，被花瓣形状裁切：看得出「在花上」，却看不进花里。 */}
      <g opacity={S(t, 1175, 1176.5) * (1 - S(t, 1184, 1185.5)) * oA * 0.9}>
        <defs>
          {/* 左上晶瓣（angle 225，特写镜头正对的那一瓣）*/}
          <clipPath id="a6petalRefClip">
            <path d={PETAL_D} transform={`translate(${FLOWER.cx - 21} ${FLOWER.cy - 21}) rotate(315)`} />
          </clipPath>
        </defs>
        <g clipPath="url(#a6petalRefClip)">
          <g transform={`translate(${FLOWER.cx - 138} ${FLOWER.cy + 6}) scale(0.9 -0.9)`}>
            <AsciiArt art={ART_SIT} t={t} start={1170} cps={30} x={0} y={0}
              size={FAIRY_SIZE} color="#8A6B9C" opacity={1} />
          </g>
        </g>
      </g>
      {/* B 段：低头寻找 */}
      {oB > 0 && (
        <g transform={`translate(${fairyBX + Math.sin(t * 1.2) * 2} ${FAIRY_POS.y})`}>
          <AsciiArt art={t >= 1263 && t < 1276 ? ART_DOWN : ART_SIT} t={t} start={1253.5} cps={40}
            x={0} y={-FAIRY_SIZE * 4} size={FAIRY_SIZE} color={INK} opacity={oB} />
        </g>
      )}
      {/* C 段：回应的笑（微弯轮廓，不贴表情包） */}
      {oC > 0 && (
        <g transform={`translate(${FAIRY_POS.x + 16} ${FAIRY_POS.y - joyBounce})`}>
          <AsciiArt art={fairyArtC} t={t} start={1313.5} cps={40}
            x={0} y={-FAIRY_SIZE * 4} size={FAIRY_SIZE} color={INK} opacity={oC} />
        </g>
      )}

      {/* 特写：拿起两枚碎片（最上层），各自映出一只眼 */}
      <FeaturedShard x={868} y={470} rot={-14} o={liftA} eye="left" />
      <FeaturedShard x={1002} y={472} rot={18} o={liftB} eye="right" />

      {/* A 段的暗（破碎一瞬光短暂收敛） */}
      <rect x={-300} y={-300} width={STAGE_W + 600} height={STAGE_H + 600} fill="#4A3B5C"
        opacity={oA * S(t, 1196, 1196.8) * (1 - S(t, 1200, 1203)) * 0.12} />
    </g>
  );
};
