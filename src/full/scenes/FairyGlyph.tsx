import React from "react";
import { S } from "../kit";

// ─────────────────────────────────────────────────────────────────
// 迷迷 · 共享字符造型（任务书 step07/step08；造型依据 references/mem/
// 迷迷-立绘参考 与总方案 C.1 原创ASCII稿 A–E，非官方素材）
//
// 识别点（看图后保留）：向外展开的大羽状耳、耳根 @ 卷曲、额前 ~ 卷毛、
// 圆脸 + * 星形瞳孔、很小的鼻口 w、小爪 / 蓬松大尾巴（画面左侧那团）。
// 避免：竖耳方脸长棍身；不把尾巴画成第二只角色。
//
// 规格（Rev.2/step08）：
//   · 每行显式 padEnd(32)：严格 14×32=448 字格（含空格、不含换行），
//     A–E 逐格同位 → 双脚/脸原点不跳动；
//   · 计数用实际字格数（cells.length=448），doneT 与 cells 一致；
//     默认 cps=70 → 452 起约 6.4s 完成；
//   · 表情只在打印完成后切换（done 保护）。
//   · cellW=0.62em / cellH=1em 显式锁定，不压扁、不镜像。
// 姿态（step08）：A 听讲 / B 眨眼 / C 开心抬爪 / D 伸右爪 / E 低头。
//   可选 pose 参数显式指定；不传时走 auto（happyAt→C、眨眼→B、其余 A），
//   默认参数下 Act3 童年样片行为与 Rev.2 验收版完全一致。
// 配色：亮纸面深丁香紫轮廓；粉点缀＝耳内点/腮红/耳根卷/额前卷；
// 星瞳少量暖金。dark=true（夜笼/暗场）：轮廓切淡粉象牙、粉点缀提亮不消失。
// ─────────────────────────────────────────────────────────────────

const OUTLINE = "#6E5A8E"; // 深丁香紫轮廓（亮纸面）
const PINK = "#E39EB6";    // 耳内 / 腮红 / 耳根卷 / 额前卷
const GOLD = "#D9A03C";    // 星形瞳孔（暖金）
const COLS = 32;

const pad32 = (art: string) =>
  art.split("\n").map((l) => l.padEnd(COLS).slice(0, COLS)).join("\n");

/** 基础 14 行（C.1 A 稿主体） */
const BASE_ROWS = [
  "     /\\                  /\\",
  "    /  \\                /  \\",
  "   / .  \\              /  . \\",
  "  / .    \\            /    . \\",
  "  \\__     \\  .----.  /     __/",
  "     \\__ (@)/  ~\\_ \\(@) __/",
  "        '--(  *  *  )--'",
  "    .-~~-. ( ,  . , )",
  "   /  .   \\ '.__w__.'",
  "  / .     /  / <> \\",
  " (       /  ( /__\\ )",
  "  \\     (   /|    |\\",
  "   '.__  '-- /____\\",
  "       '---' (u)(u)",
];
const withRows = (rows: Record<number, string>) =>
  pad32(BASE_ROWS.map((l, i) => rows[i] ?? l).join("\n"));

/** A · 基础坐姿／认真听故事（主稿） */
const GLYPH_A = pad32(BASE_ROWS.join("\n"));
/** B · 眨眼（逐格同位，身体与耳朵不跳动） */
const GLYPH_B = withRows({ 6: "        '--(  -  -  )--'" });
/** C · 开心／歌谣回应（u 嘴 + 轻抬爪） */
const GLYPH_C = withRows({
  6: "        '--(  ^  ^  )--'",
  8: "   /  .   \\ '.__u__.'",
  10: " (       / (')/__\\(')",
});
/** D · 伸爪回应（伸向笼外昔涟；身体不位移） */
const GLYPH_D = withRows({
  8: "   /  .   \\ '.__w__.'     (')",
  9: "  / .     /  / <> \\      /",
  10: " (       /  ( /__\\ )----'",
});
/** E · 低头／她离开后的停顿 */
const GLYPH_E = withRows({
  6: "        '--(  .  .  )--'",
  8: "   /  .   \\ '.__-__.'",
});

/** 字符配色：按行+字符（行号见 C.1 稿）；dark 切淡粉/象牙墨 */
const colorAt = (row: number, ch: string, dark?: boolean): string => {
  if (ch === "*") return dark ? "#EAC57E" : GOLD;   // 星瞳（row6）
  if (ch === "@" || ch === "~") return dark ? "#F5B9CD" : PINK;
  if ((row === 2 || row === 3 || row === 4) && ch === ".") return dark ? "#F5B9CD" : PINK;
  if (row === 7 && (ch === "," || ch === ".")) return dark ? "#F5B9CD" : PINK;
  return dark ? "#F2E6F0" : OUTLINE;                // 暗场：淡粉象牙墨
};

export type FairyPose = "listen" | "happy" | "reach" | "bow";

export const FairyGlyph: React.FC<{
  t: number;
  /** 逐字生成起点（全片秒） */
  start: number;
  /** 组内/调用方局部坐标（左上） */
  x: number;
  y: number;
  size?: number;
  /** 字格/秒（含空格）；448 格 ÷ 70 ≈ 6.4s 完成 */
  cps?: number;
  /** 开心 C 帧（歌谣回应）起始秒；仅在打印完成后生效（auto 模式） */
  happyAt?: number;
  /** 显式姿态（step08）：listen/happy/reach/bow；打印完成前一律 A。
   *  不传时走 auto（happyAt/眨眼），默认行为＝Act3 验收版。 */
  pose?: FairyPose;
  /** 暗场（夜笼/暗底）：轮廓切淡粉象牙墨 */
  dark?: boolean;
  opacity?: number;
}> = ({ t, start, x, y, size = 16, cps = 70, happyAt, pose, dark, opacity = 1 }) => {
  const doneT = start + 14 * COLS / cps;      // 448 字格（含空格，不含换行）
  const shown = Math.max(0, Math.min(14 * COLS, Math.floor((t - start) * cps)));
  const done = t - start >= 14 * COLS / cps;
  // auto 模式（未传 pose）：happyAt→C、眨眼→B、其余 A；开心帧期间不眨
  const happy = done && happyAt !== undefined && t >= happyAt;
  const blink = done && !happy && t >= doneT + 0.6 && ((t - doneT) % 3.4) < 0.18;
  const autoPose = happy ? "happy" : blink ? "blink" : "listen";
  // 显式 pose（step08）：listen 与 auto 听讲同权——完成后允许短眨眼（B）；
  // happy/reach/bow 维持各自姿态不被眨眼打断
  const finalPose: FairyPose | "blink" =
    pose && done
      ? pose === "listen" && blink ? "blink" : pose
      : autoPose;
  const art =
    finalPose === "happy" ? GLYPH_C :
    finalPose === "blink" ? GLYPH_B :
    finalPose === "reach" ? GLYPH_D :
    finalPose === "bow" ? GLYPH_E : GLYPH_A;
  const o = opacity * S(t, start - 0.2, start);

  const cellW = size * 0.62;
  const cellH = size;
  const rows = art.split("\n");
  const cells: { ch: string; row: number; col: number; i: number }[] = [];
  rows.forEach((line, row) => {
    for (let col = 0; col < COLS; col++) {
      cells.push({ ch: line[col] ?? " ", row, col, i: cells.length });
    }
  });

  return (
    <g opacity={o} style={{ fontFamily: "monospace" }}>
      {cells.map(({ ch, row, col, i }) =>
        ch === " " ? null : (
          <text key={`${row}-${col}`} x={x + col * cellW} y={y + row * cellH + size * 0.82}
            fontSize={size} style={{ fontFamily: "monospace" }} fill={colorAt(row, ch, dark)}
            opacity={i < shown ? 1 : 0.05}>
            {ch}
          </text>
        ))}
      {/* 打字光标：生成中显示（完成后消失） */}
      {(() => {
        if (done || o <= 0) return null;
        const c = cells[Math.min(shown, cells.length - 1)];
        return <rect x={x + c.col * cellW} y={y + c.row * cellH} width={size * 0.55}
          height={size * 0.8} fill={dark ? "#F2E6F0" : OUTLINE}
          opacity={0.5 + 0.5 * Math.abs(Math.sin(t * 4))} />;
      })()}
    </g>
  );
};
