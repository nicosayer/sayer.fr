import { Button, Classes, Intent, Popover } from "@blueprintjs/core";
import { Box } from "components/Box";
import { useDeleteData } from "hooks/useDeleteData";
import { useToaster } from "providers/ToasterProvider";
import { useState } from "react";
import { capitalize } from "lodash/fp";

export const DeletePopover = ({
  src,
  onSuccess = () => {},
  children,
  name = "item",
}) => {
  const [isDeletePopoverOpen, setIsDeletePopoverOpen] = useState(false);
  const [deleteData, loading] = useDeleteData();
  const { danger } = useToaster();

  return (
    <Popover
      isOpen={isDeletePopoverOpen}
      onInteraction={setIsDeletePopoverOpen}
      content={
        <>
          <p>Are you sure you want to delete this {name}?</p>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: 15,
            }}
          >
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
                deleteData({
                  src,
                  onSuccess: () => {
                    danger({
                      icon: "trash",
                      message: `${capitalize(name)} deleted with success`,
                    });
                    onSuccess();
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
      {children}
    </Popover>
  );
};
