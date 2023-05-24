import { Button, Group, Stack } from "@mantine/core";
import { closeAllModals } from "@mantine/modals";
import BoardSelect from "components/molecules/Select/Board";
import { collection, deleteDoc } from "firebase/firestore";
import { deleteObject, getBlob, ref } from "firebase/storage";
import useBooleanState from "hooks/useBooleanState";
import { FC, useState } from "react";
import { useDownloadURL, useUploadFile } from "react-firebase-hooks/storage";
import { useBoards } from "routes/Home/Boards/Provider";
import {
  Collection,
  DocumentDocument,
  DocumentMime,
} from "types/firebase/collections";
import { addDoc, db, storage } from "utils/firebase";
import { getExtension } from "utils/storage";

export interface MoveDocumentModalProps {
  document: DocumentDocument;
}

const MoveDocumentModal: FC<MoveDocumentModalProps> = ({ document }) => {
  const [loading, start, stop] = useBooleanState();
  const { boards } = useBoards();
  const [boardId, setBoardId] = useState(
    document.ref?.parent.parent?.id ?? null
  );
  const [uploadFile] = useUploadFile();
  console.log(document.ref?.path);

  return (
    <Stack>
      <BoardSelect
        label="Board"
        placeholder="Board de John Doe"
        boards={boards ?? []}
        disabled={loading}
        value={boardId}
        onChange={(value) => {
          setBoardId(value);
        }}
      />
      <div className="flex ml-auto">
        <Group>
          <Button
            variant="default"
            disabled={loading}
            onClick={() => {
              closeAllModals();
            }}
          >
            Annuler
          </Button>
          <Button
            loading={loading}
            onClick={() => {
              start();
              console.log(1);

              addDoc<DocumentDocument>(
                collection(db, `boards/${boardId}/${Collection.documents}`),
                {
                  name: document.name,
                  mime: document.mime,
                }
              )
                .then(async (doc) => {
                  console.log(2);
                  const blob = await getBlob(
                    ref(
                      storage,
                      `${document.ref?.path}/document.${getExtension(
                        document.mime as DocumentMime
                      )}`
                    )
                  );

                  console.log(3);

                  return uploadFile(
                    ref(
                      storage,
                      `${doc.path}/document.${getExtension(
                        document.mime as DocumentMime
                      )}`
                    ),
                    blob,
                    {
                      contentType: document.mime,
                    }
                  );
                })
                .then(() => {
                  return deleteObject(
                    ref(
                      storage,
                      `${document.ref?.path}/document.${getExtension(
                        document.mime as DocumentMime
                      )}`
                    )
                  );
                })
                .then(() => {
                  console.log(4);
                  if (document.ref) {
                    return deleteDoc(document.ref);
                  }
                })
                .then(() => {
                  closeAllModals();
                })
                .finally(stop);
            }}
          >
            Déplacer
          </Button>
        </Group>
      </div>
    </Stack>
  );
};

export default MoveDocumentModal;
