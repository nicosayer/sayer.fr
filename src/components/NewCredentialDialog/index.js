import {
  Button,
  Classes,
  Dialog,
  FormGroup,
  InputGroup,
  Intent,
} from "@blueprintjs/core";
import { useCallback, useEffect, useState } from "react";

import { useWriteData } from "hooks/useWriteData";
import { uniqueId } from "utils";
import { useEncryption } from "providers/EncryptionProvider";
import { Tooltip } from "components/Tooltip";
import { useToaster } from "providers/ToasterProvider";

const EMPTY_DATA = {
  label: "",
  url: "",
  username: "",
  password: "",
};

const passwordUniqueId = uniqueId();
const encryptionKeyUniqueId = uniqueId();

export const NewCredentialDialog = ({ isOpen, onClose, user }) => {
  const { encrypt, key, setKey } = useEncryption();
  const [showPassword, setShowPassword] = useState(false);
  const [lockEncryptionKey, setLockEncryptionKey] = useState(true);
  const [writeData, loading] = useWriteData();
  const [data, setData] = useState(EMPTY_DATA);
  const { primary } = useToaster();

  useEffect(() => {
    setData(EMPTY_DATA);
    setShowPassword(false);
    setLockEncryptionKey(Boolean(key));
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
      title={`New credential • ${user.name}`}
    >
      <form>
        <div className={Classes.DIALOG_BODY}>
          <FormGroup large label="Label" labelFor="label-input" labelInfo="*">
            <InputGroup
              leftIcon="office"
              disabled={loading}
              value={data.label}
              onChange={handleChange("label")}
              autoFocus
              large
              id="label-input"
              placeholder="Facebook"
            />
          </FormGroup>
          <FormGroup label="URL" labelFor="url-input">
            <InputGroup
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
              leftIcon="user"
              disabled={loading}
              value={data.username}
              onChange={handleChange("username")}
              large
              id="username-input"
              placeholder="mark@gmail.com"
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
                    minimal
                    onClick={() => setShowPassword(!showPassword)}
                  />
                </Tooltip>
              }
            />
          </FormGroup>
          <FormGroup
            label="Encryption key"
            labelFor="encryption-key-input"
            labelInfo="*"
          >
            <InputGroup
              leftIcon="key"
              disabled={loading || lockEncryptionKey}
              value={key}
              onChange={(event) => setKey(event?.target?.value)}
              large
              id="ecnryption-key-input"
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
            <Button large onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!key || !data.label || !data.username || !data.password}
              loading={loading}
              large
              intent={Intent.PRIMARY}
              onClick={() => {
                writeData({
                  collection: "credentials",
                  src: user.ref,
                  data: { ...data, password: encrypt(data.password) },
                  callback: () => {
                    onClose();
                    primary({
                      icon: "plus",
                      message: "Credentials added with success",
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
