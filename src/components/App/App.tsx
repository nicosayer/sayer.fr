import React, { useState, useCallback } from "react";
import ReactFamilyTree from "react-family-tree";
import { IFamilyNode, IFamilyExtNode } from "relatives-tree/lib/types";

import FamilyNode from "../FamilyNode/FamilyNode";
import PinchZoomPan from "../PinchZoomPan/PinchZoomPan";
import styles from "./App.module.css";
import data from "./data.json";

const myID = "N Sayer";

const WIDTH = 200;
const HEIGHT = 200;

export default React.memo<{}>(function App() {
  const [rootId, setRootId] = useState<string>(myID);
  const onResetClick = useCallback(() => setRootId(myID), []);

  return (
    <div className={styles.root}>
      <PinchZoomPan min={0.5} max={2.5} captureWheel className={styles.wrapper}>
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
                  maxWidth: WIDTH,
                  height: HEIGHT,
                  maxHeight: HEIGHT,
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
        <div className={styles.reset} onClick={onResetClick}>
          Reset
        </div>
      )}
    </div>
  );
});
