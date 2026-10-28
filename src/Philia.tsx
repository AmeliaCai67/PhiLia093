import React from "react";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from "remotion";
import { BEATS, CROSSFADE, beatFrames } from "./script";
import { MemoryBeat } from "./MemoryBeat";

/**
 * 主合成：把 BEATS 顺序铺开，拍间 CROSSFADE 帧交叉溶解。
 * 每拍比它的时长多占 CROSSFADE 帧，下一拍在其定格尾部淡入。
 */
export const Philia: React.FC = () => {
  let from = 0;
  const seqs = BEATS.map((beat) => {
    const dur = beatFrames(beat);
    const seq = { beat, from, dur: dur + CROSSFADE };
    from += dur;
    return seq;
  });
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {seqs.map(({ beat, from: f, dur }, i) => (
        <Sequence key={i} from={f} durationInFrames={dur}>
          <FadingIn>
            <MemoryBeat beat={beat} />
          </FadingIn>
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

const FadingIn: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, CROSSFADE], [0, 1], {
    extrapolateRight: "clamp",
  });
  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
};
