import {
  Autocomplete,
  Button,
  PlusIcon,
  RefreshIcon,
  TextInput,
} from "evergreen-ui";
import React from "react";
import ReactFamilyTree from "react-family-tree";
import { IFamilyExtNode } from "relatives-tree/lib/types";

import { Box } from "components/Box";
import { FamilyNode } from "components/FamilyNode/FamilyNode";
import { NewRelativeButton } from "components/NewRelativeButton";
import { PinchZoomPan } from "components/PinchZoomPan/PinchZoomPan";
import { DocumentData } from "config/firebase";
import { NODE_WIDTH, NODE_HEIGHT } from "config/general";
import { IRelative } from "config/relative";
import { useOneTimeRelatives } from "providers/OneTimeRelatives";
import { useRootId } from "providers/RootId";
import { useSideSheet } from "providers/SideSheet";

export const Home = React.memo<{}>(() => {
  const { relatives, searchableRelatives } = useOneTimeRelatives();
  const { openSideSheet } = useSideSheet();
  const { rootId, setRootId } = useRootId();

  return (
    <Box
      style={{
        cursor: "grab",
        display: "flex",
        background: "#f7f9fc",
        height: "100%",
      }}
    >
      <PinchZoomPan>
        <ReactFamilyTree
          nodes={relatives}
          rootId={rootId}
          width={NODE_WIDTH}
          height={NODE_HEIGHT}
          renderNode={(node) => {
            console.log(node);
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
        <NewRelativeButton
          appearance="primary"
          iconBefore={PlusIcon}
          onCompleted={(doc: DocumentData) => {
            openSideSheet(doc.id);
          }}
        >
          New relative
        </NewRelativeButton>
      </Box>
      {searchableRelatives[rootId] && (
        <Box
          style={{
            display: "flex",
            position: "absolute",
            marginLeft: "50%",
            top: "8px",
          }}
        >
          <Button
            marginLeft="-50%"
            onClick={() => {
              openSideSheet(rootId);
            }}
          >
            {searchableRelatives[rootId]}
          </Button>
        </Box>
      )}
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
          appearance="primary"
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
