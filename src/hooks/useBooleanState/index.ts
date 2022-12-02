import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { timer } from "utils/time";

export interface useBooleanStateProps {
  defaultValue?: boolean;
  startDelay?: number;
  stopDelay?: number;
}

const useBooleanState = ({
  defaultValue = false,
  startDelay = 0,
  stopDelay = 0,
}: useBooleanStateProps = {}): [
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
      async () => {
        await timer(startDelay);
        setValue(true);
      },
      async () => {
        await timer(stopDelay);
        setValue(false);
      },
      async () => {
        await timer(value ? stopDelay : startDelay);
        setValue((old) => !old);
      },
      setValue,
    ];
  }, [startDelay, stopDelay, value]);
};

export default useBooleanState;
