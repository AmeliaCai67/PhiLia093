import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FPS } from "../scriptFull";
import { P2 } from "../../v2/palette2";
import { S } from "../kit";
import { RecordCard } from "./shared";
import { camT, roomCam, storyCam } from "../staging";
import { boundaryAt, GAP_ECHO_AT } from "../narrative";
import { archPath, archEnds } from "../scenes/cageGeometry";
import { FlowerRoom } from "../scenes/FlowerRoom";
import { CrystalStory } from "../scenes/CrystalStory";

/**
 * 第六幕 · 记忆的花（1098.5–1389.5）—— 重制版
 * 花房（房间层，roomCam）与绘本世界（CrystalStory，storyCam）由绝对秒切换；
 * 镜头语言见 staging.ts。台词与原声不动，全部演出 keyed 到源片绝对时间。
 *
 * 叙事结构：
 *  1099–1154 花房对坐（不对称双主体中景，故事由递出的纸页开启）→
 *  1155–1241 绘本 A：初稿（无瑕封闭 → 倒影 → 守候 → 破碎 → 碎片的光 → 「爱」→ 闭环）→
 *  1241–1253 回花房（故事从它的一侧递到她一侧）→
 *  1254–1303 绘本 B：她提笔改稿（答案之光被擦去 → 空地面 → 封闭的示意）→
 *  1304–1313 回花房（疑惑与温柔的邀请）→
 *  1314–1341 绘本 C：改写的回放（破碎=抗争 → 碎片映出双眼 → 不闭合的花）→
 *  1342–1389 回花房（它仍不懂；查找「昔涟♪」；1386 好像有哪里不太对?）
 */
export const Act6: React.FC = () => {
  const frame = useCurrentFrame();
  const t = 1098.5 + frame / FPS;

  return (
    <AbsoluteFill style={{ position: "absolute", top: 46, height: 718, overflow: "hidden" }}>
      <svg width="1920" height="718" viewBox="0 0 1920 718" preserveAspectRatio="none" style={{ display: "block" }}>
        <defs>
          <radialGradient id="a6wisp">
            <stop offset="0%" stopColor="#FFD9E0" />
            <stop offset="100%" stopColor="rgba(242,167,184,0)" />
          </radialGradient>
          <radialGradient id="a6gold">
            <stop offset="0%" stopColor="#FFE9B8" />
            <stop offset="100%" stopColor="rgba(232,201,160,0)" />
          </radialGradient>
          <radialGradient id="a6roomGlow" cx="0.28" cy="0.34" r="0.85">
            <stop offset="0%" stopColor="rgba(255,240,246,0.9)" />
            <stop offset="55%" stopColor="rgba(250,228,232,0.35)" />
            <stop offset="100%" stopColor="rgba(240,222,226,0)" />
          </radialGradient>
          <radialGradient id="a6spiritGlow">
            <stop offset="0%" stopColor="rgba(238,232,250,0.9)" />
            <stop offset="100%" stopColor="rgba(238,232,250,0)" />
          </radialGradient>
          <linearGradient id="a6paperLight" x1="0" y1="0" x2="1" y2="0.25">
            <stop offset="0%" stopColor="rgba(255,244,224,0.9)" />
            <stop offset="45%" stopColor="rgba(255,248,236,0.15)" />
            <stop offset="100%" stopColor="rgba(226,216,236,0.12)" />
          </linearGradient>
        </defs>

        {/* 花房（房间层） */}
        <g transform={camT(roomCam(t))}>
          <FlowerRoom t={t} />
        </g>

        {/* 绘本世界（水晶花的故事；storyCam 由 staging.ts 的关键帧给出） */}
        <g transform={`translate(0 -90) ${camT(storyCam(t))}`}>
          <CrystalStory t={t} />
        </g>

        {/* 检索记录卡（1342 后日谈）：一张读完退场，下一张才出现，不互盖 */}
        <RecordCard t={t} at={1363} x={1090} y={130} w={560}
          text="「电信信号序列：PhiLia093……」" goneAt={1376.4} />
        <RecordCard t={t} at={1377} x={1090} y={130} w={640} gold
          text="「电信信号序列：PhiLia093。路径：哀怜。」" goneAt={1388} />

        {/* step21 边界回声（1386–1389.5，Rev.2）：boundaryAt=memory 且到达
            GAP_ECHO_AT（「好像有哪里，不太对?」）时，右侧一片局部同源笼拱线
            微弱回现——断边接在同源拱**实际右端**（archEnds 换算，tx+40 使断边
            落在园艺栅栏两杆之间，不叠原粗杆）并向下延续到舞台地面，两段留
            24px 缺口；是故事回声非物理开笼，无爆裂/无跨越；1388 幕末轻压盖过、
            1390 交接 Act7 画廊 */}
        {boundaryAt(t) === "memory" && t >= GAP_ECHO_AT && (() => {
          const o = S(t, 1386, 1387.2) * (1 - S(t, 1388.2, 1389.4));
          if (o <= 0) return null;
          const s = 0.85, tx = 720, ty = 240;
          const ex = tx + archEnds.right.x * s;   // ≈1779：拱实际右端（栅栏杆间）
          const ey = ty + archEnds.right.y * s;   // ≈514
          const floorY = 650;                     // 舞台内地面附近
          return (
            <g opacity={o * 0.55} transform="translate(0 -100)">
              <path d={archPath()} transform={`translate(${tx} ${ty}) scale(${s})`} fill="none"
                stroke={P2.lilac} strokeWidth={1.4} opacity={0.6} strokeLinecap="round" />
              {/* 断边：右端向下延续，两段留 24px 缺口（568–592） */}
              <line x1={ex} y1={ey} x2={ex} y2={568} stroke={P2.lilacHi}
                strokeWidth={2} opacity={0.7} strokeLinecap="round" />
              <line x1={ex} y1={592} x2={ex} y2={floorY} stroke={P2.lilacHi}
                strokeWidth={2} opacity={0.7} strokeLinecap="round" />
            </g>
          );
        })()}

        {/* 幕末轻压（白由 Loading 接管） */}
        <rect width="1920" height="718" fill="#F7F3F0" opacity={S(t, 1388, 1389.4) * 0.5} />
      </svg>
    </AbsoluteFill>
  );
};
