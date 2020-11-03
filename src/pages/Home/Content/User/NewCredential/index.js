import {
  Button,
  Classes,
  Dialog,
  FormGroup,
  InputGroup,
  Intent,
  Tooltip,
} from "@blueprintjs/core";
import { useCallback, useState } from "react";

import { useWriteData } from "hooks/useWriteData";
import { uniqueId } from "utils";

const EMPTY_DATA = {
  label: "",
  url: "",
  username: "",
  password: "",
};

function NewCredential({ isOpen, onClose, user }) {
  const [showPassword, setShowPassword] = useState(false);
  const [writeData, loading] = useWriteData();
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

  return (
    <Dialog
      isOpen={isOpen}
      onClose={handleClose}
      title={`New credential • ${user.name}`}
    >
      <div className={Classes.DIALOG_BODY}>
        <FormGroup
          disabled={loading}
          large
          label="Label"
          labelFor="label-input"
          labelInfo="*"
        >
          <InputGroup
            value={data.label}
            onChange={handleChange("label")}
            autoFocus
            large
            id="label-input"
            placeholder="Facebook"
          />
        </FormGroup>
        <FormGroup disabled={loading} label="URL" labelFor="url-input">
          <InputGroup
            value={data.url}
            onChange={handleChange("url")}
            large
            id="url-input"
            placeholder="https://facebook.fr"
          />
        </FormGroup>
        <FormGroup
          disabled={loading}
          label="Username"
          labelFor="username-input"
          labelInfo="*"
        >
          <InputGroup
            value={data.username}
            onChange={handleChange("username")}
            large
            id="username-input"
            placeholder="mark@gmail.com"
          />
        </FormGroup>
        <FormGroup
          disabled={loading}
          label="Password"
          labelFor="password-input"
          labelInfo="*"
        >
          <InputGroup
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
                  minimal={true}
                  onClick={() => setShowPassword(!showPassword)}
                />
              </Tooltip>
            }
          />
        </FormGroup>
        <Button
          loading={loading}
          large
          intent={Intent.PRIMARY}
          fill
          onClick={() => {
            writeData({
              collection: "credentials",
              src: user.ref,
              data,
              callback: handleClose,
            });
          }}
        >
          Submit
        </Button>
      </div>
    </Dialog>
  );
}

export default NewCredential;
