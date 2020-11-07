import {
  Button,
  Classes,
  Dialog,
  FormGroup,
  InputGroup,
  Intent,
} from "@blueprintjs/core";
import { Tooltip } from "components/Tooltip";
import { useEncryption } from "providers/EncryptionProvider";
import { useToaster } from "providers/ToasterProvider";
import { useWriteData } from "hooks/useWriteData";
import { useCallback, useEffect, useMemo, useState } from "react";
import { uniqueId } from "utils";
import { useWindowSize } from "hooks/useWindowSize";
import { Box } from "components/Box";
import { DeletePopover } from "components/DeletePopover";

const encryptionKeyUniqueId = uniqueId();

export const EditDocumentDialog = ({ isOpen, onClose, document }) => {
  const emptyData = useMemo(
    () => ({
      label: document.label,
    }),
    [document.label]
  );
  const { key, setKey, encrypt, decrypt } = useEncryption();
  const path = useMemo(() => decrypt(document.path), [document.path, decrypt]);
  const [tempKey, setTempKey] = useState(key);
  const [lockEncryptionKey, setLockEncryptionKey] = useState(true);
  const [data, setData] = useState(emptyData);
  const [writeData, loading] = useWriteData();
  const { primaryToast } = useToaster();
  const { isOnComputer } = useWindowSize();

  useEffect(() => {
    setData(emptyData);
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
      title={`Edit document • ${document.label}`}
    >
      <form>
        <div className={Classes.DIALOG_BODY}>
          <FormGroup large label="Label" labelFor="label-input" labelInfo="*">
            <InputGroup
              disabled={loading}
              leftIcon="label"
              value={data.label}
              onChange={handleChange("label")}
              autoFocus={isOnComputer}
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
            <InputGroup
              disabled
              leftIcon="label"
              value={document.name}
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
            <Box style={{ marginLeft: "-10px", marginRight: "auto" }}>
              <DeletePopover
                src={document.ref}
                onSuccess={onClose}
                name="document"
              >
                <Button intent={Intent.DANGER} large>
                  Delete
                </Button>
              </DeletePopover>
            </Box>
            <Button large onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button
              type="submit"
              large
              intent={Intent.PRIMARY}
              loading={loading}
              disabled={!key || !data.label}
              onClick={(event) => {
                event.preventDefault();
                setKey(tempKey);
                writeData({
                  src: document.ref,
                  data: {
                    label: data.label,
                    path: encrypt(path, tempKey),
                  },
                  options: { merge: true },
                  onSuccess: () => {
                    onClose();
                    primaryToast({
                      icon: "edit",
                      message: "Document edited with success",
                    });
                  },
                });
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
