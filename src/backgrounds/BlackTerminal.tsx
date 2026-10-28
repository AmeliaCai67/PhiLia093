import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

/** 黑场终端：原演出开场（「好黑」）就是纯黑 + 微弱暖晕。 */
export const BlackTerminal: React.FC = () => {
  const frame = useCurrentFrame();
  // 极轻的呼吸暖光，避免纯黑在压缩后死块
  const warmth = interpolate(Math.sin(frame / 110), [-1, 1], [0.1, 0.2]);
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(60% 42% at 50% 68%, rgba(64,52,30,${warmth}) 0%, rgba(0,0,0,0) 70%)`,
        }}
      />
    </AbsoluteFill>
  );
};
