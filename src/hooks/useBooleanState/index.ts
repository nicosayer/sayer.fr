import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { timer } from "utils/time";

const useBooleanState = (
  defaultValue = false
): [
  boolean,
  () => void,
  () => void,
  () => void,
  Dispatch<SetStateAction<boolean>>
] => {
  const [value, setValue] = useState(defaultValue);

  return useMemo(() => {
    return [
      value,
      () => {
        setValue(true);
      },
      async () => {
        await timer(200);
        setValue(false);
      },
      () => {
        setValue((old) => !old);
      },
      setValue,
    ];
  }, [value]);
};

export default useBooleanState;
