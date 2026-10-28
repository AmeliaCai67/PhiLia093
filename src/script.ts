// ─────────────────────────────────────────────────────────────────
// 演出脚本 = 数据。加内容不需要动组件：往 BEATS 里加一行就是加一场戏。
//
// 行的来源标记：
//   [帧核] 从全分辨率帧（analysis/src_shots/）人工抄录，可靠
//   [转录] 来自 transcribe.sh 转录稿（台词有语音 ✓，>>> 行也是读出来的 ✓）
//   [待校] 其余
//
// bg: black = 黑场终端｜garden = 花笼记忆｜gardenDark = 花笼（夜）
// line 为空 = 只有画面和 ▼（原演出有无字时刻，如 seg 588s）
// ─────────────────────────────────────────────────────────────────

export type BgKind = "black" | "garden" | "gardenDark";

export interface Beat {
  /** 「」内的章题；空串 = 不显示 */
  title: string;
  /** 完整一行，含 >>> 前缀；空串 = 无字时刻 */
  line: string;
  bg: BgKind;
  /** 花笼里是否悬浮紫色光蕊（部分镜头有） */
  wisp?: boolean;
  /** 该拍额外定格秒数；缺省 1.6s */
  holdSec?: number;
}

export const FPS = 30;
/** 打字机速度：每字符帧数（≈ 22ms/字） */
export const FRAMES_PER_CHAR = 0.75;
/** 打字机起播延迟 */
export const TYPE_DELAY_FRAMES = 8;
/** 拍间交叉溶解 */
export const CROSSFADE = 12;

// ★ v1 预览：只放帧核过的两拍。全量脚本（转录校对 → 全部章题/行）是下一步。
export const BEATS: Beat[] = [
  {
    // 原演出：seg 2.1s–11.6s 黑屏，此行挂满全场，配音盖在上面 [帧核 t4/t8]
    title: "记忆的种子",
    line: ">>>订正：PhiLiA093的记录#496，已归档。",
    bg: "black",
    holdSec: 8.0,
  },
  {
    // 原演出：seg 520s，花笼 + 笼内小妖精 + 光蕊 [帧核 t520]
    title: "记忆的幼芽",
    line: ">>>小妖精。好朋友。嘻。再见。",
    bg: "garden",
    wisp: true,
    holdSec: 3.0,
  },
  {
    // 原演出：seg 588s 前后有无字时刻（昔涟坐笼外，无覆盖字）[帧核 t588]
    title: "",
    line: "",
    bg: "garden",
    holdSec: 3.2,
  },
];

export function beatFrames(b: Beat): number {
  const type = TYPE_DELAY_FRAMES + b.line.length * FRAMES_PER_CHAR;
  return Math.ceil(type + (b.holdSec ?? 1.6) * FPS);
}

export function totalDuration(): number {
  return BEATS.reduce((acc, b) => acc + beatFrames(b), 0) + CROSSFADE;
}
