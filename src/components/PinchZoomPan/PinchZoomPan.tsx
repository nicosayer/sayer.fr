import { create } from "pinch-zoom-pan";
import React, { useEffect, useRef } from "react";

import { Box } from "../Box";
import css from "./PinchZoomPan.module.css";

interface IProps {
  min?: number;
  max?: number;
  captureWheel?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

export default React.memo<IProps>(function PinchZoomPan({
  min,
  max,
  captureWheel,
  style,
  children,
}) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    return create({ element, minZoom: min, maxZoom: max, captureWheel });
  }, [min, max, captureWheel]);

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
      <div className={css.point}>
        <div className={css.canvas}>{children}</div>
      </div>
    </Box>
  );
});
