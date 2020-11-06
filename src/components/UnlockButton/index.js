import {
  Button,
  Classes,
  FormGroup,
  Intent,
  Popover,
} from "@blueprintjs/core";
import { EncryptionKeyInput } from "components/EncryptionKeyInput";
import { Tooltip } from "components/Tooltip";
import { useEncryption } from "providers/EncryptionProvider";
import React, { useEffect, useState } from "react";

export const UnlockButton = () => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const { locked } = useEncryption();
  const [inputRef, setInputRef] = useState();

  useEffect(() => {
    if (inputRef) {
      inputRef.select();
    }
  }, [inputRef]);

  return (
    <Popover
      isOpen={isPopoverOpen}
      onInteraction={setIsPopoverOpen}
      popoverClassName={Classes.POPOVER_CONTENT_SIZING}
      content={
        <FormGroup label="Encryption key" labelFor="povover-encryption-key-input">
          <EncryptionKeyInput
            id="povover-encryption-key-input"
            onSubmit={() => {
              setIsPopoverOpen(false);
            }}
            inputRef={setInputRef}
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
