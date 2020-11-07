import { AnchorButton } from "@blueprintjs/core";
import { EditCredentialDialog } from "components/EditCredentialDialog";
import { Tooltip } from "components/Tooltip";
import React, { useState } from "react";

export const EditCredentialButton = ({ credential }) => {
  const [isEditCredentialDialogOpen, setIsEditCredentialDialogOpen] = useState(
    false
  );

  return (
    <>
      <Tooltip content="Edit credential">
        <AnchorButton
          minimal
          icon="edit"
          onClick={() => setIsEditCredentialDialogOpen(true)}
        />
      </Tooltip>
      <EditCredentialDialog
        isOpen={isEditCredentialDialogOpen}
        onClose={() => setIsEditCredentialDialogOpen(false)}
        credential={credential}
      />
    </>
  );
};
