import { AnchorButton, Intent } from "@blueprintjs/core";
import { NewCredentialDialog } from "components/NewCredentialDialog";
import { Tooltip } from "components/Tooltip";
import React, { useState } from "react";

export const NewCredentialButton = ({ user }) => {
  const [isNewCredentialOpen, setIsNewCredentialOpen] = useState(false);

  return (
    <>
      <Tooltip intent={Intent.PRIMARY} content="Add new item">
        <AnchorButton
          intent={Intent.PRIMARY}
          large
          icon="plus"
          onClick={() => setIsNewCredentialOpen(true)}
        />
      </Tooltip>
      <NewCredentialDialog
        isOpen={isNewCredentialOpen}
        onClose={() => setIsNewCredentialOpen(false)}
        user={user}
      />
    </>
  );
};
