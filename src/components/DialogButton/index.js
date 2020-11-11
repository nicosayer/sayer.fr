import { Button } from "components/Button";
import React, { useState } from "react";

export const DialogButton = ({
  dialog,
  onClick = () => null,
  dialogProps = {},
  ...rest
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const Dialog = dialog;

  return (
    <>
      <Button
        onClick={(event) => {
          onClick(event);
          setIsDialogOpen(true);
        }}
        {...rest}
      />
      {isDialogOpen && (
        <Dialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          {...dialogProps}
        />
      )}
    </>
  );
};
