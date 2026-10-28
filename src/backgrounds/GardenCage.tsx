import React from "react";
import { AbsoluteFill, random, useCurrentFrame } from "remotion";
import { PALETTE } from "../palette";

const G = PALETTE.garden;

/**
 * 花笼记忆 —— 对照原 CG（t520/t588）的程序化重绘：
 * 高调粉白渐变天光、左侧双拱柱、右侧圆柱鸟笼（银链斜挂、藤蔓花簇）、
 * 笼内长耳小妖精（可选紫色光蕊）、笼外昔涟坐姿剪影、粉丝带垂地、
 * 角落白羽草、飘落花瓣。夜幕变体叠加蓝紫罩色。
 */
export const GardenCage: React.FC<{ night?: boolean; wisp?: boolean }> = ({
  night = false,
  wisp = false,
}) => {
  const frame = useCurrentFrame();
  const breathe = 1 + 0.015 * Math.sin(frame / 80);

  return (
    <AbsoluteFill style={{ filter: `brightness(${breathe})` }}>
      <svg width="100%" height="100%" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={G.skyTop} />
            <stop offset="52%" stopColor={G.skyMid} />
            <stop offset="100%" stopColor={G.skyBottom} />
          </linearGradient>
          <radialGradient id="pinkHaze" cx="18%" cy="12%" r="55%">
            <stop offset="0%" stopColor="rgba(246,196,210,0.32)" />
            <stop offset="100%" stopColor="rgba(246,196,210,0)" />
          </radialGradient>
          <linearGradient id="pillar" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255,255,255,0.95)" />
            <stop offset="80%" stopColor="rgba(255,244,248,0.35)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
          <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F7E9EC" />
            <stop offset="100%" stopColor="#E9E2F2" />
          </linearGradient>
          <linearGradient id="bar" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={G.bar} />
            <stop offset="55%" stopColor="#B7BFE6" />
            <stop offset="100%" stopColor={G.barDeep} />
          </linearGradient>
          <radialGradient id="wispGlow">
            <stop offset="0%" stopColor={G.wispCore} />
            <stop offset="35%" stopColor={G.wisp} />
            <stop offset="100%" stopColor="rgba(185,143,227,0)" />
          </radialGradient>
          <filter id="soft8"><feGaussianBlur stdDeviation="8" /></filter>
          <filter id="soft16"><feGaussianBlur stdDeviation="16" /></filter>
          <filter id="soft28"><feGaussianBlur stdDeviation="28" /></filter>
        </defs>

        {/* 天空与光晕 */}
        <rect width="1920" height="1080" fill="url(#sky)" />
        <rect width="1920" height="1080" fill="url(#pinkHaze)" />

        {/* 远景竖缝（极淡） */}
        {[520, 700, 860].map((x) => (
          <line key={x} x1={x} y1={80} x2={x} y2={840} stroke="#FFFFFF" strokeOpacity={0.35} strokeWidth={2} />
        ))}

        {/* 左侧双拱柱 */}
        <g>
          <rect x={60} y={110} width={150} height={770} rx={75} fill="url(#pillar)" filter="url(#soft16)" />
          <rect x={330} y={240} width={105} height={640} rx={52} fill="url(#pillar)" opacity={0.7} filter="url(#soft16)" />
        </g>

        {/* 地板 */}
        <rect y={852} width="1920" height="228" fill="url(#floor)" />
        <ellipse cx={960} cy={872} rx={1100} ry={90} fill="#FFFFFF" opacity={0.55} filter="url(#soft28)" />
        {/* 地板花瓣渍 */}
        {[
          [230, 950, 90, 26], [420, 1010, 70, 20], [120, 1040, 110, 24],
          [620, 980, 55, 16], [840, 1035, 80, 18],
        ].map(([cx, cy, rx, ry], i) => (
          <ellipse key={i} cx={cx} cy={cy} rx={rx} ry={ry} fill={G.petalStem} opacity={0.3} filter="url(#soft8)" />
        ))}
        {/* 粉丝带：从笼底甩向左侧，带一个圈 */}
        <path
          d="M 1180 960 C 900 1010, 620 930, 430 975 C 300 1005, 250 1040, 300 1055 C 350 1070, 420 1030, 380 1005"
          fill="none" stroke={G.ribbon} strokeWidth={11} strokeLinecap="round" opacity={0.85}
        />
        <path
          d="M 1160 935 C 980 905, 800 890, 700 915" fill="none" stroke={G.ribbon} strokeWidth={7} strokeLinecap="round" opacity={0.5}
        />

        {/* 笼底阴影与底座 */}
        <ellipse cx={1440} cy={878} rx={430} ry={42} fill="#8C97CC" opacity={0.15} filter="url(#soft16)" />
        <ellipse cx={1440} cy={874} rx={424} ry={38} fill="none" stroke={G.barDeep} strokeWidth={8} opacity={0.6} />

        {/* 笼内地面微光 */}
        <ellipse cx={1420} cy={852} rx={300} ry={28} fill="#FFFFFF" opacity={0.4} filter="url(#soft16)" />

        {/* ── 笼：后排栏 ── */}
        {[1080, 1200, 1320, 1440, 1560].map((x, i) => (
          <rect key={x} x={x} y={-20} width={11} height={905} rx={5} fill="url(#bar)" opacity={0.4 - i * 0.03} />
        ))}

        {/* ── 笼：锁链（从画面顶斜挂到笼上，末端有锚环；笼内另有一根垂链）── */}
        <path d="M 1010 -30 C 1100 220, 1300 380, 1620 430" fill="none" stroke={G.chain} strokeWidth={16} strokeLinecap="round" strokeDasharray="27 13" opacity={0.8} />
        <circle cx={1620} cy={430} r={9} fill="none" stroke={G.chain} strokeWidth={5} opacity={0.8} />
        <path d="M 1105 -30 C 1190 160, 1400 280, 1690 320" fill="none" stroke={G.chain} strokeWidth={11} strokeLinecap="round" strokeDasharray="21 11" opacity={0.55} />
        <circle cx={1690} cy={320} r={7} fill="none" stroke={G.chain} strokeWidth={4} opacity={0.55} />
        <line x1={1500} y1={-20} x2={1500} y2={430} stroke={G.chain} strokeWidth={10} strokeDasharray="22 12" opacity={0.5} strokeLinecap="round" />
        <circle cx={1500} cy={438} r={7} fill="none" stroke={G.chain} strokeWidth={4} opacity={0.5} />

        {/* ── 笼：藤蔓与花簇 ── */}
        {[
          "M 1200 862 C 1180 690, 1210 470, 1192 240",
          "M 1440 866 C 1460 700, 1430 510, 1450 300",
          "M 1595 860 C 1575 740, 1600 630, 1588 480",
        ].map((d, i) => (
          <path key={i} d={d} fill="none" stroke={G.vine} strokeWidth={5} opacity={0.75} />
        ))}
        {/* 叶 */}
        {Array.from({ length: 16 }).map((_, i) => {
          const x = 1190 + (i % 3) * 200 + ((i * 37) % 40) - 20;
          const y = 800 - i * 40 + ((i * 53) % 30);
          return (
            <ellipse key={i} cx={x} cy={Math.max(220, y)} rx={16} ry={7}
              fill={i % 2 ? "#6F7AB5" : "#8B95CC"} opacity={0.8}
              transform={`rotate(${-35 + (i % 5) * 17} ${x} ${Math.max(220, y)})`} />
          );
        })}
        {/* 花簇 */}
        {[[1200, 780], [1222, 680], [1440, 740], [1462, 610], [1588, 550], [1330, 840], [1520, 826], [1252, 330], [1450, 380]].map(
          ([cx, cy], i) => (
            <g key={i} transform={`translate(${cx} ${cy})`}>
              {[0, 72, 144, 216, 288].map((a) => (
                <circle key={a} cx={Math.cos((a * Math.PI) / 180) * 11} cy={Math.sin((a * Math.PI) / 180) * 11} r={8}
                  fill={a % 144 === 0 ? "#F0C4DD" : G.flower} />
              ))}
              <circle r={5.5} fill={G.flowerCore} />
            </g>
          ),
        )}

        {/* ── 笼内：小妖精（长耳）── */}
        <g transform="translate(1385 728)" opacity={0.96}>
          <ellipse cx={0} cy={92} rx={64} ry={13} fill="#8C97CC" opacity={0.22} filter="url(#soft8)" />
          {/* 长耳 ×2 */}
          <g>
            <rect x={-32} y={-170} width={21} height={102} rx={10.5} fill="#F8F3FB" transform="rotate(-14 -21 -119)" />
            <rect x={11} y={-170} width={21} height={102} rx={10.5} fill="#F8F3FB" transform="rotate(14 21 -119)" />
            <rect x={-28} y={-158} width={11} height={78} rx={5.5} fill="#F3D9E4" transform="rotate(-14 -22 -119)" />
            <rect x={16} y={-158} width={11} height={78} rx={5.5} fill="#F3D9E4" transform="rotate(14 21 -119)" />
          </g>
          {/* 头与身体 */}
          <circle cx={0} cy={-60} r={44} fill="#FAF5FC" />
          <ellipse cx={0} cy={30} rx={55} ry={60} fill="#FBF7FD" />
          {/* 脸 */}
          <circle cx={-15} cy={-62} r={4} fill="#6B6390" />
          <circle cx={15} cy={-62} r={4} fill="#6B6390" />
          <circle cx={-25} cy={-46} r={6} fill="#F3C9D6" opacity={0.8} />
          <circle cx={25} cy={-46} r={6} fill="#F3C9D6" opacity={0.8} />
          <path d="M -6 -48 Q 0 -42 6 -48" stroke="#6B6390" strokeWidth={2.5} fill="none" strokeLinecap="round" />
          {/* 颈部绒毛 */}
          <ellipse cx={0} cy={-25} rx={29} ry={13} fill="#FFFFFF" opacity={0.9} />
        </g>

        {/* ── 笼内光蕊（部分镜头）── */}
        {wisp && (
          <g transform={`translate(1565 ${295 + 12 * Math.sin(frame / 45)})`}>
            <circle r={90} fill="url(#wispGlow)" opacity={0.85} />
            <circle r={15} fill="#FFFFFF" opacity={0.95} />
          </g>
        )}

        {/* ── 笼：前排栏 ── */}
        {[985, 1662, 1742, 1816].map((x, i) => (
          <rect key={x} x={x} y={-20} width={13 - i * 0.5} height={912} rx={6} fill="url(#bar)" opacity={0.82} />
        ))}

        {/* ── 笼外：昔涟（背身坐姿，望向笼子）── */}
        <g transform="translate(620 700)" opacity={0.97}>
          <ellipse cx={0} cy={182} rx={125} ry={20} fill="#8C97CC" opacity={0.2} filter="url(#soft8)" />
          {/* 裙摆 */}
          <path d="M -98 172 C -75 95, -35 62, 0 60 C 38 62, 80 98, 98 172 C 55 188, -55 190, -98 172 Z"
            fill={G.dress} stroke="#D5CFE6" strokeWidth={2} />
          {/* 脖颈（填补发与领之间的缝隙） */}
          <rect x={-14} y={-28} width={28} height={38} rx={11} fill="#F3DDDF" />
          {/* 外套背影 */}
          <path d="M -62 158 C -70 70, -48 6, 0 2 C 48 6, 70 70, 62 158 C 25 170, -25 170, -62 158 Z"
            fill="#4A4258" opacity={0.94} />
          <path d="M -58 120 C -30 132, 30 132, 58 120" stroke="#6A617E" strokeWidth={3} fill="none" opacity={0.7} />
          {/* 后脑勺：粉发圆头 + 发梢内弯 */}
          <path d="M -62 -52 C -66 -112, -30 -128, 0 -128 C 32 -128, 66 -110, 62 -50 C 61 -20, 52 6, 38 14 L 30 10 C 20 -8, 12 -18, 0 -18 C -14 -18, -26 -6, -32 10 L -40 14 C -52 6, -60 -20, -62 -52 Z"
            fill={G.hair} />
          {/* 尖尖的耳朵（从发侧探出） */}
          <path d="M -60 -34 L -74 -46 L -58 -52 Z" fill="#F6D7DA" />
          <path d="M 60 -34 L 74 -46 L 58 -52 Z" fill="#F6D7DA" />
          {/* 呆毛 */}
          <path d="M 0 -126 C 10 -144, 2 -156, -10 -150" stroke={G.hair} strokeWidth={6} fill="none" strokeLinecap="round" />
          {/* 发顶轮廓光 */}
          <path d="M -56 -62 C -58 -108, -28 -126, -2 -127" stroke="#FFFFFF" strokeWidth={4} fill="none" opacity={0.75} strokeLinecap="round" />
        </g>

        {/* ── 白羽草：右下大丛、左下小丛 ── */}
        <FeatherGrass x={1810} y={1085} scale={1.25} flip={false} seed={7} />
        <FeatherGrass x={120} y={1095} scale={0.7} flip={true} seed={13} />

        {/* ── 飘落花瓣（固定种子，确定性动画）── */}
        {Array.from({ length: 14 }).map((_, i) => {
          const sx = random(`x-${i}`) * 1920;
          const speed = 0.6 + random(`s-${i}`) * 1.1;
          const drift = 40 * Math.sin(frame / 60 + i);
          const y = ((frame * speed + random(`o-${i}`) * 1200) % 1240) - 120;
          const rot = frame * (0.5 + random(`r-${i}`)) + i * 30;
          return (
            <ellipse key={i} cx={sx + drift} cy={y} rx={8} ry={4.5} fill={G.petal}
              opacity={0.7} transform={`rotate(${rot} ${sx + drift} ${y})`} />
          );
        })}
      </svg>
      {night && <AbsoluteFill style={{ backgroundColor: G.nightOverlay, opacity: 0.52 }} />}
    </AbsoluteFill>
  );
};

const FeatherGrass: React.FC<{ x: number; y: number; scale: number; flip: boolean; seed: number }> = ({
  x, y, scale, flip, seed,
}) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})`}>
    {Array.from({ length: 7 }).map((_, i) => {
      const a = -18 - i * 12;
      const len = 150 + random(`fg-${seed}-${i}`) * 90;
      const rad = (a * Math.PI) / 180;
      const tx = Math.cos(rad) * len;
      const ty = Math.sin(rad) * len;
      return (
        <g key={i}>
          <line x1={0} y1={0} x2={tx} y2={ty} stroke="#E8D9A8" strokeWidth={3} opacity={0.8} />
          <ellipse cx={tx + 14} cy={ty} rx={34} ry={9} fill="#FDFCF7" stroke="#E8C989" strokeWidth={1.5}
            transform={`rotate(${a} ${tx + 14} ${ty})`} opacity={0.95} />
        </g>
      );
    })}
  </g>
);
