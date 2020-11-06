import { Button } from "@blueprintjs/core";
import { NewBoardDialog } from "components/NewBoardDialog";
import React, { useState } from "react";

export const NewBoardButton = ({children}) => {
  const [isNewBordDialogOpen, setIsNewBordDialogOpen] = useState(false);

  return (
    <>
      <Button large icon="plus" onClick={() => setIsNewBordDialogOpen(true)}>
        {children}
      </Button>
      <NewBoardDialog
        isOpen={isNewBordDialogOpen}
        onClose={() => setIsNewBordDialogOpen(false)}
      />
    </>
  );
};
