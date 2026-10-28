# materials/

**这个目录不进版本库。**（`.gitignore` 里排除了 `materials/*`，只保留本文件。）

`src/Root.tsx` 会引用这里的一条原声：

```
materials/精华段-原声-full.m4a
```

## 为什么不在仓库里

原曲和游戏内音源版权不属于我。仓库只放**代码**，不放任何官方素材。

## 怎么让它跑起来

放一条同名音频进这个目录即可。没有的话，先生成一条静音占位：

```bash
ffmpeg -f lavfi -i anullsrc=r=44100:cl=mono -t 1 -c:a aac \
  materials/精华段-原声-full.m4a
```

画面能正常渲染，只是没有声音。想还原成片请自备原曲。

## 想换自己的音频

文件名可以随便改，但要同步改 `src/Root.tsx` 里那一行：

```ts
import audioFull from "../materials/你的文件名.m4a";
```
