import {
  AnchorButton,
  Button,
  Classes,
  Dialog,
  FormGroup,
  InputGroup,
  Intent,
} from "@blueprintjs/core";
import { useCallback, useMemo, useState } from "react";

import { useWriteData } from "hooks/useWriteData";
import { uniqueId } from "utils";
import { useEncryption } from "hooks/useEncryption";
import { Tooltip } from "components/Tooltip";

const EMPTY_DATA = {
  label: "",
  url: "",
  username: "",
  password: "",
};

export const NewCredentialDialog = ({ isOpen, onClose, user }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [writeData, loading] = useWriteData();
  const { encrypt, key } = useEncryption();
  const [data, setData] = useState(EMPTY_DATA);

  const handleChange = useCallback(
    (key) => (event) => {
      setData({ ...data, [key]: event?.target?.value });
    },
    [data]
  );

  const handleClose = () => {
    onClose();
    setData(EMPTY_DATA);
    setShowPassword(false);
  };

  const missingDatas = useMemo(
    () =>
      [
        { data: key, name: "Encryption key" },
        { data: data.label, name: "Label" },
        { data: data.username, name: "Username" },
        { data: data.password, name: "Password" },
      ].filter(({ data }) => !data),
    [key, data.label, data.username, data.password]
  );

  return (
    <Dialog
      isOpen={isOpen}
      onClose={handleClose}
      title={`New credential • ${user.name}`}
    >
      <div className={Classes.DIALOG_BODY}>
        <FormGroup large label="Label" labelFor="label-input" labelInfo="*">
          <InputGroup
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
            disabled={loading}
            value={data.password}
            onChange={handleChange("password")}
            large
            id="password-input"
            placeholder={showPassword ? uniqueId() : "••••••••••"}
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
        <FormGroup label="Encryption key" labelFor="encryption-key-input">
          <InputGroup id="encryption-key-input" disabled value={key} large />
        </FormGroup>
        <Tooltip
          disabled={!missingDatas.length}
          content={`Missing ${missingDatas.map(({ name }) => name).join(", ")}`}
          targetClassName="full-width"
        >
          <div>
            <AnchorButton
              disabled={missingDatas.length}
              loading={loading}
              large
              intent={Intent.PRIMARY}
              fill
              onClick={() => {
                writeData({
                  collection: "credentials",
                  src: user.ref,
                  data: { ...data, password: encrypt(data.password) },
                  callback: handleClose,
                });
              }}
            >
              Submit
            </AnchorButton>
          </div>
        </Tooltip>
      </div>
    </Dialog>
  );
};
