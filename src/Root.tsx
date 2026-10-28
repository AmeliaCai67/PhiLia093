import React from "react";
import { Audio, Composition } from "remotion";
import audioFull from "../materials/精华段-原声-full.m4a";
import { Philia } from "./Philia";
import { totalDuration } from "./script";
import { PhiliaV2 } from "./v2/PhiliaV2";
import { PhiliaV3 } from "./v3/PhiliaV3";
import { PhiliaV4 } from "./v4/PhiliaV4";
import { PhiliaV5 } from "./v5/PhiliaV5";
import { Act3Preview } from "./full/Act3Preview";
import { Act5Preview } from "./full/Act5Preview";
import { Act6Preview } from "./full/Act6Preview";
import { FullRoot } from "./full/FullRoot";
/** 第二轮返工出片用：画面 + 游戏原声（原声从源片 0s 对齐；组合留作复用） */
const AUDIO_SRC = audioFull;
export const FullWithAudio: React.FC = () => (
  <>
    <FullRoot />
    <Audio src={AUDIO_SRC} />
  </>
);

import { DUR_SEC, FPS as FULL_FPS } from "./full/scriptFull";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Philia"
        component={Philia}
        durationInFrames={totalDuration()}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="PhiliaV2"
        component={PhiliaV2}
        durationInFrames={51 * 30}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="PhiliaV3"
        component={PhiliaV3}
        durationInFrames={215 * 30}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="PhiliaV4"
        component={PhiliaV4}
        durationInFrames={215 * 30}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="PhiliaV5"
        component={PhiliaV5}
        durationInFrames={215 * 30}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="PhiliaAct3"
        component={Act3Preview}
        durationInFrames={(493 - 214) * 30}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="PhiliaAct5"
        component={Act5Preview}
        durationInFrames={(1098.5 - 848.5) * 30}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="PhiliaAct6"
        component={Act6Preview}
        durationInFrames={(1389.5 - 1098.5) * 30}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="PhiliaFull"
        component={FullRoot}
        durationInFrames={Math.round(DUR_SEC * FULL_FPS)}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="PhiliaFullR2"
        component={FullWithAudio}
        durationInFrames={Math.round(DUR_SEC * FULL_FPS)}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
