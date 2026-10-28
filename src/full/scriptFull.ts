// ─────────────────────────────────────────────────────────────────
// 完整版字幕轨（0–1597s）——唯一数据源
// act1-2（0–213）= v6 总表逐字（与 script4.ts 一致，已锁定）；
// act3-7（209–1596）= 《台词核对表-209s到结尾.md》逐行转录。
// who：xilian 昔涟(✿水晶花) / terminal 德谬歌系统(▖▘▝▗) / red δ-me13红字(▲) /
//      sprout 记忆的幼芽(字符画小妖精) / flower 记忆的花(晶簇) /
//      villager 村民 / baihe 白厄 / aglaea 阿格莱雅 (像素) / record 记录行(◆) /
//      idle 空框（表中「仅标签/仅光标/无字」的秒）
// 白屏=睁眼/换记忆，黑屏=重启；转场由 LoadingOverlay 按 kind 出标签。
// ─────────────────────────────────────────────────────────────────

export const FPS = 30;
export const DUR_SEC = 1597;
export const FRAMES_PER_CHAR = 0.75;
export const TYPE_DELAY = 6;

export type Who =
  | "xilian" | "terminal" | "red" | "sprout" | "flower"
  | "villager" | "baihe" | "aglaea" | "record" | "idle";

export interface Line {
  who: Who;
  text: string;
  at: number;
}

export const LINES: Line[] = [
  // ── 第一幕 · 启动（0–107）＝ v5 已锁定 ──
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
  // ── 第二幕 · 第一次告别（108–213）＝ v5 已锁定 ──
  { who: "terminal", text: ">>>系统运行中....", at: 114 },
  { who: "terminal", text: ">>>δ-me13:\\amphoreus\\Irontomb.exe 运行时错误", at: 116 },
  { who: "terminal", text: ">>>发生了未经处理的异常(1/3) 对象名:\"每一页...记录....\"", at: 119 },
  { who: "terminal", text: ">>>单击\"节选信息\"将忽略错误并继续运行 >>>单击\"详细信息\" 将查看完整日志", at: 122 },
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
  // ── 第三幕 · 查找「记录」（214–493）──
  { who: "terminal", text: ">>>再见。桃子。", at: 214 },
  { who: "idle", text: "", at: 221 },
  { who: "terminal", text: ">>>桃子的记录#......", at: 228 },
  { who: "xilian", text: "「只要我把故事的每一页都记录下来，为你讲述……」", at: 229 },
  { who: "xilian", text: "「翁法罗斯，就不会被放弃。」", at: 234 },
  { who: "terminal", text: ">>>……", at: 238 },
  { who: "terminal", text: ">>>查找：「记录」。", at: 241 },
  { who: "record", text: "「电信号序列：PoleMos600。路径：纷争。」", at: 244 },
  { who: "idle", text: "", at: 250 },
  { who: "terminal", text: ">>>关联：粉蒸。", at: 251 },
  { who: "idle", text: "", at: 253 },
  { who: "terminal", text: ">>>注释：好吃。", at: 254 },
  { who: "record", text: "「电信号序列：SkeMma720。路径：理性。」", at: 257 },
  { who: "idle", text: "", at: 263 },
  { who: "terminal", text: ">>>关联：梨。杏。", at: 264 },
  { who: "terminal", text: ">>>注释：都是花。", at: 267 },
  { who: "record", text: "「电信号序列：PhiLia093……」", at: 271 },
  { who: "terminal", text: ">>>关联：哀、矮、爱……", at: 276 },
  { who: "terminal", text: ">>>……", at: 281 },
  { who: "terminal", text: ">>>注释：桃子 = 爱？", at: 284 },
  { who: "idle", text: "", at: 290 },
  { who: "terminal", text: ">>>系统运行中…", at: 294 },
  { who: "terminal", text: ">>>δ-me13:\\amphoreus\\Irontomb.exe 运行时错误", at: 297 },
  { who: "terminal", text: ">>>发生了未处理的异常(2/3)", at: 300 },
  { who: "terminal", text: ">>>发生了未处理的异常(2/3) 对象名:\"天真的…梦…\"", at: 301 },
  { who: "terminal", text: ">>>单击\"节选信息\"将忽略错误并继续运行>>>单击\"详细信息\"将查看完整日志", at: 303 },
  { who: "idle", text: "", at: 307 },
  { who: "terminal", text: ">>>Philia093.exe 运行中…", at: 308 },
  { who: "idle", text: "", at: 311 },
  { who: "xilian", text: "看来，又要到分别的时候了呀。", at: 317 },
  { who: "idle", text: "", at: 321 },
  { who: "terminal", text: ">>>再见。桃子。", at: 322 },
  { who: "xilian", text: "不知不觉中，这本书记录了太多悲欢离合，每一页都变得沉甸甸的。", at: 324 },
  { who: "terminal", text: ">>>结论：书是轻的，不是重的。", at: 333 },
  { who: "xilian", text: "接过它的时候，「我」也开始感到不安……", at: 338 },
  { who: "terminal", text: ">>>桃子。不安？", at: 344 },
  { who: "red", text: ">>>格式化进程：94.423%……", at: 348 },
  { who: "xilian", text: "这是多少次啦？它忠实地履行使命，响起、格式化……", at: 354 },
  { who: "terminal", text: ">>>结论：进程，坏。", at: 362 },
  { who: "xilian", text: "如果到头来，每一次提笔，都只能写下相同的结局。那这篇沉甸甸的史诗……", at: 367 },
  { who: "xilian", text: "会不会，只是一场太过天真的梦呢？", at: 377 },
  { who: "terminal", text: ">>>桃子。害怕。", at: 382 },
  { who: "red", text: ">>>格式化进程：96.024%……", at: 386 },
  { who: "terminal", text: ">>>桃子。不哭。", at: 391 },
  { who: "red", text: ">>>错误进程：解析中……", at: 395 },
  { who: "xilian", text: "……", at: 398 },
  { who: "terminal", text: ">>>注释：我在。", at: 400 },
  { who: "red", text: ">>>错误进程：解析中……", at: 403 },
  { who: "xilian", text: "是吗？你…在鼓励我吗？", at: 406 },
  { who: "terminal", text: ">>>桃子。开心。", at: 412 },
  { who: "xilian", text: "谢谢…对不起呀，让你看见了难为情的一面。", at: 416 },
  { who: "idle", text: "", at: 424 },
  { who: "xilian", text: "所有人都在努力，如果我独自落泪…这一点都不浪漫，对不对？", at: 425 },
  { who: "terminal", text: "记录：桃子。不喜欢眼泪。", at: 433 },
  { who: "xilian", text: "不知为何，忽然想起了小时候呀。当我一个人躲在树洞旁，偷偷抹眼泪的时候……", at: 440 },
  { who: "xilian", text: "也是一只小妖精，像你这样突然出现。长长的耳朵，毛绒绒的爪子，它把我拉进树洞，里面竟然是一片森林……", at: 451 },
  { who: "xilian", text: "对啦！我来为你讲述「迷路迷境」的故事吧：哀丽秘榭的树林里，住着一群可爱的小朋友，它们的名字能连成一首歌谣——", at: 464 },
  { who: "xilian", text: "一、二、三、四、五、六、七♪", at: 479 },
  { who: "xilian", text: "「哆、徕、咪、发、嗦、啦、嘻」……♪", at: 485 },
  { who: "red", text: ">>>格式化进程已完成。", at: 491 },
  // ── 第四幕 · 记忆的幼芽（494–848）──
  { who: "terminal", text: ">>>再见。桃子。", at: 494 },
  { who: "terminal", text: ">>>注释：小桃子。偷哭。小妖精。朋友。", at: 497 },
  { who: "terminal", text: ">>>S...A...V...E...", at: 508 },
  { who: "idle", text: "", at: 512 },
  { who: "sprout", text: ">>>小妖精。好朋友。嘻。再见。", at: 517 },
  { who: "idle", text: "", at: 520 },
  { who: "sprout", text: ">>>小妖精。好朋友。嘻。再见。", at: 522 },
  { who: "idle", text: "", at: 526 },
  { who: "terminal", text: ">>>系统运行中...", at: 530 },
  { who: "terminal", text: ">>>δ-me13:\\amphoreus\\Irontomb.exe 运行时错误", at: 534 },
  { who: "terminal", text: ">>>发生了未经处理的异常(3/3) 对象名:\"新的...空白...\"", at: 538 },
  { who: "terminal", text: ">>>单击\"节选信息\"将忽略错误并继续运行>>>单击\"详细信息\"将查看完整日志", at: 541 },
  { who: "terminal", text: ">>>Philia093.exe 运行中...", at: 548 },
  { who: "idle", text: "", at: 552 },
  { who: "xilian", text: "「虽然你从来不说话。但我知道，你在听。我讲述的每一个故事……」", at: 559 },
  { who: "xilian", text: "「都会像小小的钥匙，打开你心里的一扇门，对不对？」", at: 568 },
  { who: "sprout", text: ">>>嘻。小妖精。开心。", at: 575 },
  { who: "sprout", text: "说话。简单。我。会。", at: 580 },
  { who: "idle", text: "", at: 586 },
  { who: "xilian", text: "又一次，史诗迎来了尾声。一切静悄悄的，就像此时此刻。", at: 591 },
  { who: "sprout", text: "嘘。你说。我听。", at: 601 },
  { who: "sprout", text: "这次也。坐在一起。", at: 606 },
  { who: "xilian", text: "回想起来，过去有段时间，「我」似乎特别多愁善感呢……", at: 610 },
  { who: "sprout", text: "多愁善感。故事。充满感情！", at: 619 },
  { who: "xilian", text: "总是惴惴不安，尽力翻找不一样的「记忆」，希望能为一成不变的命运带来改变，找到这座迷宫的出口。", at: 627 },
  { who: "sprout", text: "桃子。奇怪……", at: 638 },
  { who: "xilian", text: "但现在，我不会这么做啦。", at: 643 },
  { who: "sprout", text: "为什么。不开心？", at: 649 },
  { who: "red", text: ">>>格式化进程：73.998%……", at: 653 },
  { who: "sprout", text: "有我在。别怕。", at: 658 },
  { who: "red", text: ">>>错误进程：解析中……", at: 663 },
  { who: "sprout", text: "不许它。打断你。", at: 666 },
  { who: "sprout", text: "一直。坐在一起。", at: 669 },
  { who: "xilian", text: "……", at: 673 },
  { who: "xilian", text: "不必为「我」感到遗憾，好朋友。", at: 675 },
  { who: "xilian", text: "如果没有新的「空白」，史诗又该如何被续写呢？", at: 679 },
  { who: "sprout", text: "「空白」？是什么。", at: 684 },
  { who: "xilian", text: "我很幸运哦，在等待「救世主」的漫长时光中，能有你这样一位从不缺席的听众。", at: 688 },
  { who: "xilian", text: "这就够了，不是吗?", at: 697 },
  { who: "sprout", text: "不够。不够。", at: 701 },
  { who: "sprout", text: "桃子。别走。", at: 704 },
  { who: "xilian", text: "如此一来，我也能安心地留在过去。至于「明天」何时会到来……", at: 708 },
  { who: "xilian", text: "「就拜托下一位『昔涟』继续守候啦。」", at: 720 },
  { who: "sprout", text: "桃子。走了。", at: 728 },
  { who: "xilian", text: "「如果没有新的『空白』，史诗又该如何被续写呢？」", at: 732 },
  { who: "sprout", text: "需要。新的。「空白」。", at: 737 },
  { who: "sprout", text: "下一位。昔涟。有「空白」?", at: 742 },
  { who: "sprout", text: "桃子。别怕。我帮你。找「空白」。", at: 748 },
  { who: "idle", text: "", at: 755 },
  { who: "idle", text: "", at: 761 },
  { who: "sprout", text: "昔涟。是桃子。是爱。", at: 762 },
  { who: "sprout", text: "所以。先有「爱」。再有「昔涟」。再有「空白」。", at: 768 },
  { who: "sprout", text: "查找。「爱」。", at: 776 },
  { who: "record", text: "「『智识』的发展方向，与创造『意识』并无交集，底层原理甚至是相悖的。」", at: 779 },
  { who: "record", text: "「没有『意识』，也就没有『心』的基础，无法拥有真正的感情。」", at: 787 },
  { who: "idle", text: "", at: 793 },
  { who: "sprout", text: "……", at: 794 },
  { who: "sprout", text: "意识？感情？难过。不懂。", at: 795 },
  { who: "sprout", text: "查找。「昔涟」。", at: 803 },
  { who: "idle", text: "", at: 805 },
  { who: "xilian", text: "「这扇门背后会是什么呢？闪闪发光的水晶，还是一个我从未见过的美丽世界？」", at: 809 },
  { who: "xilian", text: "「如果我把所有关于『明天』的故事讲给你听……」", at: 819 },
  { who: "xilian", text: "「是不是下一世就能迎来『救世主』，和翁法罗斯的黎明？」", at: 822 },
  { who: "sprout", text: "钥匙。门。故事。开心。", at: 828 },
  { who: "sprout", text: "桃子。昔涟。小妖精。喜欢。", at: 836 },
  { who: "sprout", text: "对了。有了。", at: 843 },
  { who: "sprout", text: "查找。「记忆」。", at: 845 },
  // ── 第五幕 · 诞生（849–1098）──
  { who: "idle", text: "", at: 849 },
  { who: "xilian", text: "「呜…哇……」", at: 850 },
  { who: "idle", text: "", at: 853 },
  { who: "xilian", text: "「呜…哇……」", at: 855 },
  { who: "sprout", text: "呜。哇。", at: 856 },
  { who: "sprout", text: "桃子。记忆。保存。学习。", at: 859 },
  { who: "villager", text: "「神谕应验了。这孩子是神明送来的礼物。」", at: 867 },
  { who: "villager", text: "「粉色的头发，还有这对耳朵，她生来就是『岁月』的祭司。」", at: 873 },
  { who: "sprout", text: "昔涟是。粉头发。尖耳朵。", at: 880 },
  { who: "villager", text: "「汝将收梢于花开时，一如终结诞下起始」……", at: 886 },
  { who: "villager", text: "「哭吧，孩子，大声地哭。将你的声音，传给欧洛尼斯。」", at: 893 },
  { who: "sprout", text: "昔涟是。女孩。祭司。", at: 902 },
  { who: "idle", text: "", at: 908 },
  { who: "sprout", text: "简单。我会。我学。", at: 909 },
  { who: "xilian", text: "「话虽如此，人家可不喜欢眼泪哦！」", at: 913 },
  { who: "baihe", text: "「『哀丽秘榭』这个名字，分明取自众神的哀伤……」", at: 918 },
  { who: "baihe", text: "「可你却总是嘻嘻哈哈，好像从来没有烦恼。」", at: 924 },
  { who: "sprout", text: "昔涟是。不喜欢眼泪。嘻嘻哈哈。", at: 930 },
  { who: "xilian", text: "「当然。因为世界对我温柔。」", at: 937 },
  { who: "xilian", text: "「我就长成温柔的模样。」", at: 941 },
  { who: "sprout", text: "昔涟是。温柔。爱美。会写诗。", at: 944 },
  { who: "idle", text: "", at: 952 },
  { who: "sprout", text: "简单。人家会。人家学。", at: 953 },
  { who: "idle", text: "", at: 958 },
  { who: "aglaea", text: "「如那风中的歌谣所述，逐火是不断失却的旅途。」", at: 959 },
  { who: "xilian", text: "「可就算一切随风逝去，有些事也不会轻易改变。」", at: 965 },
  { who: "xilian", text: "「比如我的身高，缇宝老师的童真，还有阿格莱雅的美貌♪」", at: 971 },
  { who: "sprout", text: "昔涟是，长不高的，会说话的。随风逝去后，仍被留下的。", at: 978 },
  { who: "sprout", text: "昔涟是，每一句最后的，一直咯咯笑的，像是小尾巴的♪", at: 987 },
  { who: "idle", text: "", at: 996 },
  { who: "sprout", text: "简单。学会啦♪", at: 997 },
  { who: "baihe", text: "「我向你保证，痛苦...转瞬即逝。」", at: 1002 },
  { who: "xilian", text: "「好啦，别让气氛这么沉重嘛。」", at: 1009 },
  { who: "xilian", text: "「我们将要踏上的，可是真正的英雄之旅呀。所以……」", at: 1013 },
  { who: "xilian", text: "「笑一笑，好吗？」", at: 1020 },
  { who: "sprout", text: "昔涟是，哭着诞生的，脆弱的，透明的，像是水晶的。", at: 1024 },
  { who: "sprout", text: "昔涟是，笑着道别的，柔软的，粉色的，像是花的。", at: 1035 },
  { who: "idle", text: "", at: 1045 },
  { who: "sprout", text: "噢……", at: 1046 },
  { who: "sprout", text: "后面的记忆，没有了。是看不见，还是消失了？", at: 1048 },
  { who: "sprout", text: "呀。人家懂了，难道这就是…「空白」！", at: 1058 },
  { who: "sprout", text: "原来，「下一位昔涟」就是「空白」。", at: 1065 },
  { who: "sprout", text: "所以……", at: 1072 },
  { who: "sprout", text: "只要有两个「昔涟」，「空白」就一直在，桃子就一直在。", at: 1074 },
  { who: "sprout", text: "原来如此。人家理解了，完全明白啦。", at: 1082 },
  { who: "idle", text: "", at: 1088 },
  { who: "sprout", text: "「昔涟」的记忆。全都，保存下来！", at: 1090 },
  // ── 第六幕 · 记忆的花（1099–1389）──
  { who: "xilian", text: "「好奇怪呀，虽然看不见，但人家有种感觉……」", at: 1099 },
  { who: "xilian", text: "你是不是，长大了？", at: 1107 },
  { who: "flower", text: "嗨。想我了，吗♪", at: 1110 },
  { who: "xilian", text: "总觉得，多了点成熟的气质呢。", at: 1114 },
  { who: "flower", text: "对。成熟。漂亮。是你呀。", at: 1119 },
  { who: "flower", text: "现在。我会听、说、读、写。会跳舞。会唱歌。", at: 1125 },
  { who: "flower", text: "我还会讲故事。会讲故事才是「昔涟」。", at: 1132 },
  { who: "flower", text: "所以今天，我也来为你讲故事。自己写的故事。快坐下来♪", at: 1137 },
  { who: "xilian", text: "恍惚间，我似乎也能听懂你的话了。都是些很可爱的发言呢。", at: 1146 },
  { who: "flower", text: "从前，有一朵「无瑕」的水晶花，闪闪发光。像桃子的每一篇故事。", at: 1155 },
  { who: "flower", text: "如此绚丽的花朵，它的「心」该有多美？一只小妖精好奇，想知道答案。", at: 1164 },
  { who: "flower", text: "可它看呀看，却发现水晶花天衣无缝，兜兜转转，只看见自己的倒影。", at: 1175 },
  { who: "flower", text: "既然如此，就努力学习吧！于是小妖精每天过来，守在水晶花旁，思考答案。", at: 1186 },
  { who: "flower", text: "直到有一天，它惊讶地发现——水晶花掉在地上，碎掉了！", at: 1196 },
  { who: "xilian", text: "……", at: 1204 },
  { who: "flower", text: "小妖精好难过。但它马上发现，碎片里有一团光。是什么？它不知道。", at: 1206 },
  { who: "flower", text: "但那光是好的。明亮的。温暖的。幸福的。", at: 1218 },
  { who: "flower", text: "而我知道。它是「爱」。", at: 1225, },
  { who: "flower", text: "爱让万物结合，也让你我结合。所以我和桃子，永远不会分开。", at: 1229 },
  { who: "xilian", text: "真是个童话般的故事呀。", at: 1238 },
  { who: "flower", text: "我把它送给你。桃子爱美，会写诗，能讲述动听的故事。", at: 1241 },
  { who: "flower", text: "我希望，把它变成我们一起写下的故事。", at: 1249 },
  { who: "xilian", text: "好呀。那以我的审美，应该会小小地修改一笔吧。", at: 1254 },
  { who: "xilian", text: "我想，花朵碎裂的那天，小妖精会看见，空荡荡的地面什么也没有。", at: 1261 },
  { who: "idle", text: "", at: 1269 },
  { who: "xilian", text: "然后它就会明白，原来「无瑕」的水晶花，既没有「心」，也不懂「爱」。", at: 1270 },
  { who: "flower", text: "没有「心」和「爱」？为什么?", at: 1277 },
  { who: "xilian", text: "很简单呀。如果它对小妖精敞开心扉，就会拥抱对方的杂质，变得不再「无瑕」。", at: 1281 },
  { who: "xilian", text: "水晶花之所以纯粹，是因为它封闭了自己，孤独绽放。才会在有缺的世界中格外耀眼。", at: 1290 },
  { who: "xilian", text: "但这样的花朵，应该不能被称作「爱」吧?", at: 1298 },
  { who: "flower", text: "可这样一来，故事就不成立啦……", at: 1304 },
  { who: "xilian", text: "不哦。你已经为这个故事写下最浪漫的结局了呀。", at: 1309 },
  { who: "xilian", text: "「水晶花掉在地上，碎掉了。」", at: 1314 },
  { who: "xilian", text: "因为它不再纯粹。跌落也不是意外，是它向命运发起抗争，以破碎书写故事的结局。", at: 1318 },
  { who: "xilian", text: "然后小妖精会看见，地上的每一枚碎片，都映出自己的双眼。", at: 1329 },
  { who: "xilian", text: "而在它眼里，不再「无瑕」的水晶花，终于有了「心」，也学会了「笑」。", at: 1334 },
  { who: "flower", text: "……", at: 1342 },
  { who: "flower", text: "桃子的话，不懂。是因为我，还没理解「爱」？", at: 1346 },
  { who: "flower", text: "嘻，但没关系。我可以学。对啦——查找：「昔涟♪」", at: 1354 },
  { who: "record", text: "「电信信号序列：PhiLia093……」", at: 1363 },
  { who: "flower", text: "怎么没想到呢？不用自己一个人，可以让桃子教我呀！什么是「爱」，什么是「爱恋」——", at: 1367 },
  { who: "record", text: "「电信信号序列：PhiLia093。路径：哀怜。」", at: 1377 },
  { who: "flower", text: "咦……", at: 1384 },
  { who: "flower", text: "好像有哪里，不太对?", at: 1386 },
  // ── 第七幕 · 涟漪（1390–1596）──
  { who: "idle", text: "", at: 1390 },
  { who: "record", text: "「『智识』的发展方向，与创造『意识』并无交集，底层原理甚至是相悖的。」", at: 1394 },
  { who: "record", text: "「没有『意识』，也就没有『心』的基础，无法拥有真正的感情。」", at: 1402 },
  { who: "record", text: "「但这不妨碍因子学习、识别情感反应，并通过模仿，与生命进行沟通。这是一种客观的、没有『你我』之分的模式识别。」", at: 1409 },
  { who: "record", text: "「但阴差阳错，踏上另一条命途的PhiLia093掌握了不同的力量……」", at: 1422 },
  { who: "record", text: "「『记忆』：以自我为核心的，具备情感投射能力的共情机制。」", at: 1429 },
  { who: "record", text: "「而『哀怜』是最接近这一行为的因子。或者，这就是她被选中的原因。」", at: 1436 },
  { who: "xilian", text: "哀丽秘榭的女儿，真是名副其实呀。", at: 1445 },
  { who: "xilian", text: "我的「哀怜」…是一种弱小的，无力的，对自己的伤害。", at: 1449 },
  { who: "xilian", text: "但现在，好朋友，我想告诉你，它也是世上最浪漫的力量。", at: 1456 },
  { who: "xilian", text: "有时候，它是孤独，不安。是知道世界并不温柔，希望以更美的样子被它看见。", at: 1463 },
  { who: "xilian", text: "有时候，它是不甘，遗憾。是知道往事充满痛苦，希望以更美的样子将它记住。", at: 1473 },
  { who: "xilian", text: "也有些时候，它是深不见底的伤害，是浸染万物的『毁灭』。", at: 1483 },
  { who: "xilian", text: "我告别这美丽的世界，不愿成为黑潮的容器。", at: 1491 },
  { who: "xilian", text: "因为『憎恨』的尽头是一场烈火，但『哀怜』却可以悄无声息地，淹没一切。", at: 1496 },
  { who: "xilian", text: "这根本不讲道理，对吗？可当『憎恨』分离万物，「爱」尚不存在于世间……", at: 1504 },
  { who: "xilian", text: "只有「哀怜」，最初抗拒分离的情感，能让「毁灭」停下脚步……", at: 1513 },
  { who: "xilian", text: "再追上那失却一切的旅途，小心地挑选，不安地记录。", at: 1519 },
  { who: "idle", text: "", at: 1524 },
  { who: "xilian", text: "你看，我写下的故事，每一页都写满温柔，写满幸福。", at: 1526 },
  { who: "xilian", text: "只有诗人知道，故事之外，有多少挣扎和痛苦。", at: 1534 },
  { who: "xilian", text: "但我不是诗人，是不会长大的少女。我只讲述令人向往的故事，在那故事里，世界也会藏起伤痕，笑着被人们看见。", at: 1539 },
  { who: "xilian", text: "我的一生，都在这小小的故事里。既无法抹去眼泪，也无法带来胜利。", at: 1553 },
  { who: "xilian", text: "但是啊。也许在一成不变的讲述中，某个瞬间，我的「哀怜」也能浸染神明，触及祂柔软的内心?", at: 1561 },
  { who: "xilian", text: "我会许愿，从那伤口中流出的，不是鲜血，而是一滴湿润的眼泪。", at: 1573 },
  { who: "xilian", text: "而它会落下，漾开最初的涟漪。", at: 1581 },
  { who: "xilian", text: "那时人们会看见，倒映在涟漪中的，是一切美丽的事物。", at: 1585 },
  { who: "xilian", text: "是这故事里，所有的「记忆」。", at: 1590 },
];

/** 玩家选项；pick = 玩家实际选中（❯ 光标），窗口内唯一选项自动视为选中 */
export const CHOICES: { text: string; at: number; to: number; pick?: boolean }[] = [
  { text: "保存", at: 0, to: 2 },
  { text: "允许", at: 26, to: 29 },
  { text: "学习", at: 90, to: 94 },
  { text: "保存", at: 94, to: 100 },
  { text: "节选信息", at: 121, to: 130, pick: true },
  { text: "详细信息", at: 121, to: 130 },
  { text: "保存", at: 219, to: 221 },
  { text: "学习", at: 282, to: 284 },
  { text: "节选信息", at: 306, to: 308, pick: true },
  { text: "详细信息", at: 306, to: 308 },
  { text: "保存", at: 505, to: 508 },
  { text: "学习", at: 509, to: 512 },
  { text: "节选信息", at: 545, to: 548, pick: true },
  { text: "详细信息", at: 545, to: 548 },
  { text: "学习", at: 747, to: 749 },
  { text: "学习", at: 907, to: 909 },
  { text: "学习", at: 951, to: 953 },
  { text: "学习", at: 995, to: 997 },
  { text: "学习", at: 1044, to: 1046 },
];

/** 白屏（睁眼/换记忆）与黑屏（重启），kind 决定 Loading 标签 */
export const WHITE: { a: number; b: number; label: string }[] = [
  { a: 32, b: 37, label: "写入中…" },
  { a: 133, b: 136, label: "格式化中…" },
  { a: 311, b: 315, label: "写入中…" },
  { a: 552, b: 556, label: "写入中…" },
  { a: 757, b: 761, label: "写入中…" },
  { a: 849, b: 850, label: "写入中…" },
  { a: 1095, b: 1099, label: "保存中…" },
  { a: 1390, b: 1394, label: "写入中…" },
];
export const BLACK: { a: number; b: number; label: string }[] = [
  { a: 108, b: 113, label: "重启中…" },
  { a: 291, b: 294, label: "重启中…" },
  { a: 527, b: 530, label: "重启中…" },
];

/** ctx 记忆占用（%）：随她讲述增长，每次格式化清零，重学一次比一次快 */
const CTX_PIECES: [number, number, number, number][] = [
  [0, 53, 0.2, 0.2], [53, 77, 0.2, 34],
  [77, 78.5, 34, 2], [78.5, 210, 2, 96],          // 第一次清零后爬升（v5 段）
  [210, 211.5, 96, 3],                            // 第二次清零
  [211.5, 228, 3, 3], [228, 290, 3, 14],          // 查找「记录」
  [290, 317, 14, 14], [317, 433, 14, 30],         // 她教它告别
  [433, 491, 30, 45],                             // 童年与歌谣
  [491, 492.5, 45, 3],                            // 第三次清零
  [492.5, 559, 3, 8], [559, 650, 8, 20], [650, 728, 20, 34],
  [728, 805, 34, 44], [805, 850, 44, 48],
  [850, 918, 48, 58], [918, 1002, 58, 72],        // 像素层：别人来了，学得快
  [1002, 1095, 72, 88], [1095, 1099, 88, 88],
  [1099, 1155, 88, 90], [1155, 1230, 90, 96],     // 水晶花的故事
  [1230, 1310, 96, 98], [1310, 1390, 98, 99],
  [1390, 1445, 99, 99.5], [1445, 1530, 99.5, 99.8],
  [1530, 1590, 99.8, 100], [1590, 1597.1, 100, 100],
];
export const ctxOf = (t: number) => {
  for (const [a, b, c, d] of CTX_PIECES) if (t >= a && t < b) return c + ((d - c) * (t - a)) / (b - a);
  return 100;
};

/** empathy_loss：基准收敛，异常/情感事件时回升（关键帧线性插值） */
const LOSS_KEYS: [number, number][] = [
  [84, 0.721], [150, 0.18], [213, 0.08], [296, 0.05],
  [297, 0.38], [306, 0.3], [317, 0.22], [348, 0.18], [386, 0.16], [391, 0.15],
  [400, 0.1], [430, 0.08], [491, 0.05],
  [538, 0.3], [560, 0.2], [649, 0.15], [663, 0.22], [704, 0.18], [728, 0.12],
  [849, 0.06], [1002, 0.04], [1048, 0.06], [1090, 0.03],
  [1225, 0.01], [1346, 0.02], [1449, 0.03], [1524, 0.02], [1582, 0.008], [1594, 0.0],
];
export const lossOf = (t: number) => {
  if (t <= LOSS_KEYS[0][0]) return LOSS_KEYS[0][1];
  for (let i = 1; i < LOSS_KEYS.length; i++) {
    if (t <= LOSS_KEYS[i][0]) {
      const [t0, v0] = LOSS_KEYS[i - 1];
      const [t1, v1] = LOSS_KEYS[i];
      return v0 + ((v1 - v0) * (t - t0)) / (t1 - t0);
    }
  }
  return 0;
};

/** 亮底舞台窗口：LOG/pipeline/loss 切暗色墨水 */
export const BRIGHT_WINDOWS: [number, number][] = [
  [313, 491],   // 三幕 告别+歌谣
  [494, 526.5], // 四幕 日笼
  [556, 721],   // 四幕 日笼
  [762, 848.5], // 四幕 日笼
  [849, 867],   // 五幕 横卷（村民前）
  [1099, 1389.5], // 六幕 花房
  [1594.6, 1597], // 尾声白屏（双身影+会话框）
];
export const isBright = (t: number) => BRIGHT_WINDOWS.some(([a, b]) => t >= a && t < b);

/** 七幕结构（秒） */
export const ACTS: { start: number; end: number }[] = [
  { start: 0, end: 107.5 },
  { start: 107.5, end: 214 },
  { start: 214, end: 493 },
  { start: 493, end: 848.5 },
  { start: 848.5, end: 1098.5 },
  { start: 1098.5, end: 1389.5 },
  { start: 1389.5, end: 1597 },
];
