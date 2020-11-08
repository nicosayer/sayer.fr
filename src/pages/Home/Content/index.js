import { FormGroup, H4, NonIdealState, Spinner } from "@blueprintjs/core";
import { Colors } from "@blueprintjs/core";

import { Box } from "components/Box";
import { EncryptionKeyInput } from "components/EncryptionKeyInput";
import { NewBoardButton } from "components/NewBoardButton";
import { useListenData } from "hooks/useListenData";
import Board from "pages/Home/Content/Board";
import { useEncryption } from "providers/EncryptionProvider";
import { useSearch } from "providers/SearchProvider";
import { useUser } from "providers/UserProvider";
import { caseInsensitiveSortBy } from "utils";
import { uniqBy } from "lodash/fp";

function Home() {
  const { key } = useEncryption();
  const { user } = useUser();
  const { search } = useSearch();

  const [viewerBoards = [], loadingViewerBoards] = useListenData({
    collection: "boards",
    where: [["viewers", "array-contains", user.email]],
  });

  const [editorsBoards = [], loadingEditorsBoards] = useListenData({
    collection: "boards",
    where: [["editors", "array-contains", user.email]],
  });

  if (loadingViewerBoards || loadingEditorsBoards) {
    return (
      <Box style={{ marginTop: "40px" }}>
        <Spinner />
      </Box>
    );
  }

  return (
    <Box
      style={{
        padding: "10px",
        maxWidth: "max",
        margin: "auto",
      }}
    >
      {!key && (
        <Box style={{ marginTop: "40px" }}>
          <NonIdealState
            icon="lock"
            title="Items are locked"
            description={
              <FormGroup
                label="Enter the encryption key"
                labelFor="home-encryption-key-input"
              >
                <EncryptionKeyInput id="home-encryption-key-input" />
              </FormGroup>
            }
          />
        </Box>
      )}
      {caseInsensitiveSortBy(
        uniqBy("uid", [...viewerBoards, ...editorsBoards]),
        "name"
      ).map((board) => (
        <Board key={board.uid} board={board} />
      ))}
      {!search && key && (
        <Box style={{ marginBottom: "40px" }}>
          <H4>
            <Box
              style={{
                display: "flex",
                alignItems: "center",
                color: Colors.GRAY1,
              }}
            >
              New board
              <Box style={{ marginLeft: "10px" }}>
                <NewBoardButton />
              </Box>
            </Box>
          </H4>
        </Box>
      )}
    </Box>
  );
}

export default Home;
