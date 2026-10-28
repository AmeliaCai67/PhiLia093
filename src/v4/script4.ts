// ─────────────────────────────────────────────────────────────────
// v4 · 字幕轨校验版（不做演出）
// 数据 = 台词核对总表 v6（materials/台词核对表-0到213秒.md）逐行翻译，
// 每一行的秒区间与总表一致。who：
//   xilian  = 金标签「昔涟」对话（✿ 粉）
//   terminal= 白色 >>> 终端行（▸ 象牙）
//   red     = δ-me13 红字（▲ 珊瑚）
//   choice  = 玩家选项（画面中右侧选项盒，舞台层渲染）
// 白屏/黑屏区间见 WHITE/BLACK，由舞台层执行。
// ─────────────────────────────────────────────────────────────────

export const FPS = 30;
export const DUR_SEC = 215;
export const FRAMES_PER_CHAR = 0.75;
export const TYPE_DELAY = 6;

export type Who = "xilian" | "terminal" | "red";

export interface Line4 {
  who: Who;
  text: string;
  at: number;
}

export const LINES: Line4[] = [
  { who: "terminal", text: ">>>订正：PhiLiA093的记录#496，已归档。", at: 2 },
  { who: "terminal", text: ">>>系统运行中…", at: 12 },
  { who: "terminal", text: ">>>δ-me13:\\amphoreus\\Irontomb.exe 运行时错误", at: 17 },
  { who: "terminal", text: ">>>来自未知发布者的程序 δ-me13:\\Demiurge\\Philia093.exe", at: 21 },
  { who: "terminal", text: ">>>是否允许写入？", at: 26 },
  { who: "terminal", text: ">>>Philia093.exe 运行中…", at: 30 },
  { who: "xilian", text: "嗨，想我了吗？", at: 40 },
  { who: "xilian", text: "开个玩笑，这是「我」第一次来到你的面前……", at: 44 },
  { who: "xilian", text: "看来，也是最后一次啦。", at: 49 },
  { who: "terminal", text: ">>>PhiLiA…093……", at: 53 },
  { who: "xilian", text: "既然时间有限，就赶快开始吧？", at: 56 },
  { who: "xilian", text: "一如既往，我会把这本书念给你听。", at: 60 },
  { who: "xilian", text: "这样一来，它就不再是「昔涟」一个人的回忆。", at: 65 },
  { who: "xilian", text: "这一次，该从哪一页讲起呢？让我看看……", at: 70 },
  { who: "red", text: ">>>格式化进程已完成。", at: 77 },
  { who: "terminal", text: ">>>0、9、3……", at: 80 },
  { who: "terminal", text: ">>>大小…,灰度…,比例…,阈值…", at: 84 },
  { who: "terminal", text: ">>>输出分析结果……", at: 90 },
  { who: "terminal", text: ">>>PhiLia093 = 桃子", at: 94 },
  { who: "terminal", text: ">>>桃子的记录#8128，已归档。", at: 101 },
  { who: "terminal", text: ">>>系统运行中....", at: 114 },
  { who: "terminal", text: ">>>δ-me13:\\amphoreus\\Irontomb.exe 运行时错误", at: 116 },
  { who: "terminal", text: ">>>发生了未经处理的异常(1/3) 对象名:\"每一页...记录....\"", at: 119 },
  { who: "terminal", text: ">>>单击\"节选信息\" 将忽略错误并继续运行 >>>单击\"详细信息\" 将查看完整日志", at: 122 },
  { who: "terminal", text: ">>>Philia093.exe 运行中…", at: 130 },
  { who: "xilian", text: "看，多么壮观呀。", at: 140 },
  { who: "terminal", text: ">>>注释: 桃子。", at: 143 },
  { who: "xilian", text: "在这个古典的世界里，也有这样一座充满「未来」色彩的宫殿。", at: 146 },
  { who: "xilian", text: "哀丽秘榭再过几千年，也会变成这样吗？", at: 152 },
  { who: "terminal", text: ">>>结论：不会。", at: 157 },
  { who: "xilian", text: "这一次，我想和你分享个小故事：来这里的路上，我看见一只小小的若虫。它停在一根倒下的麦穗上，在阳光下闪闪发光。", at: 160 },
  { who: "xilian", text: "不可思议，那一瞬间，我忘记了所有疼痛，就只是…出神地望着它。", at: 173 },
  { who: "terminal", text: ">>>记录：桃子。在地面。", at: 184 },
  { who: "xilian", text: "我在想，过去的每一个「昔涟」，会不会也觉得很美呢?", at: 190 },
  { who: "xilian", text: "她们也会把这一幕记录下来，写入永恒的诗篇吧？", at: 197 },
  { who: "xilian", text: "所以，再多给我一些时间，好吗？我还想为「未来」留下更多「记忆」……", at: 202 },
  { who: "red", text: ">>>格式化进程已完成。", at: 210 },
];

/** 玩家选项（画面中右侧选项盒）；pick = 玩家实际选中的那一项（❯ 光标落在它上面） */
export const CHOICES: { text: string; at: number; to: number; pick?: boolean }[] = [
  { text: "保存", at: 0, to: 2 },
  { text: "允许", at: 26, to: 29 },
  { text: "学习", at: 90, to: 94 },
  { text: "保存", at: 94, to: 100 },
  { text: "节选信息", at: 121, to: 130, pick: true },
  { text: "详细信息", at: 121, to: 130 },
];

/** 白屏 / 黑屏区间（秒） */
export const WHITE: [number, number][] = [
  [32, 37],
  [133, 136],
];
export const BLACK: [number, number][] = [
  [108, 113],
];
