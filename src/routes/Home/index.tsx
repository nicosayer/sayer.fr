import { Autocomplete, Button, RefreshIcon, TextInput } from "evergreen-ui";
import React from "react";
import ReactFamilyTree from "react-family-tree";
import { IFamilyExtNode } from "relatives-tree/lib/types";

import { Box } from "components/Box";
import { FamilyNode } from "components/FamilyNode/FamilyNode";
import { NewRelative } from "components/NewRelative";
import { PinchZoomPan } from "components/PinchZoomPan/PinchZoomPan";
import { NODE_WIDTH, NODE_HEIGHT } from "config/general";
import { IRelative } from "config/relative";
import { useOneTimeRelatives } from "providers/OneTimeRelatives";
import { useRootId } from "providers/RootId";

export const Home = React.memo<{}>(() => {
  const { relatives, searchableRelatives } = useOneTimeRelatives();
  const { rootId, setRootId } = useRootId();

  return (
    <Box
      style={{
        cursor: "grab",
        display: "flex",
        flexDirection: "column",
        background: "#f7f9fc",
        height: "100%",
      }}
    >
      <PinchZoomPan min={0.5} max={2.5} captureWheel>
        <ReactFamilyTree
          nodes={relatives}
          rootId={rootId}
          width={NODE_WIDTH}
          height={NODE_HEIGHT}
          renderNode={(node) => {
            return (
              <FamilyNode
                key={node.id}
                node={node as IRelative & IFamilyExtNode}
              />
            );
          }}
        />
      </PinchZoomPan>
      <Box
        style={{
          position: "absolute",
          left: "8px",
          top: "8px",
        }}
      >
        <NewRelative />
      </Box>
      <Box
        style={{
          position: "absolute",
          right: "8px",
          top: "8px",
        }}
      >
        <Autocomplete
          items={Object.keys(searchableRelatives)}
          onChange={setRootId}
          itemToString={(searchableRelativeId) => {
            return searchableRelatives[searchableRelativeId] ?? "";
          }}
        >
          {(props) => {
            const { getInputProps, getRef } = props;

            return (
              <TextInput
                ref={getRef}
                placeholder="Search for a relative"
                {...getInputProps()}
              />
            );
          }}
        </Autocomplete>
      </Box>
      <Box
        style={{
          position: "absolute",
          right: "8px",
          bottom: "8px",
        }}
      >
        <Button
          iconBefore={RefreshIcon}
          onClick={() => {
            window.location.reload(false);
          }}
        >
          Refresh
        </Button>
      </Box>
    </Box>
  );
});
