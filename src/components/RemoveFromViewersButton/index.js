import { Button, Classes, Intent, Popover } from "@blueprintjs/core";
import { Box } from "components/Box";
import { useRoles } from "hooks/useRoles";
import { useWriteData } from "hooks/useWriteData";
import { useToaster } from "providers/ToasterProvider";
import { useUser } from "providers/UserProvider";
import React, { useState } from "react";

export const RemoveFromViewersButton = ({ board }) => {
  const { isViewerOf } = useRoles();
  const [writeData, loading] = useWriteData();
  const { user } = useUser();
  const { toast } = useToaster();
  const [isDeletePopoverOpen, setIsDeletePopoverOpen] = useState(false);

  if (!isViewerOf(board)) {
    return null;
  }

  return (
    <Popover
      isOpen={isDeletePopoverOpen}
      onInteraction={setIsDeletePopoverOpen}
      content={
        <>
          <p>Are you sure you want to remove this board?</p>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Box style={{ marginRight: "10px" }}>
              <Button
                disabled={loading}
                onClick={() => setIsDeletePopoverOpen(false)}
              >
                Cancel
              </Button>
            </Box>
            <Button
              intent={Intent.DANGER}
              onClick={() => {
                writeData({
                  src: board.ref,
                  data: {
                    name: board.name,
                    editors: board.editors,
                    viewers: board.viewers.filter(
                      (viewer) => viewer !== user.email
                    ),
                  },
                  onSuccess: () => {
                    toast({
                      icon: "trash",
                      message: "Board removed with success",
                    });
                  },
                });
              }}
              loading={loading}
            >
              Remove
            </Button>
          </div>
        </>
      }
      popoverClassName={Classes.POPOVER_CONTENT_SIZING}
    >
      <Button loading={loading} icon="trash" large minimal />
    </Popover>
  );
};
