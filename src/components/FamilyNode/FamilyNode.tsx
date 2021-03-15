import React from "react";
import { IFamilyExtNode } from "relatives-tree/lib/types";

import { Box } from "../Box";

interface Props {
  node: IFamilyExtNode;
  isRoot: boolean;
  onSubClick: (id: string) => void;
  style?: React.CSSProperties;
}

export default React.memo<Props>(function FamilyNode({
  node,
  isRoot,
  onSubClick,
  style,
}) {
  return (
    <Box
      style={{
        ...style,
        position: "absolute",
        display: "flex",
        padding: "50px",
      }}
    >
      <Box
        style={{
          textAlign: "center",
          cursor: "pointer",
          display: "flex",
          flex: 1,
          borderRadius: "4px",
          border: "1px solid rgba(0, 0, 0, 0.1)",
          borderBottom: isRoot
            ? "2px solid rgba(0, 0, 0, 0.4)"
            : "2px solid rgba(0, 0, 0, 0.1)",
          padding: "4px",
          background: "white",
        }}
        onClick={() => onSubClick(node.id)}
      >
        {node.id}
      </Box>
      {node.hasSubTree && (
        <Box
          style={{
            zIndex: -1,
            position: "absolute",
            top: "40px",
            right: "40px",
            width: "20px",
            height: "20px",
            border: "1px solid rgba(0, 0, 0, 0.1)",
            borderRadius: "50%",
            cursor: "pointer",
            background: node.gender === "female" ? "#a7c1d1" : "#d9a7a7",
          }}
          onClick={() => onSubClick(node.id)}
        />
      )}
    </Box>
  );
});
