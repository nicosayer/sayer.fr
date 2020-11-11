import { FormGroup } from "@blueprintjs/core";
import { uniqueId } from "utils";

export const Label = ({
  label,
  component,
  componentProps = {},
  ...rest
}) => {
  const id = uniqueId("input");
  const Component = component;

  return (
    <FormGroup label={label} labelFor={id} {...rest}>
      <Component id={id} {...componentProps} />
    </FormGroup>
  );
};
