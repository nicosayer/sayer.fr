import { Classes, Dialog } from "@blueprintjs/core";
import { Box } from "components/Box";

export const FormDialog = ({
  isOpen,
  onClose,
  leftAction,
  actions = [],
  inputs,
  ...rest
}) => {
  return (
    <Dialog isOpen={isOpen} onClose={onClose} {...rest}>
      <form>
        <div className={Classes.DIALOG_BODY}>{inputs}</div>
        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            {leftAction && (
              <Box style={{ marginLeft: "-10px", marginRight: "auto" }}>
                {leftAction}
              </Box>
            )}
            {actions}
          </div>
        </div>
      </form>
    </Dialog>
  );
};
