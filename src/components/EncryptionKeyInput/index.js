import { Button, InputGroup } from "@blueprintjs/core";
import { useWindowSize } from "hooks/useWindowSize";
import { useEncryption } from "providers/EncryptionProvider";
import { useCallback, useState } from "react";

export const EncryptionKeyInput = ({ onSubmit = () => {}, id, inputRef }) => {
  const { key, setKey } = useEncryption();
  const [tempKey, setTempKey] = useState(key);
  const { isOnComputer } = useWindowSize();

  const handleSubmit = useCallback(
    (value = tempKey) => {
      setKey(value);
      onSubmit();
    },
    [tempKey, setKey, onSubmit]
  );

  return (
    <InputGroup
      id={id}
      inputRef={inputRef}
      autoCapitalize="none"
      onKeyDown={({ key }) => {
        if (key === "Enter") {
          handleSubmit();
        }
      }}
      large
      leftIcon="key"
      type="text"
      value={tempKey}
      onChange={(event) => setTempKey(event?.target?.value)}
      autoFocus={isOnComputer}
      rightElement={
        key && tempKey === key ? (
          <Button
            icon="cross"
            onClick={() => {
              handleSubmit("");
            }}
          />
        ) : (
          <Button
            icon="arrow-right"
            onClick={() => {
              handleSubmit();
            }}
          />
        )
      }
    />
  );
};
