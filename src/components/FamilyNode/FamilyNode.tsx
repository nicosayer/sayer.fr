import { Avatar, SymbolCircleIcon } from "evergreen-ui";
import React from "react";
import { IFamilyExtNode } from "relatives-tree/lib/types";

import { Box } from "components/Box";

interface Props {
  node: IFamilyExtNode;
  isRoot: boolean;
  onSubClick: (id: string) => void;
  style?: React.CSSProperties;
}

export const FamilyNode = React.memo<Props>(
  ({ node, isRoot, onSubClick, style }) => {
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
            alignItems: "center",
            flexDirection: "column",
            justifyContent: "center",
            flex: 1,
            borderRadius: "4px",
            border: isRoot
              ? "1px solid rgba(0, 0, 0, 0.4)"
              : "1px solid rgba(0, 0, 0, 0.1)",
            borderBottom: isRoot
              ? "2px solid rgba(0, 0, 0, 0.4)"
              : "2px solid rgba(0, 0, 0, 0.1)",
            padding: "4px",
            background: "white",
          }}
          onClick={() => {
            onSubClick(node.id);
          }}
        >
          <Avatar name={node.id} size={40} />
          <Box style={{ marginTop: "4px" }}>{node.id}</Box>
        </Box>
        {node.hasSubTree && (
          <Box
            style={{
              position: "absolute",
              top: "43px",
              right: "43px",
              cursor: "pointer",
            }}
            onClick={() => {
              onSubClick(node.id);
            }}
          >
            <SymbolCircleIcon color="info" />
          </Box>
        )}
      </Box>
    );
  }
);
