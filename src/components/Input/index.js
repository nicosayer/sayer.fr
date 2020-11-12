import { InputGroup } from "@blueprintjs/core";

export const Input = ({
  onChange = () => null,
  onBlur = () => null,
  ...rest
}) => {
  return (
    <InputGroup
      onChange={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onChange(event?.target?.value);
      }}
      onBlur={(event) => {
        onBlur(event?.target?.value);
      }}
      {...rest}
    />
  );
};
