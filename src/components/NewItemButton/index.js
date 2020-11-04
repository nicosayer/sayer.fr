import { Button, Intent, Menu, MenuItem, Popover } from "@blueprintjs/core";
import { NewCredentialDialog } from "components/NewCredentialDialog";
import { NewDocumentDialog } from "components/NewDocumentDialog";
import React, { useState } from "react";

export const NewItemButton = ({ user }) => {
  const [isNewDocumentOpen, setIsNewDocumentOpen] = useState(false);
  const [isNewCredentialOpen, setIsNewCredentialOpen] = useState(false);

  return (
    <>
      <Popover
        content={
          <Menu large>
            <MenuItem
              icon="lock"
              text="New credentials"
              onClick={() => setIsNewCredentialOpen(true)}
            />
            <MenuItem
              icon="document-open"
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
        user={user}
      />
      <NewCredentialDialog
        isOpen={isNewCredentialOpen}
        onClose={() => setIsNewCredentialOpen(false)}
        user={user}
      />
    </>
  );
};
