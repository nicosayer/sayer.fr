import { TagInput } from "@blueprintjs/core";
import { Button } from "components/Button";

import { Tooltip } from "components/Tooltip";

export const EmailsInput = ({ onReset, ...rest }) => {
  return (
    <TagInput
      addOnBlur
      tagProps={{
        minimal: true,
        fill: true,
      }}
      inputProps={{
        autoCapitalize: "none",
      }}
      rightElement={
        onReset && (
          <Tooltip content="Reset">
            <Button icon="reset" onClick={onReset} />
          </Tooltip>
        )
      }
      {...rest}
    />
  );
};
