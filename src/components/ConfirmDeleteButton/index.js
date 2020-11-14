import { Classes, Intent } from "@blueprintjs/core";
import { Box } from "components/Box";
import { Button } from "components/Button";
import { useDeleteData } from "hooks/useDeleteData";
import { useState } from "react";
import React from "react";

export const ConfirmDeleteButton = ({
  src,
  onSuccess = () => null,
  message = "Êtes-vous sûr de vouloir le supprimer ?",
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
                  Annuler
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
                Supprimer
              </Button>
            </div>
          </>
        ),
      }}
      {...rest}
    />
  );
};
