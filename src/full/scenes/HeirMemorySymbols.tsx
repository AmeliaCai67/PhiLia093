import React from "react";
import { S } from "../kit";
import { HEIR_SYMBOLS } from "../data/heirSymbols";

// ─────────────────────────────────────────────────────────────────
// HeirMemorySymbols · 十二代表物 SVG（任务书 step25；总方案 E.2 材质要求）
//
// 原创简化形制（本片美术选择，非官方道具定名）：
//   木剑浅木磨圆边 / 线轴象牙绕金丝末端松圈 / 纸飞机三折面 /
//   杯暗红陶+旧金沿+细裂不滴血 / 花枝生物花瓣细茎浅紫象牙（非晶体）/
//   烧瓶瓶中微光克制 / ★小伊卡徽章（玫瑰粉章+象牙小马：金冠/卷鬃/小翅/卷尾，
//   用户选定替换草编指环） / 葡萄5颗紫球+叶不像晶簇 /
//   半珠明显缺口非圆点 / 棋子低底盘+旧金小冠非勋章 /
//   镜黑紫椭圆+细银边+暗红反光+小柄无五官 / ★金色龙纹徽章（青黑底+旧金边+
//   明金龙纹：双角/长吻/须/S形龙身，用户选定替换龙尾护符）。
// 每件主形 + scale(1,-0.42) 低透明度柔和倒影；尺寸 ~80–120px。
// ─────────────────────────────────────────────────────────────────

const ivory = "#F3E9DC";
const oldGold = "#C9A86B";

const SYMBOLS: Record<string, React.ReactNode> = {
  // 1 白厄 · 小木雕剑（浅木磨圆边，不画燃烧巨剑）
  woodenSword: (
    <g>
      <path d="M -9 -84 Q -9 -96 0 -96 Q 9 -96 9 -84 L 9 -22 L -9 -22 Z"
        fill="#D9B98C" stroke="#B08D5E" strokeWidth={2} strokeLinejoin="round" />
      <line x1={-3} y1={-88} x2={-3} y2={-30} stroke="#C7A671" strokeWidth={1.6} opacity={0.7} />
      <rect x={-19} y={-24} width={38} height={8} rx={4} fill="#B08D5E" />
      <rect x={-4.5} y={-16} width={9} height={14} rx={3} fill="#8A6A44" />
      <circle cx={0} cy={-1} r={5} fill="#8A6A44" />
    </g>
  ),
  // 2 阿格莱雅 · 缠金线线轴（象牙+绕金丝，末端松出一圈）
  goldSpool: (
    <g>
      <rect x={-14} y={-66} width={28} height={9} rx={3.5} fill={ivory} stroke="#C9A86B" strokeWidth={1.6} />
      <rect x={-14} y={-21} width={28} height={9} rx={3.5} fill={ivory} stroke="#C9A86B" strokeWidth={1.6} />
      <rect x={-10} y={-58} width={20} height={38} fill="#EADFC8" stroke="#CBB98F" strokeWidth={1.2} />
      {[-52, -45, -38, -31, -24].map((y) => (
        <line key={y} x1={-10} y1={y + 4} x2={10} y2={y} stroke="#D9A03C" strokeWidth={2.4} />
      ))}
      <path d="M 10 -26 C 26 -22, 32 -10, 22 -3 C 15 2, 8 -3, 11 -10"
        fill="none" stroke="#D9A03C" strokeWidth={2.2} strokeLinecap="round" />
    </g>
  ),
  // 3 缇宝组 · 纸飞机（三个轻微不同色的折面）
  paperPlane: (
    <g>
      <path d="M -36 -14 L 34 -46 L 4 -26 Z" fill="#FBF4E6" stroke="#B8A47E" strokeWidth={1.4} strokeLinejoin="round" />
      <path d="M 34 -46 L 16 -6 L 4 -26 Z" fill="#EFE2C6" stroke="#B8A47E" strokeWidth={1.4} strokeLinejoin="round" />
      <path d="M 34 -46 L 4 -26 L -2 -12 Z" fill="#E2D2AE" stroke="#B8A47E" strokeWidth={1.2} strokeLinejoin="round" />
    </g>
  ),
  // 4 万敌 · 红宝石酒杯（★ 用户追加重画，参考剪贴板图）：
  //   红色杯体＋明亮菱形交错花纹＋暗金属叶/爪形托座（环抱杯腹、短柄、
  //   稳定底座、旧金圆钉）；旧细裂克制保留。色彩暗红/红宝石+灰金属+旧金。
  crackedCup: (
    <g>
      <defs>
        <clipPath id="a7cupClip">
          <path d="M -18 -64 C -23 -54, -24 -40, -17 -30 C -11 -25, 11 -25, 17 -30 C 24 -40, 23 -54, 18 -64 Z" />
        </clipPath>
      </defs>
      {/* 稳定底座＋短柄（暗金属） */}
      <ellipse cx={0} cy={-2} rx={19} ry={5.5} fill="#3A3F4A" stroke="#20242C" strokeWidth={1.5} />
      <path d="M -5 -4 L -4 -16 L 4 -16 L 5 -4 Z" fill="#4A505C" stroke="#20242C" strokeWidth={1.2} />
      {/* 杯体（红宝石，菱形交错花纹裁剪在内） */}
      <path d="M -18 -64 C -23 -54, -24 -40, -17 -30 C -11 -25, 11 -25, 17 -30 C 24 -40, 23 -54, 18 -64 Z"
        fill="#8E2436" stroke="#5A1622" strokeWidth={1.8} strokeLinejoin="round" />
      <g clipPath="url(#a7cupClip)">
        {[-34, -24, -14, -4, 6, 16, 26].map((k) => (
          <g key={k} stroke="#F49CB2" strokeWidth={1.5} opacity={0.9}>
            <line x1={k} y1={-24} x2={k + 34} y2={-58} />
            <line x1={k} y1={-24} x2={k - 34} y2={-58} />
          </g>
        ))}
      </g>
      <ellipse cx={0} cy={-64} rx={18} ry={4.5} fill="#C24A5E" stroke="#5A1622" strokeWidth={1.6} />
      {/* 旧细裂（克制保留，不滴血） */}
      <path d="M -5 -60 L -2 -50 L -5 -41" fill="none" stroke="#40101C" strokeWidth={1.3} opacity={0.9} />
      {/* 暗金属叶/爪形托座（环抱杯腹）＋旧金圆钉 */}
      <path d="M -2 -18 C -16 -20, -26 -30, -22 -42 C -13 -35, -4 -30, 1 -26 Z"
        fill="#3E4450" stroke="#20242C" strokeWidth={1.5} strokeLinejoin="round" />
      <path d="M 2 -18 C 16 -20, 26 -30, 22 -42 C 13 -35, 4 -30, -1 -26 Z"
        fill="#3E4450" stroke="#20242C" strokeWidth={1.5} strokeLinejoin="round" />
      <path d="M -20 -40 C -17 -37, -12 -34, -8 -32" fill="none" stroke="#59616F" strokeWidth={1.2} />
      <path d="M 20 -40 C 17 -37, 12 -34, 8 -32" fill="none" stroke="#59616F" strokeWidth={1.2} />
      <circle cx={0} cy={-20} r={3} fill={oldGold} stroke="#8F6F3E" strokeWidth={1.2} />
    </g>
  ),
  // 5 遐蝶 · 安提灵花枝（生物花瓣/细茎浅紫象牙，非本片晶体花）
  antilaStem: (
    <g>
      <path d="M 0 0 C -5 -20, 3 -40, -2 -58" fill="none" stroke="#A89BC0" strokeWidth={2.6} strokeLinecap="round" />
      <ellipse cx={9} cy={-30} rx={11} ry={5} fill="#B7C9A8" opacity={0.9} transform="rotate(-24 9 -30)" />
      {[
        [-13, -64, -40], [0, -72, 0], [13, -64, 40], [-7, -58, -20], [7, -58, 20],
      ].map(([px, py, r], i) => (
        <ellipse key={i} cx={px} cy={py} rx={6.5} ry={12} fill="#E6DDF2" stroke="#B9A8D6"
          strokeWidth={1.4} transform={`rotate(${r} ${px} ${py})`} />
      ))}
      <circle cx={0} cy={-64} r={4} fill="#F2ECFA" stroke="#C9B8E0" strokeWidth={1.2} />
      <circle cx={-5} cy={-46} r={2.6} fill="#EFE8F8" />
    </g>
  ),
  // 6 那刻夏 · 绿光烧瓶（小玻璃瓶+瓶中微光，非大号药剂UI）
  greenFlask: (
    <g>
      <rect x={-4.5} y={-46} width={9} height={16} fill="rgba(210,235,220,0.4)" stroke="#9FB8AC" strokeWidth={1.6} />
      <path d="M -17 -14 C -17 -2, -8 4, 0 4 C 8 4, 17 -2, 17 -14 C 17 -24, 9 -27, 9 -30 L -9 -30 C -9 -27, -17 -24, -17 -14 Z"
        fill="rgba(210,235,220,0.32)" stroke="#9FB8AC" strokeWidth={1.8} strokeLinejoin="round" />
      <path d="M -14 -12 C -12 -5, -6 -1, 0 -1 C 6 -1, 12 -5, 14 -12 C 8 -15, -8 -15, -14 -12 Z"
        fill="#58B984" opacity={0.45} />
      <circle cx={0} cy={-10} r={4.5} fill="#7FD6A0" opacity={0.9} />
      <circle cx={0} cy={-10} r={9} fill="#7FD6A0" opacity={0.22} />
    </g>
  ),
  // 7 风堇 · 小伊卡徽章（★ 用户选定替换草编指环；参考「了不起的小伊卡」
  //   设定图实读后原创 SVG）：无圆框/底盘的象牙色小马侧影——
  //   金冠、竖耳、青绿卷鬃、小翅、卷尾、腮红，五官可辨（不是白圆脸）
  icaBadge: (
    <g>
      {/* 卷尾（青绿） */}
      <path d="M -22 -30 C -30 -30, -33 -24, -28 -20 C -25 -18, -22 -20, -23 -23"
        fill="none" stroke="#5FB8C8" strokeWidth={3.5} strokeLinecap="round" />
      {/* 丰满身体（象牙） */}
      <path d="M -20 -26 C -26 -34, -22 -44, -12 -47 C 0 -50, 12 -50, 18 -44 C 24 -38, 22 -30, 14 -26 C 4 -22, -10 -22, -20 -26 Z"
        fill="#FBF4EC" stroke="#B08CA0" strokeWidth={1.6} strokeLinejoin="round" />
      {/* 头＋口鼻 */}
      <circle cx={12} cy={-52} r={13} fill="#FBF4EC" stroke="#B08CA0" strokeWidth={1.6} />
      <circle cx={22} cy={-52} r={0.9} fill="#B08CA0" />
      {/* 青绿卷鬃（颈后三卷） */}
      <circle cx={2} cy={-56} r={5} fill="#5FB8C8" stroke="#3E96A6" strokeWidth={1.2} />
      <circle cx={-2} cy={-48} r={4.5} fill="#5FB8C8" stroke="#3E96A6" strokeWidth={1.2} />
      <circle cx={0} cy={-40} r={4} fill="#5FB8C8" stroke="#3E96A6" strokeWidth={1.2} />
      {/* 小翅 */}
      <path d="M -12 -42 C -20 -46, -26 -42, -28 -36 C -22 -36, -16 -34, -11 -36 Z"
        fill="#8FD0DC" stroke="#4A9AAC" strokeWidth={1.4} strokeLinejoin="round" />
      {/* 耳＋金冠 */}
      <path d="M 6 -63 L 9 -69 L 12 -63 Z" fill="#FBF4EC" stroke="#B08CA0" strokeWidth={1.2} />
      <path d="M 5 -63 L 4 -71 L 8 -67 L 12 -73 L 16 -67 L 20 -71 L 19 -63 Z"
        fill="#E8C9A0" stroke="#B8935A" strokeWidth={1.2} strokeLinejoin="round" />
      {/* 眼/腮红/蹄 */}
      <circle cx={15} cy={-54} r={1.6} fill="#4A3B5C" />
      <circle cx={16.4} cy={-54.6} r={0.6} fill="#FFF" />
      <circle cx={8} cy={-47} r={2.6} fill="#F2B8C8" opacity={0.8} />
      <rect x={-14} y={-24} width={3.5} height={3.5} rx={1} fill="#B08CA0" />
      <rect x={8} y={-24} width={3.5} height={3.5} rx={1} fill="#B08CA0" />
    </g>
  ),
  // 8 赛飞儿 · 一小串葡萄（5颗紫球+叶，避免像紫色晶簇）
  grapes: (
    <g>
      <path d="M 0 -40 L 2 -28" stroke="#7A5A3A" strokeWidth={2.4} strokeLinecap="round" />
      <ellipse cx={12} cy={-42} rx={12} ry={6} fill="#6FA85C" transform="rotate(-24 12 -42)" />
      {[[-11, -24], [7, -26], [-16, -10], [1, -10], [13, -12]].map(([bx, by], i) => (
        <g key={i}>
          <circle cx={bx} cy={by} r={8.5} fill="#7A4E9E" stroke="#5A3578" strokeWidth={1.5} />
          <circle cx={bx - 2.5} cy={by - 2.5} r={2} fill="#FFF" opacity={0.45} />
        </g>
      ))}
    </g>
  ),
  // 9 海瑟音 · 半颗珍珠（平切口半珠，明显缺口非月牙，青白珠光+浅粉内切面）
  halfPearl: (
    <g>
      <path d="M -4 -46 A 22 22 0 1 0 -4 -2 L -2 -30 L -4 -46 Z"
        fill="url(#a7pearl)" stroke="#9FB4BC" strokeWidth={1.6} strokeLinejoin="round" />
      <path d="M -4 -46 L -1 -30 L -3 -18 L -2 -8 L -4 -2" fill="none" stroke="#E8C9D8"
        strokeWidth={2.8} opacity={0.9} strokeLinejoin="round" />
      <ellipse cx={-12} cy={-33} rx={5} ry={8} fill="#FFF" opacity={0.55} transform="rotate(-18 -12 -33)" />
    </g>
  ),
  // 10 刻律德菈 · 王冠棋子（深蓝低底盘+旧金小冠，非奖章）
  crownChess: (
    <g>
      <ellipse cx={0} cy={-3} rx={20} ry={6} fill="#2E3A5C" stroke="#1E2740" strokeWidth={1.6} />
      <path d="M -13 -5 L -9 -19 L 9 -19 L 13 -5 Z" fill="#35446B" stroke="#1E2740" strokeWidth={1.4} />
      <path d="M -9 -19 L -9 -32 L -4 -26 L 0 -35 L 4 -26 L 9 -32 L 9 -19 Z"
        fill={oldGold} stroke="#9A7B45" strokeWidth={1.5} strokeLinejoin="round" />
      <circle cx={0} cy={-25} r={1.8} fill="#7A2438" opacity={0.8} />
    </g>
  ),
  // 11 长夜月 · 暗色小镜（黑紫椭圆+细银边+暗红反光+小柄，无五官）
  darkMirror: (
    <g>
      <rect x={-3} y={-10} width={6} height={10} rx={2.5} fill="#B8B8C4" opacity={0.85} />
      <ellipse cx={0} cy={-28} rx={14} ry={20} fill="#241530" stroke="#B8B8C4" strokeWidth={2} />
      <ellipse cx={0} cy={-28} rx={9.5} ry={15} fill="#2E1C3E" />
      <ellipse cx={-4} cy={-34} rx={3} ry={6.5} fill="#7A2438" opacity={0.7} transform="rotate(18 -4 -34)" />
    </g>
  ),
  // 12 丹恒·腾荒 · 金色龙纹徽章（★ 用户选定替换龙尾护符；参考腾荒立绘
  //   实读后原创 SVG，不沿用青玉尾抱土）：无圆框/底盘的明金
  //   龙纹——龙头（双角、长吻、须、眼）、S 形弯曲龙身与尾梢，明显龙形
  dragonBadge: (
    <g>
      {/* S 形龙身（旧金描边＋明金芯） */}
      <path d="M 8 -58 C 22 -50, 22 -36, 8 -30 C -6 -24, -10 -16, -2 -10 C 2 -7, 7 -8, 9 -12"
        fill="none" stroke="#B8935A" strokeWidth={7.5} strokeLinecap="round" />
      <path d="M 8 -58 C 22 -50, 22 -36, 8 -30 C -6 -24, -10 -16, -2 -10 C 2 -7, 7 -8, 9 -12"
        fill="none" stroke="#E8C25A" strokeWidth={4.6} strokeLinecap="round" />
      {/* 龙头（长吻朝右）＋双角＋须＋眼 */}
      <path d="M 6 -64 C 14 -68, 24 -66, 28 -59 C 29 -56, 26 -54, 22 -54 L 12 -52 C 8 -52, 6 -56, 6 -60 Z"
        fill="#E8C25A" stroke="#8F6F3E" strokeWidth={1.2} strokeLinejoin="round" />
      <path d="M 10 -66 C 9 -70, 6 -73, 2 -74" fill="none" stroke="#E8C25A" strokeWidth={2.2} strokeLinecap="round" />
      <path d="M 15 -66 C 15 -70, 14 -72, 12 -74" fill="none" stroke="#E8C25A" strokeWidth={2} strokeLinecap="round" />
      <path d="M 28 -59 C 33 -58, 34 -54, 31 -50" fill="none" stroke="#F2D98A" strokeWidth={1.4} strokeLinecap="round" />
      <circle cx={18} cy={-60} r={1.3} fill="#1B2E36" />
      {/* 尾梢＋前爪 */}
      <path d="M 9 -12 C 15 -10, 17 -5, 13 -2 C 11 -6, 7 -8, 7 -11 Z" fill="#E8C25A" stroke="#8F6F3E" strokeWidth={1} />
      <path d="M 4 -28 L 8 -22" stroke="#E8C25A" strokeWidth={3} strokeLinecap="round" />
      {/* 鳞节 */}
      {[[-6, -22], [4, -34], [12, -46]].map(([tx, ty], i) => (
        <line key={i} x1={tx - 2.5} y1={ty + 1.5} x2={tx + 2.5} y2={ty - 1.5} stroke="#B8935A" strokeWidth={1.4} />
      ))}
    </g>
  ),
};

export const HeirMemorySymbols: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <defs>
      <radialGradient id="a7pearl" cx="35%" cy="30%" r="80%">
        <stop offset="0%" stopColor="#F4FAFB" />
        <stop offset="60%" stopColor="#D3E2E6" />
        <stop offset="100%" stopColor="#AFC4CB" />
      </radialGradient>
    </defs>
    {HEIR_SYMBOLS.map(({ id, at, x, y, s }) => {
      const o = S(t, at, at + 0.6);
      if (o <= 0) return null;
      return (
        <g key={id} transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
          {/* 柔和倒影（贴水面镜射）——★ Rev.2：更浅更淡，不粘成共享底座 */}
          <g transform="scale(1 -0.3)" opacity={0.11}>{SYMBOLS[id]}</g>
          {SYMBOLS[id]}
        </g>
      );
    })}
  </g>
);
