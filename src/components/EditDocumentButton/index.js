import { AnchorButton } from "@blueprintjs/core";
import { EditDocumentDialog } from "components/EditDocumentDialog";
import { Tooltip } from "components/Tooltip";
import React, { useState } from "react";

export const EditDocumentButton = ({ document }) => {
  const [isEditDocumentDialogOpen, setIsEditDocumentDialogOpen] = useState(
    false
  );

  return (
    <>
      <Tooltip content="Edit document">
        <AnchorButton
          minimal
          icon="edit"
          onClick={() => setIsEditDocumentDialogOpen(true)}
        />
      </Tooltip>
      <EditDocumentDialog
        isOpen={isEditDocumentDialogOpen}
        onClose={() => setIsEditDocumentDialogOpen(false)}
        document={document}
      />
    </>
  );
};
