import { Button, Intent, Menu, MenuItem, Popover } from "@blueprintjs/core";
import { NewCredentialDialog } from "components/NewCredentialDialog";
import { NewDocumentDialog } from "components/NewDocumentDialog";
import React, { useState } from "react";

export const NewItemButton = ({ board }) => {
  const [isNewDocumentOpen, setIsNewDocumentOpen] = useState(false);
  const [isNewCredentialOpen, setIsNewCredentialOpen] = useState(false);

  return (
    <>
      <Popover
        content={
          <Menu large>
            <MenuItem
              icon="lock"
              text="New credential"
              onClick={() => setIsNewCredentialOpen(true)}
            />
            <MenuItem
              icon="id-number"
              text="New document"
              onClick={() => setIsNewDocumentOpen(true)}
            />
          </Menu>
        }
      >
        <Button intent={Intent.PRIMARY} large icon="plus" />
      </Popover>
      <NewDocumentDialog
        isOpen={isNewDocumentOpen}
        onClose={() => setIsNewDocumentOpen(false)}
        board={board}
      />
      <NewCredentialDialog
        isOpen={isNewCredentialOpen}
        onClose={() => setIsNewCredentialOpen(false)}
        board={board}
      />
    </>
  );
};
