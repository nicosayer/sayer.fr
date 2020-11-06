import { Button } from "@blueprintjs/core";
import { EditBoardDialog } from "components/EditBoardDialog";
import React, { useState } from "react";

export const EditBoardButton = ({ board }) => {
  const [isEditBordDialogOpen, setIsEditBordDialogOpen] = useState(false);

  return (
    <>
      <Button
        icon="cog"
        large
        minimal
        onClick={() => setIsEditBordDialogOpen(true)}
      />
      <EditBoardDialog
        isOpen={isEditBordDialogOpen}
        onClose={() => setIsEditBordDialogOpen(false)}
        board={board}
      />
    </>
  );
};
