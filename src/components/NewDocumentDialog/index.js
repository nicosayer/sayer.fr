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
import { useCallback, useMemo, useState } from "react";
import { uniqueId } from "utils";

const EMPTY_DATA = {
  label: "",
  document: {},
};
const encryptionKeyUniqueId = uniqueId();

export const NewDocumentDialog = ({ isOpen, onClose, user }) => {
  const { key, setKey, encrypt } = useEncryption();
  const [lockEncryptionKey, setLockEncryptionKey] = useState(true);
  const [data, setData] = useState(EMPTY_DATA);
  const [uploadFile, loadingUploadFile] = useUploadFile();
  const [writeData, loadingWriteData] = useWriteData();
  const { primary, danger } = useToaster();

  const loading = useMemo(() => loadingUploadFile || loadingWriteData, [
    loadingUploadFile,
    loadingWriteData,
  ]);

  const handleClose = () => {
    onClose();
    setData(EMPTY_DATA);
    setLockEncryptionKey(Boolean(key));
  };

  const handleChange = useCallback(
    (key) => (event) => {
      setData({ ...data, [key]: event?.target?.value });
    },
    [data]
  );

  return (
    <Dialog
      isOpen={isOpen}
      onClose={handleClose}
      title={`New document • ${user.name}`}
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
              autoFocus
              large
              id="document-input"
            />
          </FormGroup>
          <FormGroup
            label="Encryption key"
            labelFor="encryption-key-input"
            labelInfo="*"
          >
            <InputGroup
              autoCapitalize="none"
              leftIcon="key"
              disabled={loading || lockEncryptionKey}
              value={key}
              onChange={(event) => setKey(event?.target?.value)}
              large
              id="encryption-key-input"
              placeholder={encryptionKeyUniqueId}
              rightElement={
                lockEncryptionKey && (
                  <Tooltip content="Unlock">
                    <Button
                      icon="unlock"
                      minimal
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
            <Button large onClick={handleClose} disabled={loading}>
              Cancel
            </Button>
            <Button
              type="submit"
              large
              intent={Intent.PRIMARY}
              loading={loading}
              disabled={!key || !data.label || !data?.document?.name}
              onClick={(event) => {
                event.preventDefault()
                if (data.document.size > 10 * 1024 * 1024) {
                  danger({
                    icon: "warning-sign",
                    message: "Maximum file size is 10 Mb",
                  });
                } else {
                  const path = `documents/${uniqueId()}/${data.document.name}`;
                  uploadFile({
                    ref: path,
                    file: data.document,
                    onSuccess: () => {
                      writeData({
                        collection: "documents",
                        src: user.ref,
                        data: {
                          label: data.label,
                          name: data.document.name,
                          path: encrypt(path),
                        },
                        onSuccess: () => {
                          handleClose();
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
