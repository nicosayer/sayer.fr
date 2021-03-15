import { Button, RefreshIcon } from "evergreen-ui";
import React, { useState, useCallback } from "react";
import ReactFamilyTree from "react-family-tree";
import { IFamilyNode, IFamilyExtNode } from "relatives-tree/lib/types";

import { Box } from "components/Box";
import { FamilyNode } from "components/FamilyNode/FamilyNode";
import { PinchZoomPan } from "components/PinchZoomPan/PinchZoomPan";
import data from "routes/data.json";

const myID = "N Sayer";

const WIDTH = 200;
const HEIGHT = 200;

export const App = React.memo<{}>(() => {
  const [rootId, setRootId] = useState<string>(myID);
  const onResetClick = useCallback(() => setRootId(myID), []);

  return (
    <Box
      style={{
        display: "flex",
        flexDirection: "column",
        background: "#f7f9fc",
        height: "100%",
      }}
    >
      <PinchZoomPan min={0.5} max={2.5} captureWheel>
        <ReactFamilyTree
          nodes={data as IFamilyNode[]}
          rootId={rootId}
          width={WIDTH}
          height={HEIGHT}
          renderNode={(node: IFamilyExtNode) => {
            console.log(2, node);
            return (
              <FamilyNode
                key={node.id}
                node={node}
                isRoot={node.id === rootId}
                onSubClick={setRootId}
                style={{
                  width: WIDTH,
                  height: HEIGHT,
                  overflow: "hidden",
                  transform: `translate(${node.left * (WIDTH / 2)}px, ${
                    node.top * (HEIGHT / 2)
                  }px)`,
                }}
              />
            );
          }}
        />
      </PinchZoomPan>
      {rootId !== myID && (
        <Box
          style={{
            position: "absolute",
            left: "10px",
            top: "10px",
          }}
          onClick={onResetClick}
        >
          <Button iconBefore={<RefreshIcon />} onClick={onResetClick}>
            Reset
          </Button>
        </Box>
      )}
    </Box>
  );
});
