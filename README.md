# Philia · 代码即视频

<p align="center">
  <img src="docs/cover.png" width="320" alt="Philia · 昔涟" />
</p>

> 用 **Remotion**（React 写代码）复刻《崩坏：星穹铁道》翁法罗斯「记忆归档终端」的一段演出。
>
> 做这个的起因很朴素：那一段剧情里，**昔涟把三千万世的记忆喂给一个婴孩般的机械造物**，
> 让它长成会向往美与浪漫的存在。我想用代码再讲一遍这件事——一行一行写出来的动画，
> 正好对应"一层一层叠上去的记忆"。

- 成片：抖音约 **2 万**播放 · B 站过 **2000**
- 技术栈：Remotion 4 · React 18 · TypeScript（无 UI 框架，纯代码绘制 + 少量图片素材）

---

## 这是什么

一个**可渲染、可拆解、可复用**的动画工程，不是剪辑工程文件。所有画面、转场、节奏都写在 `src/` 里：

```
src/
├── Root.tsx          # 注册 composition（v1–v5 + FullRoot + 预览段）
├── Philia.tsx        # v1 主线
├── script.ts         # 时间轴脚本（镜头、字幕、时长）
├── palette.ts        # 配色 token
├── MemoryBeat.tsx    # 「记忆归档」核心节拍组件
├── backgrounds/      # 纯代码背景（BlackTerminal / GardenCage）
├── v2/ v3/ v4/ v5/   # 迭代版本：每一版都在上一版上改
└── full/             # 完整版（FullRoot + 各幕预览）
```

**五个版本不是备份，是过程。** 想看"一版怎么长成下一版"的，直接对着文件夹 diff。

---

## 快速开始

```bash
npm install
npm run dev            # 打开 Remotion Studio，可实时拖时间轴
npm run render         # 渲染成 mp4 到 out/
npm run render:preview # 只渲前 900 帧，改细节时更快
```

### ⚠️ 你需要自己准备一个音频文件

`src/Root.tsx` 里引用了一条原声：

```
materials/精华段-原声-full.m4a
```

**这个仓库不包含它**——原曲与游戏内音源版权不属于我，仓库里只放代码。

想跑通的话，随便放一条同名音频进去就行。没有音频文件时，可以先生成一条静音占位：

```bash
ffmpeg -f lavfi -i anullsrc=r=44100:cl=mono -t 1 -c:a aac \
  materials/精华段-原声-full.m4a
```

（这样画面能正常渲，只是没有声音；想还原成片请自备原曲。）

---

## 关于素材

| 内容 | 在仓库里吗 | 说明 |
|---|---|---|
| 全部动画代码 | ✅ | 画面基本由代码绘制 |
| `src/backgrounds/` | ✅ | 纯 React/CSS 绘制的背景组件 |
| 封面插画 `docs/cover.png` | ✅ | **同人插画**，仅作展示，不在 MIT 许可范围内 |
| 原声音频 | ❌ | 版权原因，需自备 |
| 游戏截图 / 立绘 | ❌ | 同上 |
| 中间产物（抽帧、扫描、成片） | ❌ | 体积大，与代码无关 |

---

## 版权与致谢

- **代码**：MIT（见 [LICENSE](LICENSE)）。
- **《崩坏：星穹铁道》** 及其角色、剧情、美术、音乐版权归 **miHoYo / HoYoverse** 所有。
  本仓库是**非商业的粉丝二创**，不含任何官方素材文件，与官方无隶属关系。
- 若版权方认为有不妥之处，请开 issue，我会第一时间处理。

> 「昔涟把三千万世的记忆喂给德谬歌」——这个故事本身不属于我。
> 我只是把它用另一种语言（代码）又写了一遍。
