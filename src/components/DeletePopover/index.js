import {
  AnchorButton,
  Button,
  Classes,
  Intent,
  Popover,
} from "@blueprintjs/core";
import { Box } from "components/Box";
import { Tooltip } from "components/Tooltip";
import { useDeleteData } from "hooks/useDeleteData";
import { useToaster } from "providers/ToasterProvider";
import { useState } from "react";

export const DeletePopover = ({ src, callback = () => {} }) => {
  const [isDeletePopoverOpen, setIsDeletePopoverOpen] = useState(false);
  const [deleteData, loading] = useDeleteData();
  const { danger } = useToaster();

  return (
    <Popover
      isOpen={isDeletePopoverOpen}
      onInteraction={setIsDeletePopoverOpen}
      content={
        <>
          <p>Are you sure you want to delete this item?</p>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: 15,
            }}
          >
            <Box style={{ marginRight: "10px" }}>
              <Button onClick={() => setIsDeletePopoverOpen(false)}>
                Cancel
              </Button>
            </Box>
            <Button
              intent={Intent.DANGER}
              onClick={() => {
                deleteData({
                  src,
                  callback: () => {
                    setIsDeletePopoverOpen(false);
                    danger({
                      icon: "trash",
                      message: "Item deleted with success",
                    });
                    callback();
                  },
                });
              }}
              loading={loading}
            >
              Delete
            </Button>
          </div>
        </>
      }
      popoverClassName={Classes.POPOVER_CONTENT_SIZING}
    >
      <Tooltip
        intent={Intent.DANGER}
        content="Remove item"
        diabled={isDeletePopoverOpen}
      >
        <AnchorButton intent={Intent.DANGER} minimal icon="trash" />
      </Tooltip>
    </Popover>
  );
};
