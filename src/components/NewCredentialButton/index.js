import { AnchorButton, Intent } from "@blueprintjs/core";
import { NewCredentialDialog } from "components/NewCredentialDialog";
import { Tooltip } from "components/Tooltip";
import { useEncryption } from "hooks/useEncryption";
import React, { useState } from "react";

export const NewCredentialButton = ({ user }) => {
  const [isNewCredentialOpen, setIsNewCredentialOpen] = useState(false);
  const { locked } = useEncryption();

  return (
    <>
      <Tooltip intent={Intent.PRIMARY} content="Add new item">
        <AnchorButton
          intent={Intent.PRIMARY}
          large
          icon="plus"
          onClick={() => setIsNewCredentialOpen(true)}
          disabled={locked}
        />
      </Tooltip>{" "}
      <NewCredentialDialog
        isOpen={isNewCredentialOpen}
        onClose={() => setIsNewCredentialOpen(false)}
        user={user}
      />
    </>
  );
};
