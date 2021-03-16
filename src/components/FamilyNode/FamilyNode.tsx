import { Avatar, SymbolCircleIcon, Text } from "evergreen-ui";
import React, { useMemo } from "react";
import { IFamilyExtNode } from "relatives-tree/lib/types";

import { Box } from "components/Box";
import { NODE_HEIGHT, NODE_WIDTH } from "config/general";
import { IRelative } from "config/relative";
import { useRootId } from "providers/RootId";
import { useSideSheet } from "providers/SideSheet";

interface Props {
  node: IRelative & IFamilyExtNode;
}

export const FamilyNode = React.memo<Props>(({ node }) => {
  const { rootId, setRootId } = useRootId();
  const { openSideSheet } = useSideSheet();

  const isRoot = useMemo(() => {
    return node.id === rootId;
  }, [node.id, rootId]);

  return (
    <Box
      style={{
        width: NODE_WIDTH,
        height: NODE_HEIGHT,
        transform: `translate(${node.left * (NODE_WIDTH / 2)}px, ${
          node.top * (NODE_HEIGHT / 2)
        }px)`,
        position: "absolute",
        display: "flex",
        padding: "40px",
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
            ? "1px solid rgba(0, 0, 0, 0.6)"
            : "1px solid rgba(0, 0, 0, 0.1)",
          borderBottom: isRoot
            ? "2px solid rgba(0, 0, 0, 0.6)"
            : "2px solid rgba(0, 0, 0, 0.1)",
          padding: "4px",
          background: "white",
          maxWidth: NODE_WIDTH,
          maxHeight: NODE_HEIGHT,
        }}
        onDoubleClick={(event) => {
          event.preventDefault();
          setRootId(node.id);
        }}
        onContextMenu={(event) => {
          event.preventDefault();
          openSideSheet(node.id);
        }}
      >
        <Avatar name={`${node.firstName} ${node.lastName}`} size={40} />
        <Box
          style={{
            marginTop: "8px",
            textOverflow: "ellipsis",
            overflow: "hidden",
          }}
        >
          <Box>
            {node.firstName} {node.lastName}
          </Box>
          {Boolean(node.birthYear || node.deathYear) && (
            <Text color="muted" size={300}>
              {node.birthYear && node.deathYear
                ? `(${node.birthYear} → ${node.deathYear})`
                : `(${node.birthYear || node.deathYear})`}
            </Text>
          )}
        </Box>
      </Box>
      {node.hasSubTree && (
        <Box
          style={{
            position: "absolute",
            top: "34px",
            right: "34px",
            cursor: "pointer",
          }}
          onClick={() => {
            setRootId(node.id);
          }}
        >
          <SymbolCircleIcon color="info" />
        </Box>
      )}
    </Box>
  );
});
