import {
  Button,
  Classes,
  Dialog,
  FileInput,
  FormGroup,
  InputGroup,
  Intent,
} from "@blueprintjs/core";
import { Tooltip } from "components/Tooltip";
import { useEncryption } from "providers/EncryptionProvider";
import { useToaster } from "providers/ToasterProvider";
import { useUploadFile } from "hooks/useUploadFile";
import { useWriteData } from "hooks/useWriteData";
import { useCallback, useEffect, useMemo, useState } from "react";
import { uniqueId } from "utils";

const EMPTY_DATA = {
  label: "",
  document: {},
};
const encryptionKeyUniqueId = uniqueId();

export const NewDocumentDialog = ({ isOpen, onClose, board }) => {
  const { key, setKey, encrypt } = useEncryption();
  const [tempKey, setTempKey] = useState(key);
  const [lockEncryptionKey, setLockEncryptionKey] = useState(true);
  const [data, setData] = useState(EMPTY_DATA);
  const [uploadFile, loadingUploadFile] = useUploadFile();
  const [writeData, loadingWriteData] = useWriteData();
  const { primary, warning } = useToaster();

  const loading = useMemo(() => loadingUploadFile || loadingWriteData, [
    loadingUploadFile,
    loadingWriteData,
  ]);

  useEffect(() => {
    setData(EMPTY_DATA);
    setLockEncryptionKey(Boolean(key));
    setTempKey(key);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleChange = useCallback(
    (key) => (event) => {
      setData({ ...data, [key]: event?.target?.value });
    },
    [data]
  );

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={`New document • ${board.name}`}
    >
      <form>
        <div className={Classes.DIALOG_BODY}>
          <FormGroup large label="Label" labelFor="label-input" labelInfo="*">
            <InputGroup
              disabled={loading}
              leftIcon="label"
              value={data.label}
              onChange={handleChange("label")}
              autoFocus
              large
              id="label-input"
              placeholder="Passport"
            />
          </FormGroup>
          <FormGroup
            large
            label="Document"
            labelFor="document-input"
            labelInfo="*"
            helperText="Maximum file size 10 Mb"
          >
            <FileInput
              disabled={loading}
              fill
              onInputChange={(event) => {
                setData({ ...data, document: event?.target?.files?.[0] });
              }}
              text={data?.document?.name}
              hasSelection={data?.document?.name}
              large
              id="document-input"
            />
          </FormGroup>
          <FormGroup
            label="Encryption key"
            labelFor="document-encryption-key-input"
            labelInfo="*"
          >
            <InputGroup
              autoCapitalize="none"
              leftIcon="key"
              disabled={loading || lockEncryptionKey}
              value={tempKey}
              onChange={(event) => setTempKey(event?.target?.value)}
              large
              id="document-encryption-key-input"
              placeholder={encryptionKeyUniqueId}
              rightElement={
                lockEncryptionKey && (
                  <Tooltip content="Unlock">
                    <Button
                      icon="unlock"
                      onClick={() => setLockEncryptionKey(false)}
                    />
                  </Tooltip>
                )
              }
            />
          </FormGroup>
        </div>
        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button large onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button
              type="submit"
              large
              intent={Intent.PRIMARY}
              loading={loading}
              disabled={!key || !data.label || !data?.document?.name}
              onClick={(event) => {
                event.preventDefault();
                if (data.document.size > 10 * 1024 * 1024) {
                  warning({
                    icon: "warning-sign",
                    message: "Maximum file size is 10 Mb",
                  });
                } else {
                  setKey(tempKey);
                  const path = `documents/${uniqueId()}/${data.document.name}`;
                  uploadFile({
                    ref: path,
                    file: data.document,
                    onSuccess: () => {
                      writeData({
                        collection: "documents",
                        src: board.ref,
                        id: uniqueId(),
                        data: {
                          label: data.label,
                          name: data.document.name,
                          path: encrypt(path, tempKey),
                        },
                        onSuccess: () => {
                          onClose();
                          primary({
                            icon: "plus",
                            message: "Document added with success",
                          });
                        },
                      });
                    },
                  });
                }
              }}
            >
              Submit
            </Button>
          </div>
        </div>
      </form>
    </Dialog>
  );
};
