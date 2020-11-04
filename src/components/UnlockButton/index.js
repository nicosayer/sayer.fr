import {
  Button,
  Classes,
  FormGroup,
  InputGroup,
  Intent,
  Popover,
} from "@blueprintjs/core";
import { Tooltip } from "components/Tooltip";
import { useEncryption } from "hooks/useEncryption";
import React, { useEffect, useState } from "react";

export const UnlockButton = () => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const { key, setKey, locked } = useEncryption();
  const [inputRef, setInputRef] = useState();

  useEffect(() => {
    const handleKeyDown = ({ key }) => {
      if (key === "Enter") {
        setIsPopoverOpen(false);
      }
    };

    inputRef?.select();

    inputRef?.addEventListener("keydown", handleKeyDown);

    return () => {
      inputRef?.removeEventListener("keydown", handleKeyDown);
    };
  }, [inputRef]);

  return (
    <Popover
      isOpen={isPopoverOpen}
      onInteraction={setIsPopoverOpen}
      popoverClassName={Classes.POPOVER_CONTENT_SIZING}
      content={
        <FormGroup
          label="Enter the encryption key"
          labelFor="encryption-key-input"
        >
          <InputGroup
            large
            leftIcon="key"
            inputRef={setInputRef}
            id="encryption-key-input"
            type="text"
            value={key}
            onChange={(event) => setKey(event?.target?.value)}
            autoFocus={true}
            rightElement={
              <Button
                icon="cross"
                minimal
                onClick={() => {
                  setIsPopoverOpen(false);
                  setKey("");
                }}
              />
            }
          />
        </FormGroup>
      }
    >
      <Tooltip
        disabled={isPopoverOpen}
        intent={locked ? Intent.DANGER : Intent.WARNING}
        content={locked ? "Items are locked" : "Items might be vulnerable"}
      >
        <Button
          intent={locked ? Intent.DANGER : Intent.WARNING}
          large
          rightIcon={locked ? "lock" : "unlock"}
        />
      </Tooltip>
    </Popover>
  );
};
