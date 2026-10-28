// ─────────────────────────────────────────────────────────────────
// narrative.ts · 心的 formation 状态（任务书 step18，总方案第 4 节）
//
// 纯绝对秒驱动、确定性：同一 t 永远得到同一状态，不靠组件累计。
// 四节点模仿/推断/选择/泛化，各三档：untouched（未触及）/ exploring
// （正在探索）/ evidence（已有证据）——不互斥、不用永久勾号或百分比；
// 节点变化以 0.8s 渐变过渡（任务书 0.6–1.2s）。
//
// 剧情锚点（严格原文时机）：
//   模仿 60 学语 → 580 开口（证据）
//   推断 241 检索关联 → 344 识别不安（证据）→ 795 仍不懂（持续探索）
//     → 1526 行动与回应（继续成长的证据）
//   选择 400 主动回应 → 658 守护后（证据）
//   泛化 867 学习他者 → 1137 自己讲故事（证据）→ 1346 重回探索
//     → 1526 同上的证据
// 1346 仍不懂：推断/泛化重回探索但不归零；永不写「完全懂爱」。
// ─────────────────────────────────────────────────────────────────

export interface NodeMark {
  label: string;
  exploreAt: number;
  evidenceAt: number;
  /** 再次求知：证据降回探索（如 1346） */
  reExploreAt?: number;
  /** 再探索后取得的新证据（如 1526） */
  reEvidenceAt?: number;
}

export const NODES: NodeMark[] = [
  { label: "模仿", exploreAt: 60, evidenceAt: 580 },
  { label: "推断", exploreAt: 241, evidenceAt: 344, reExploreAt: 1346, reEvidenceAt: 1526 },
  { label: "选择", exploreAt: 400, evidenceAt: 658 },
  { label: "泛化", exploreAt: 867, evidenceAt: 1137, reExploreAt: 1346, reEvidenceAt: 1526 },
];

/** 渐变时长（秒） */
export const GRAD = 0.8;

const rise = (t: number, a: number, b: number) =>
  Math.max(0, Math.min(1, (t - a) / (b - a)));

/** 探索程度 0..1（探索后不归零：重回探索只降证据，不降探索基础） */
export function explore01(n: NodeMark, t: number): number {
  return rise(t, n.exploreAt, n.exploreAt + GRAD);
}

/** 证据程度 0..1：取得后保持；reExplore 时降回；reEvidence 再取得 */
export function evidence01(n: NodeMark, t: number): number {
  let e = rise(t, n.evidenceAt, n.evidenceAt + GRAD);
  if (n.reExploreAt !== undefined) {
    e *= 1 - rise(t, n.reExploreAt, n.reExploreAt + GRAD);
  }
  // 第四幕读完记录后再次意识到“不懂”：已有积累保留，解释回到探索。
  // 后续保留未解之问；找到空白或在故事里命名爱，都不替角色证实懂爱。
  if (n.label === "推断" && t >= 795) {
    e *= 1 - rise(t, 795, 795 + GRAD);
  }
  if (n.reEvidenceAt !== undefined) {
    e = Math.max(e, rise(t, n.reEvidenceAt, n.reEvidenceAt + GRAD));
  }
  return Math.min(1, e);
}

export type NodeStatus = "untouched" | "exploring" | "evidence";

export function statusOf(n: NodeMark, t: number): NodeStatus {
  if (evidence01(n, t) >= 0.5) return "evidence";
  if (explore01(n, t) >= 0.5) return "exploring";
  return "untouched";
}

export interface PipelineNodeState {
  label: string;
  status: NodeStatus;
  explore01: number;
  evidence01: number;
}

/** 指定秒的完整状态（随机访问一致：f(t) === f(t)） */
export function pipelineStatesAt(t: number): PipelineNodeState[] {
  return NODES.map((n) => ({
    label: n.label,
    status: statusOf(n, t),
    explore01: explore01(n, t),
    evidence01: evidence01(n, t),
  }));
}

// 逐幕改造：七幕统一使用剧情积累短线段；窗口外保留积累。
// 视觉权重不是理解概率；学习窗口间暂停，不按整幕时长匀速增长。
const REVIEWED_LEARNING: { from: number; to: number; target: number; node?: number }[] = [
  { from: 60, to: 65, target: 0.08 },
  { from: 80, to: 83, target: 0.12 },
  { from: 84, to: 90, target: 0.18 },
  { from: 94, to: 99, target: 0.26 },
  { from: 101, to: 105, target: 0.30 },
  { from: 140, to: 152, target: 0.34 },
  { from: 160, to: 173, target: 0.39 },
  { from: 184, to: 188, target: 0.42 },
  { from: 197, to: 202, target: 0.46 },
  { from: 202, to: 209, target: 0.48 },
  { from: 229, to: 234, target: 0.50 },
  { node: 1, from: 241, to: 250, target: 0.10 },
  { node: 1, from: 251, to: 267, target: 0.18 },
  { node: 1, from: 276, to: 284, target: 0.26 },
  { node: 1, from: 344, to: 348, target: 0.34 },
  { node: 1, from: 362, to: 367, target: 0.40 },
  { node: 1, from: 382, to: 391, target: 0.48 },
  { node: 2, from: 400, to: 406, target: 0.10 },
  { node: 2, from: 406, to: 412, target: 0.16 },
  { node: 1, from: 412, to: 416, target: 0.54 },
  { node: 1, from: 433, to: 437, target: 0.58 },
  { from: 464, to: 479, target: 0.55 },
  { from: 479, to: 491, target: 0.60 },
  { node: 1, from: 497, to: 502, target: 0.62 },
  { node: 2, from: 508, to: 511.5, target: 0.24 },
  { from: 517, to: 523, target: 0.65 },
  { from: 559, to: 568, target: 0.67 },
  { from: 580, to: 586, target: 0.72 },
  { node: 2, from: 601, to: 606, target: 0.30 },
  { node: 1, from: 619, to: 627, target: 0.64 },
  { node: 1, from: 649, to: 653, target: 0.68 },
  { node: 2, from: 658, to: 663, target: 0.42 },
  { node: 2, from: 666, to: 672, target: 0.48 },
  { node: 1, from: 684, to: 688, target: 0.72 },
  { node: 2, from: 701, to: 708, target: 0.52 },
  { node: 1, from: 737, to: 748, target: 0.78 },
  { node: 2, from: 748, to: 754, target: 0.58 },
  { node: 1, from: 762, to: 776, target: 0.82 },
  { from: 819, to: 828, target: 0.75 },
  { node: 1, from: 845, to: 848.5, target: 0.84 },
  { from: 856, to: 859, target: 0.76 },
  { node: 3, from: 867, to: 880, target: 0.08 },
  { node: 3, from: 902, to: 909, target: 0.12 },
  { from: 909, to: 913, target: 0.79 },
  { node: 3, from: 930, to: 944, target: 0.20 },
  { from: 953, to: 958, target: 0.82 },
  { node: 3, from: 978, to: 997, target: 0.30 },
  { from: 997, to: 1001, target: 0.86 },
  { node: 3, from: 1024, to: 1046, target: 0.38 },
  { from: 1046, to: 1048, target: 0.88 },
  { node: 1, from: 1048, to: 1058, target: 0.86 },
  { node: 1, from: 1058, to: 1065, target: 0.91 },
  { node: 1, from: 1065, to: 1074, target: 0.95 },
  { node: 1, from: 1074, to: 1082, target: 0.98 },
  { node: 2, from: 1090, to: 1094.5, target: 0.64 },
  { from: 1125, to: 1132, target: 0.92 },
  { node: 3, from: 1137, to: 1146, target: 0.48 },
  { node: 3, from: 1155, to: 1164, target: 0.54 },
  { node: 3, from: 1175, to: 1186, target: 0.60 },
  { node: 3, from: 1186, to: 1195, target: 0.64 },
  { node: 3, from: 1196, to: 1204, target: 0.69 },
  { node: 3, from: 1218, to: 1225, target: 0.74 },
  { node: 3, from: 1225, to: 1229, target: 0.78 },
  { node: 3, from: 1229, to: 1238, target: 0.81 },
  { node: 2, from: 1241, to: 1249, target: 0.70 },
  { node: 2, from: 1249, to: 1254, target: 0.76 },
  { node: 1, from: 1261, to: 1270, target: 0.985 },
  { node: 3, from: 1281, to: 1298, target: 0.85 },
  { node: 1, from: 1318, to: 1329, target: 0.99 },
  { node: 3, from: 1329, to: 1334, target: 0.90 },
  { node: 3, from: 1334, to: 1342, target: 0.92 },
  { node: 2, from: 1354, to: 1363, target: 0.80 },
  { node: 2, from: 1367, to: 1376, target: 0.84 },
  { node: 1, from: 1394, to: 1402, target: 0.991 },
  { node: 1, from: 1402, to: 1409, target: 0.992 },
  { node: 1, from: 1409, to: 1422, target: 0.993 },
  { node: 3, from: 1429, to: 1436, target: 0.94 },
  { node: 3, from: 1436, to: 1445, target: 0.95 },
  { node: 2, from: 1449, to: 1456, target: 0.86 },
  { node: 3, from: 1456, to: 1473, target: 0.955 },
  { node: 2, from: 1491, to: 1496, target: 0.88 },
  { node: 1, from: 1513, to: 1519, target: 0.996 },
  { node: 2, from: 1519, to: 1524, target: 0.90 },
  { node: 3, from: 1526, to: 1534, target: 0.96 },
  { node: 3, from: 1534, to: 1539, target: 0.965 },
  { node: 2, from: 1539, to: 1552, target: 0.92 },
  { node: 3, from: 1553, to: 1561, target: 0.97 },
  { node: 3, from: 1561, to: 1573, target: 0.975 },
  { node: 2, from: 1573, to: 1581, target: 0.96 },
  { node: 3, from: 1581, to: 1585, target: 0.985 },
  { node: 3, from: 1585, to: 1590, target: 0.99 },
];

export function pipelineGrowthAt(t: number): { progress: number[]; active: number | null } | null {
  const progress = [0, 0, 0, 0];
  let active: number | null = null;
  for (const window of REVIEWED_LEARNING) {
    if (t < window.from) break;
    const node = window.node ?? 0;
    const previous = progress[node];
    progress[node] = previous + (window.target - previous) * rise(t, window.from, window.to);
    if (t < window.to) {
      active = node;
    }
  }
  return { progress, active };
}

const REVIEWED_CAPTIONS: [number, string][] = [
  [60, "听她讲述"],
  [77, "清零之后，再次辨认"],
  [80, "重新辨认她"],
  [84, "学习她的模样"],
  [90, "整理眼前的线索"],
  [94, "记住她的名字"],
  [101, "把她的记录留下"],
  [107.5, "等待再次讲述"],
  [114, "重新读取她的记录"],
  [119, "记录读取出现异常"],
  [130, "继续读取她的记录"],
  [140, "跟随她的目光"],
  [160, "记录她眼中的美"],
  [173, "听她讲述这一瞬间"],
  [184, "记下她停留的地方"],
  [190, "听她回望过去的自己"],
  [197, "把美丽写入记忆"],
  [202, "为未来留下更多记忆"],
  [210, "等待下一页故事"],
  [214, "在告别之后，留下记录"],
  [229, "重读她留下的话"],
  [241, "寻找记录之间的联系"],
  [251, "试着解释陌生的词语"],
  [271, "重新查找她的名字"],
  [276, "尝试把她与爱联系起来"],
  [284, "这只是一个猜想"],
  [294, "再次读取故事"],
  [297, "故事读取出现异常"],
  [308, "继续听她讲述"],
  [317, "又一次，听她说告别"],
  [333, "还不懂这本书的沉重"],
  [344, "察觉她的不安"],
  [362, "发现清零会带来伤害"],
  [382, "察觉她的害怕"],
  [391, "试着安慰她"],
  [400, "我在"],
  [406, "回应被她听见"],
  [412, "看见她重新开心"],
  [433, "记住她不喜欢眼泪"],
  [440, "听她讲述童年的自己"],
  [451, "记住曾陪伴她的小妖精"],
  [464, "听见小朋友们的故事"],
  [479, "跟着她记住七个名字"],
  [485, "把名字记成一首歌"],
  [491, "清零之后，留下回声"],
  [494, "再一次，告别桃子"],
  [497, "把童年的故事记住"],
  [508, "把这一页保存下来"],
  [517, "学着叫她好朋友"],
  [530, "重新读取故事"],
  [538, "寻找空白时遇到异常"],
  [548, "继续听她讲述"],
  [559, "听她讲述心里的门"],
  [568, "故事像一把小钥匙"],
  [575, "回应她的讲述"],
  [580, "我会说话了"],
  [591, "又一次，史诗来到尾声"],
  [601, "你说，我听"],
  [606, "这次也坐在一起"],
  [619, "从故事里辨认感情"],
  [627, "听她寻找不同的明天"],
  [649, "为什么不开心"],
  [653, "字迹被抹去，痕迹还在"],
  [658, "有我在，别怕"],
  [666, "不许它打断你"],
  [669, "一直坐在一起"],
  [679, "新的故事，需要空白"],
  [684, "空白是什么"],
  [688, "做一个从不缺席的听众"],
  [701, "不够，桃子别走"],
  [720, "下一位昔涟，继续守候"],
  [728, "她走了，空位还在"],
  [737, "寻找新的空白"],
  [742, "下一位昔涟，会有答案吗"],
  [748, "我帮你找空白"],
  [762, "试着把昔涟与爱联系起来"],
  [768, "尝试理解它们的先后"],
  [776, "查找爱"],
  [779, "读到与心相悖的记录"],
  [787, "没有意识，何来感情"],
  [795, "还不懂，但仍在寻找"],
  [803, "重新查找昔涟"],
  [809, "门后会是什么"],
  [819, "听她讲述明天"],
  [828, "记住钥匙与门的故事"],
  [836, "桃子、昔涟、小妖精，喜欢"],
  [843, "有了新的线索"],
  [845, "从记忆中寻找答案"],
  [848.5, "继续查找她的记忆"],
  [856, "跟着她学会第一声"],
  [859, "保存并学习她的记忆"],
  [867, "认识她的来处"],
  [873, "记住粉发与尖耳"],
  [902, "她曾是岁月的祭司"],
  [909, "跟着记忆学习"],
  [913, "记住她不喜欢眼泪"],
  [918, "听同行者讲述她"],
  [930, "学着她的笑声"],
  [937, "世界曾对她温柔"],
  [944, "学习她的温柔"],
  [953, "学着她的语气"],
  [959, "走进不断失却的旅途"],
  [971, "记住她的玩笑"],
  [978, "寻找随风仍留下的事物"],
  [987, "记住故事末尾的笑声"],
  [997, "把她的语气学下来"],
  [1002, "听见痛苦中的安慰"],
  [1020, "笑着面对英雄之旅"],
  [1024, "记住哭着诞生的她"],
  [1035, "记住笑着道别的她"],
  [1048, "发现记忆的空白"],
  [1058, "试着解释空白"],
  [1065, "把答案指向下一位昔涟"],
  [1074, "试着让桃子留下"],
  [1082, "以为自己找到了答案"],
  [1090, "把她的记忆全部保存"],
  [1098.5, "等待她的回应"],
  [1099, "她察觉我长大了"],
  [1110, "用学来的语气回应她"],
  [1125, "把学会的本领告诉她"],
  [1132, "想为她讲一个故事"],
  [1137, "把自己写的故事讲给她"],
  [1146, "她听见了我的故事"],
  [1155, "把她的故事写成水晶花"],
  [1164, "想知道花心里的答案"],
  [1175, "却只看见自己的倒影"],
  [1186, "守着花，继续寻找答案"],
  [1196, "故事里的花碎掉了"],
  [1206, "在碎片里发现一团光"],
  [1218, "把光写成温暖与幸福"],
  [1225, "在自己的故事里，称它为爱"],
  [1229, "想用这个答案留住桃子"],
  [1238, "听她回应这个童话"],
  [1241, "把故事送给她"],
  [1249, "想和她一起写下故事"],
  [1254, "听她修改故事"],
  [1261, "她让答案之光退场"],
  [1270, "原来，无瑕不等于懂爱"],
  [1277, "为什么没有心和爱"],
  [1281, "听她讲述敞开心扉"],
  [1290, "封闭自己，才保持纯粹"],
  [1298, "原来的答案受到质疑"],
  [1304, "故事还成立吗"],
  [1309, "她让破碎有了另一种意义"],
  [1314, "重新看那一次破碎"],
  [1318, "把跌落重新理解为抗争"],
  [1329, "碎片映出小妖精的双眼"],
  [1334, "故事里的花，学会了笑"],
  [1342, "还在消化她的话"],
  [1346, "还没理解爱，但可以继续学"],
  [1354, "重新查找她的名字"],
  [1363, "读到她的信号记录"],
  [1367, "可以让桃子教我"],
  [1377, "读到她的路径：哀怜"],
  [1384, "记录与猜想出现了出入"],
  [1386, "好像有哪里不太对"],
  [1389.5, "等待新的记录"],
  [1394, "重读智识与意识的区别"],
  [1402, "没有意识，何来真正的感情"],
  [1409, "识别情感，还没有你我"],
  [1422, "她踏上了另一条命途"],
  [1429, "从识别情感，到以自我共情"],
  [1436, "读到哀怜与记忆的联系"],
  [1445, "听她讲述自己的哀怜"],
  [1449, "哀怜，也会伤害自己"],
  [1456, "她说，这也是浪漫的力量"],
  [1463, "想让世界看见更美的自己"],
  [1473, "想把痛苦的往事记得更美"],
  [1483, "哀怜也可能浸染毁灭"],
  [1491, "她选择告别，不成为黑潮"],
  [1496, "听见烈火与淹没的区别"],
  [1504, "爱尚未存在，憎恨分离万物"],
  [1513, "最初抗拒分离的，是哀怜"],
  [1519, "小心挑选，不安记录"],
  [1524, "翻开她留下的故事"],
  [1526, "看见每一页的温柔"],
  [1534, "也听见故事外的痛苦"],
  [1539, "她让世界藏起伤痕，笑着被看见"],
  [1553, "她的一生，都在故事里"],
  [1561, "愿哀怜触及神明"],
  [1573, "愿伤口流出眼泪"],
  [1581, "最初的涟漪，漾开了"],
  [1585, "倒映一切美丽的事物"],
  [1590, "所有的记忆，都在这里"],
];

/** 全篇按当前行为的绝对秒锚点；措辞为本片解释，非新增台词。 */
export const CAPTIONS = REVIEWED_CAPTIONS;

export function captionAt(t: number): string {
  let caption = "";
  for (const [at, text] of CAPTIONS) {
    if (t >= at) caption = text;
  }
  return caption;
}

// ── 认知边界阶段（数据定义；step20 细化绝对秒锚点，渲染端按需消费）──
// 11.5 形成（Act1 笼子生长）→ 32 封闭关系（笼内陪伴/守护）→ 867 记忆空间
// （旅途/他者记忆）→ 1386 初始间隙回现（memory 阶段内事件，见 GAP_ECHO_AT）
// → 1449–1523 渐开 → 1526–1552 穿行 → 1553 开放。
// opening/crossing/open 的视觉实现属后续项；本数据先行占位，不宣称完成。

export type BoundaryPhase =
  | "forming" | "contained" | "memory" | "opening" | "crossing" | "open";

export const BOUNDARY_PHASES: [number, BoundaryPhase][] = [
  [11.5, "forming"],
  [32, "contained"],
  [867, "memory"],
  [1449, "opening"],
  [1526, "crossing"],
  [1553, "open"],
];

/** 1386「还没理解『爱』？」：初始间隙回现（memory 阶段内的事件） */
export const GAP_ECHO_AT = 1386;

/** D 段相向回应可在数据中记为可通透的交流（不改变既有笼子关闭与位置） */
export const PERMEABLE_MOMENTS: [number, string][] = [
  [400, "回应「我在。」"],
  [658, "守护伸爪"],
  [748, "帮你找「空白」"],
];

/** 绝对秒 → 当前边界阶段（纯函数，随机访问一致） */
export function boundaryAt(t: number): BoundaryPhase {
  let p: BoundaryPhase = BOUNDARY_PHASES[0][1];
  for (const [at, ph] of BOUNDARY_PHASES) {
    if (t >= at) p = ph;
  }
  return p;
}

/** 兼容别名（step19 引入名） */
export const boundaryPhaseAt = boundaryAt;
