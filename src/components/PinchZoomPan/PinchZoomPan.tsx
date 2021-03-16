import { create } from "pinch-zoom-pan";
import React, { useEffect, useRef } from "react";

import { Box } from "components/Box";

interface IProps {
  style?: React.CSSProperties;
  children: React.ReactNode;
}

export const PinchZoomPan = React.memo<IProps>(({ style, children }) => {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = root.current;
    if (element) {
      create({ element, minZoom: 0.2, maxZoom: 2.5, captureWheel: true });
    }
  }, []);

  return (
    <Box
      myRef={root}
      style={{
        ...style,
        flex: 1,
        position: "relative",
        transform: "translateZ(0)",
        overflow: "hidden",
      }}
    >
      <Box
        style={{
          position: "absolute",
          width: "0",
          height: "0",
          transform: "translate(0, 0) scale(1)",
          transformOrigin: "center",
          willChange: "transform",
        }}
      >
        <Box
          style={{
            position: "absolute",
            transform: "translate(-50%, -50%)",
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
});
