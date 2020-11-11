import { Classes, Intent } from "@blueprintjs/core";
import { Box } from "components/Box";
import { Button } from "components/Button";
import { useDeleteData } from "hooks/useDeleteData";
import { useState } from "react";

export const ConfirmDeleteButton = ({
  src,
  onSuccess = () => null,
  message = "Are you sure you want to delete this?",
  onClick,
  ...rest
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [deleteData, loading] = useDeleteData();

  return (
    <Button
      popoverProps={{
        isOpen: isOpen,
        onInteraction: setIsOpen,
        content: (
          <>
            <p>{message}</p>
            <div className={Classes.DIALOG_FOOTER_ACTIONS}>
              <Box style={{ marginRight: "10px" }}>
                <Button disabled={loading} onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
              </Box>
              <Button
                intent={Intent.DANGER}
                onClick={() => {
                  setIsOpen(false);
                  deleteData({
                    src,
                    onSuccess,
                  });
                }}
                loading={loading}
              >
                Delete
              </Button>
            </div>
          </>
        ),
      }}
      {...rest}
    />
  );
};
