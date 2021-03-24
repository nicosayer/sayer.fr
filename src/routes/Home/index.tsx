import {
  Autocomplete,
  Button,
  PlusIcon,
  Spinner,
  TextInput,
} from "evergreen-ui";
import React, { useEffect, useState } from "react";
import ReactFamilyTree from "react-family-tree";

import { Box } from "components/Box";
import { FamilyNode } from "components/FamilyNode/FamilyNode";
import { NewRelativeButton } from "components/NewRelativeButton";
import { PinchZoomPan } from "components/PinchZoomPan/PinchZoomPan";
import { DocumentData } from "config/firebase";
import { NODE_WIDTH, NODE_HEIGHT } from "config/general";
import { IRelative } from "config/relative";
import { useAuth } from "providers/Auth";
import { useOneTimeRelatives } from "providers/OneTimeRelatives";
import { useRootId } from "providers/RootId";
import { useSideSheet } from "providers/SideSheet";
import { loginWithGoogle, logout } from "utils/auth";

export const Home = React.memo<{}>(() => {
  const { relatives, searchableRelatives } = useOneTimeRelatives();
  const { openSideSheet } = useSideSheet();
  const { rootId, setRootId } = useRootId();
  const { isAuth } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [rootId]);

  if (loading) {
    return (
      <Box
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <Spinner />
      </Box>
    );
  }

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
          // @ts-ignore
          nodes={relatives}
          rootId={rootId}
          width={NODE_WIDTH}
          height={NODE_HEIGHT}
          renderNode={(node) => {
            return (
              <FamilyNode
                key={node.id}
                node={
                  node as IRelative & {
                    top: number;
                    left: number;
                    hasSubTree: boolean;
                  }
                }
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
        <Button
          onClick={() => {
            openSideSheet(rootId);
          }}
        >
          {searchableRelatives[rootId]}
        </Button>
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
          onChange={(newRootId) => {
            if (newRootId) {
              setRootId(newRootId);
            }
          }}
          itemToString={(searchableRelativeId) => {
            return searchableRelatives[searchableRelativeId] ?? "";
          }}
        >
          {(props) => {
            const {
              getInputProps,
              getRef,
              // @ts-ignore
              selectedItem,
              // @ts-ignore
              clearSelection,
            } = props;
            if (selectedItem) {
              clearSelection();
            }
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
      {isAuth && (
        <Box
          style={{
            position: "absolute",
            left: "8px",
            bottom: "8px",
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
      )}
      <Box
        style={{
          position: "absolute",
          right: "8px",
          bottom: "8px",
        }}
      >
        {isAuth ? (
          <Button appearance="primary" onClick={logout}>
            Logout
          </Button>
        ) : (
          <Button onClick={loginWithGoogle}>Login with Google</Button>
        )}
      </Box>
    </Box>
  );
});
