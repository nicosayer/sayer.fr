import { InputGroup } from "@blueprintjs/core";

export const Input = ({ onChange, ...rest }) => {
  return (
    <InputGroup
      onChange={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onChange(event?.target?.value);
      }}
      {...rest}
    />
  );
};
