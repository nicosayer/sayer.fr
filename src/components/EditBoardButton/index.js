import { Button } from "@blueprintjs/core";
import { EditBoardDialog } from "components/EditBoardDialog";
import { Tooltip } from "components/Tooltip";
import React, { useState } from "react";

export const EditBoardButton = ({ board }) => {
  const [isEditBordDialogOpen, setIsEditBordDialogOpen] = useState(false);

  return (
    <>
      <Tooltip content="Edit board">
        <Button
          icon="cog"
          large
          minimal
          onClick={() => setIsEditBordDialogOpen(true)}
        />
      </Tooltip>
      <EditBoardDialog
        isOpen={isEditBordDialogOpen}
        onClose={() => setIsEditBordDialogOpen(false)}
        board={board}
      />
    </>
  );
};
