import { interpolate } from "remotion";

/**
 * 第六幕舞台调度（staging）—— 全部由绝对秒求出的纯函数。
 * 不用 CSS transition / 系统时间 / 未 seed 随机 / useEffect 累积动画。
 *
 * 坐标系：舞台本地坐标 1920×718（组件 AbsoluteFill top=46, height=718）。
 * 台词沉底框占据 764 以下（全局），LOG 占左上 —— 舞台可安全使用的区域即全部 718 高，
 * 但左上 (0..~520, 0..~230) 会被 LOG 叠印，构图时避免在那里放正脸/关键文字。
 */

export const FPS = 30;
export const STAGE_W = 1920;
export const STAGE_H = 718;
export const STAGE_CX = 960;
export const STAGE_CY = 359;

/** 镜头：s 缩放，(fx,fy) 焦点（舞台坐标）。camT 生成 SVG transform。 */
export interface Cam { s: number; fx: number; fy: number }

export const camT = (c: Cam) =>
  `translate(${STAGE_CX - c.fx * c.s} ${STAGE_CY - c.fy * c.s}) scale(${c.s})`;

type Key = [t: number, s: number, fx: number, fy: number];

/** 关键帧插值：相邻关键帧之间 smoothstep，纯函数，可复现。 */
const kf = (t: number, keys: Key[]): Cam => {
  if (t <= keys[0][0]) return { s: keys[0][1], fx: keys[0][2], fy: keys[0][3] };
  for (let i = 1; i < keys.length; i++) {
    if (t <= keys[i][0]) {
      const [t0, s0, x0, y0] = keys[i - 1];
      const [t1, s1, x1, y1] = keys[i];
      const p = interpolate((t - t0) / (t1 - t0), [0, 1], [0, 1]);
      const e = p * p * (3 - 2 * p); // smoothstep
      return { s: s0 + (s1 - s0) * e, fx: x0 + (x1 - x0) * e, fy: y0 + (y1 - y0) * e };
    }
  }
  const L = keys[keys.length - 1];
  return { s: L[1], fx: L[2], fy: L[3] };
};

// ── 绘本世界（水晶花故事）镜头 ─────────────────────────────────
// 1155–1174 全景：花占舞台高 55–70%；1175–1185 花瓣近景（只看见倒影）；
// 1186–1195 稳定双主体；1196–1205 破碎跟随落地；1206–1228 推近碎片；
// 1229–1240 暖光连接环；1254–1276 空地面；1277–1303 封闭花面示意；
// 1314–1328 改写回放；1329–1336 碎片特写×2；1337–1341 拉开不闭合的花。
const STORY_KEYS: Key[] = [
  [1153, 1.0, 960, 350],
  [1155, 1.0, 960, 340],
  [1173, 1.04, 950, 330],
  [1176, 1.85, 858, 305],
  [1183, 1.85, 912, 318],
  [1186, 1.06, 915, 360],
  [1194, 1.08, 950, 390],
  [1197, 1.12, 960, 430],
  [1204.5, 1.12, 960, 505],
  [1207, 2.05, 800, 548],
  [1224, 2.05, 800, 542],
  [1229, 1.18, 920, 430],
  [1240, 1.18, 920, 430],
  [1254, 1.22, 880, 540],
  [1275, 1.22, 900, 525],
  [1278, 1.38, 960, 370],
  [1302, 1.38, 960, 370],
  [1314, 1.16, 960, 390],
  [1327, 1.2, 960, 410],
  [1329.5, 1.6, 868, 452],
  [1333.5, 1.6, 1002, 458],
  [1337, 1.18, 960, 400],
  [1342, 1.15, 960, 400],
];
export const storyCam = (t: number): Cam => kf(t, STORY_KEYS);

// ── 花房镜头（对坐 / 递故事 / 回应 / 后日谈）───────────────────
const ROOM_KEYS: Key[] = [
  [1098.5, 1.0, 980, 360],
  [1154, 1.06, 1020, 350],
  [1241, 1.02, 980, 370],
  [1253, 1.02, 980, 370],
  [1304, 1.05, 980, 370],
  [1313, 1.05, 980, 370],
  [1342, 1.05, 980, 370],
  [1389.5, 1.0, 980, 372],
];
export const roomCam = (t: number): Cam => kf(t, ROOM_KEYS);

// ── 场景时间窗（绘本世界 ↔ 花房）──────────────────────────────
/** 窗口内 = 1，两端各 fade 秒淡入淡出。 */
export const winO = (t: number, a: number, b: number, fade = 1.2) =>
  interpolate(t, [a, a + fade, b - fade, b], [0, 1, 1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

/** 绘本世界三段：A 初稿讲述 / B 她的改稿 / C 改写的回放 */
export const STORY_A = { a: 1154.5, b: 1241 };
export const STORY_B = { a: 1253.5, b: 1303.5 };
export const STORY_C = { a: 1313.5, b: 1341.5 };
export const storyAO = (t: number) => winO(t, STORY_A.a, STORY_A.b);
export const storyBO = (t: number) => winO(t, STORY_B.a, STORY_B.b);
export const storyCO = (t: number) => winO(t, STORY_C.a, STORY_C.b);

/** 第六幕幕界（与 scriptFull ACTS 一致） */
export const ACT6 = { start: 1098.5, end: 1389.5 };

// ── 固定信息层安全区（提示用，运行时不强制）────────────────────
export const SAFE = {
  log: { x: 0, y: 0, w: 620, h: 240 },          // 左上 LOG 叠印区（全局层）
  pipeline: { x: 60, y: 592, w: 700, h: 126 },  // 左下200% pipeline（舞台坐标）
  loss: { x: 1560, y: 592, w: 330, h: 126 },    // 右下200% loss（舞台坐标）
  caption: { y: 764 },                          // 沉底台词框（全局）
};

// ── 第六幕共享几何 ────────────────────────────────────────────
/** 绘本世界：花心位置 / 地面线 */
export const FLOWER = { cx: 960, cy: 330 };
export const GROUND_Y = 585;

/** 小妖精（字符画）的坐姿点：花左侧 */
export const FAIRY_POS = { x: 628, y: 578 };

/** 破碎后 8 枚碎片的落点（含旋转）。idx 与花瓣一一对应。 */
export const SHARD_POS: { x: number; y: number; r: number }[] = [
  { x: 792, y: 580, r: 26 },
  { x: 862, y: 590, r: -18 },
  { x: 908, y: 566, r: 42 },
  { x: 958, y: 584, r: -30 },
  { x: 1012, y: 570, r: 14 },
  { x: 1066, y: 588, r: -42 },
  { x: 1112, y: 572, r: 30 },
  { x: 1158, y: 592, r: -10 },
];

/** 重写回放（1314+）后碎片主动外敞的落点：往外扩、留缺口、不闭合 */
export const OPEN_POS: { x: number; y: number; r: number }[] = [
  { x: 776, y: 526, r: -52 },
  { x: 836, y: 484, r: -78 },   // 缺口：无 2 号位对点 → 不闭合
  { x: 962, y: 466, r: 6 },
  { x: 1074, y: 482, r: 66 },
  { x: 1130, y: 530, r: 38 },
  { x: 1150, y: 602, r: 88 },
  { x: 884, y: 610, r: -14 },
  { x: 1002, y: 618, r: 18 },
];
