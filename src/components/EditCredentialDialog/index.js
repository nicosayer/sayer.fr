import {
  Button,
  Classes,
  Dialog,
  FormGroup,
  InputGroup,
  Intent,
} from "@blueprintjs/core";
import { useCallback, useEffect, useMemo, useState } from "react";

import { useWriteData } from "hooks/useWriteData";
import { uniqueId } from "utils";
import { useEncryption } from "providers/EncryptionProvider";
import { Tooltip } from "components/Tooltip";
import { useToaster } from "providers/ToasterProvider";
import { useWindowSize } from "hooks/useWindowSize";
import { Box } from "components/Box";
import { DeletePopover } from "components/DeletePopover";

const passwordUniqueId = uniqueId();
const encryptionKeyUniqueId = uniqueId();

export const EditCredentialDialog = ({ isOpen, onClose, credential }) => {
  const { encrypt, key, setKey, decrypt } = useEncryption();

  const emptyData = useMemo(
    () => ({
      label: credential.label,
      url: credential.url,
      username: credential.username,
      password: decrypt(credential.password),
    }),
    [
      credential.label,
      credential.url,
      credential.username,
      credential.password,
      decrypt,
    ]
  );
  const [tempKey, setTempKey] = useState(key);
  const [showPassword, setShowPassword] = useState(false);
  const [lockEncryptionKey, setLockEncryptionKey] = useState(true);
  const [writeData, loading] = useWriteData();
  const [data, setData] = useState(emptyData);
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
      title={`Edit credential • ${credential.label}`}
    >
      <form>
        <div className={Classes.DIALOG_BODY}>
          <FormGroup large label="Label" labelFor="label-input" labelInfo="*">
            <InputGroup
              leftIcon="office"
              disabled={loading}
              value={data.label}
              onChange={handleChange("label")}
              autoFocus={isOnComputer}
              large
              id="label-input"
              placeholder="Facebook"
            />
          </FormGroup>
          <FormGroup label="URL" labelFor="url-input">
            <InputGroup
              autoCapitalize="none"
              leftIcon="globe-network"
              disabled={loading}
              value={data.url}
              onChange={handleChange("url")}
              large
              id="url-input"
              placeholder="https://facebook.fr"
            />
          </FormGroup>
          <FormGroup label="Username" labelFor="username-input" labelInfo="*">
            <InputGroup
              autoCapitalize="none"
              leftIcon="user"
              disabled={loading}
              value={data.username}
              onChange={handleChange("username")}
              large
              id="username-input"
              placeholder="john@doe.com"
            />
          </FormGroup>
          <FormGroup label="Password" labelFor="password-input" labelInfo="*">
            <InputGroup
              leftIcon="lock"
              disabled={loading}
              value={data.password}
              onChange={handleChange("password")}
              large
              id="password-input"
              placeholder={showPassword ? passwordUniqueId : "••••••••••"}
              type={showPassword ? "text" : "password"}
              rightElement={
                <Tooltip
                  content={showPassword ? "Hide password" : "Show password"}
                >
                  <Button
                    icon={showPassword ? "eye-off" : "eye-open"}
                    onClick={() => setShowPassword(!showPassword)}
                  />
                </Tooltip>
              }
            />
          </FormGroup>
          <FormGroup
            label="Encryption key"
            labelFor="credential-encryption-key-input"
            labelInfo="*"
          >
            <InputGroup
              autoCapitalize="none"
              leftIcon="key"
              disabled={loading || lockEncryptionKey}
              value={tempKey}
              onChange={(event) => setTempKey(event?.target?.value)}
              large
              id="credential-encryption-key-input"
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
                src={credential.ref}
                onSuccess={onClose}
                name="credential"
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
              disabled={!key || !data.label || !data.username || !data.password}
              loading={loading}
              large
              intent={Intent.PRIMARY}
              onClick={(event) => {
                event.preventDefault();
                setKey(tempKey);
                writeData({
                  src: credential.ref,
                  data: { ...data, password: encrypt(data.password, tempKey) },
                  onSuccess: () => {
                    onClose();
                    primaryToast({
                      icon: "edit",
                      message: "Credentials edited with success",
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