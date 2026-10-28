// ─────────────────────────────────────────────────────────────────
// v3 · 精华段 0:00–3:33（215s 尾含淡出）
// 字幕轨 = 原声（SRT 时刻为骨架，块内按字数比例分句）；文本经画面截条校正。
// 未知专名的处理：哀历逆屑（无法核实）→ 该分句止于「挥之不去」；
// 女儿名（哀厉密些，无法核实）→ 暂以「一个女孩」代替，待菜菜补。
// who: echo = 记忆回响（旁白）｜block = 终端实体｜flower = 昔涟（原字幕金标签）
// sys = 终端事件行（原画面 >>> 行，非人声）
// ─────────────────────────────────────────────────────────────────

export const FPS = 30;
export const DUR_SEC = 215;
export const FRAMES_PER_CHAR = 0.75;
export const TYPE_DELAY = 6;

export type Who = "echo" | "block" | "flower" | "sys";

export interface Line3 {
  who: Who;
  text: string;
  at: number;
}

export const LINES: Line3[] = [
  { who: "echo", text: "好黑,这里是……", at: 1.5 },
  { who: "echo", text: "无名泰坦大墓,记忆最深的角落,也是,昔涟的诞生之地。", at: 5.5 },
  { who: "echo", text: "对不起啊,伙伴,这一路上,取回的记忆越多,我心中的违和感就越是强烈,", at: 13.5 },
  { who: "echo", text: "总有一种不安挥之不去。", at: 26.1 },
  { who: "echo", text: "我望着水面,分不清水中的我和岸边的我,哪一个才是真正的我?", at: 30.5 },
  { who: "echo", text: "但现在,我终于明白了。", at: 39.3 },
  { who: "echo", text: "你看,伙伴,那面墙上的字,就是答案呀。", at: 42.3 },
  { who: "flower", text: "♪ 一二三四五六七", at: 47.5 },
  { who: "flower", text: "不成调的小曲,是小妖精们的歌谣。", at: 51.5 },
  { who: "flower", text: "既然时间有限,就赶快开始吧?", at: 56.0 },
  { who: "flower", text: "一如既往,我会把这本书念给你听。", at: 59.5 },
  { who: "flower", text: "这样一来,它就不再是心里一个人的回忆。", at: 63.6 },
  { who: "flower", text: "我一直以为,自己是烛火之旅的讲述者,但讲故事的人,原来,也是最专心的听众呀。", at: 69.5 },
  { who: "block", text: "很主动的发言啊。", at: 81.5 },
  { who: "block", text: "答案,谢谢,伙伴。真令人安心啊。", at: 85.5 },
  { who: "block", text: "在创始的瞬间,记忆的质量包裹住我。", at: 95.5 },
  { who: "block", text: "在晶莹的水晶中,我看见了无数个昔涟。还有,无数个自己。", at: 101.5 },
  { who: "echo", text: "这就是记忆的最后一块拼图了。", at: 110.5 },
  { who: "echo", text: "一座诞生自智石的囚龙,一片消雨与毁灭的坟茔。", at: 114.5 },
  { who: "echo", text: "那无人知晓的,截然的神灭,不应存在的第十三位泰坦。", at: 120.5 },
  { who: "flower", text: "最初之种,德谬歌。", at: 126.0 },
  { who: "flower", text: "它就在这里。", at: 128.2 },
  { who: "flower", text: "可我的故事,该从哪里说起呢?从宇宙的起点?", at: 133.5 },
  { who: "flower", text: "到你?那也太夸张了。我想讲述的,只是一个很小很小的故事。", at: 140.5 },
  { who: "flower", text: "像,从一枚种子开始。", at: 149.5 },
  { who: "flower", text: "你知道吗,好朋友。", at: 154.5 },
  { who: "flower", text: "梦中的神明告诉我,世界是从一枚种子中发芽的。", at: 158.5 },
  { who: "flower", text: "它长成名为翁法罗斯的大树,而岁月是它沐浴光的枝叶。", at: 166.5 },
  { who: "flower", text: "真巧呢。斑驳的日光,婆娑的树叶,也是人家最初的记忆。", at: 175.5 },
  { who: "flower", text: "一个再寻常不过的清晨,村里最高大的树下,一个女孩,悄然来到世上。", at: 185.5 },
  { who: "flower", text: "多么动人的开篇。", at: 194.5 },
  { who: "flower", text: "一声啼哭,是孩子带给世界最初的礼物。", at: 196.8 },
  { who: "flower", text: "神谕应验了。村民们说,这孩子是泰坦的馈赠。", at: 202.3 },
  { who: "flower", text: "粉色的头发,还有尖尖的耳朵。", at: 208.9 },
  // 终端事件行（原画面 >>> 行）：3:33 的终点
  { who: "sys", text: ">>>格式化进程已完成。", at: 211.5 },
];

/** 舞台归档日志（左上），来自原画面 >>> 行的实测时刻 */
export const LOG_ROWS: { s: string; at: number; warn?: boolean; gold?: boolean }[] = [
  { s: "订正:PhiLiA093的记录#496,已归档", at: 2.2 },
  { s: "来自未知发布者的程序 δ-me13:\\Demiurg", at: 22.0 },
  { s: "桃子的记录#8128,", at: 100.0 },
  { s: "系统运行中....", at: 113.0 },
  { s: "发生了未经处理的异常(1/3)", at: 121.0, warn: true },
  { s: "记录:桃子。在地面。", at: 188.0 },
  { s: "格式化进程已完成。", at: 211.5, gold: true },
];

/** 画面乐章边界（秒） */
export const PH = {
  water: 13.5, // 水面与倒影
  wall: 30.5, // 墙上的字
  song: 47.5, // 歌谣与书
  duo: 69.5, // 讲述者与听众
  handshake: 81.5, // 第一次回应（共情机制上线）
  crystal: 95.5, // 水晶万华镜
  puzzle: 110.5, // 拼图与显现
  chips: 133.5, // 种子问答·候选
  seed: 149.5, // 一枚种子
  canopy: 175.5, // 沐浴光的枝叶
  birth: 185.5, // 树下诞生
  cry: 196.8, // 啼哭（花开）
  ringDone: 211.5, // 格式化进程已完成
};
