import { Dispatch, SetStateAction, useCallback, useState } from "react";
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

  const start = useCallback(async () => {
    await timer(startDelay);
    setValue(true);
  }, [startDelay]);

  const stop = useCallback(async () => {
    await timer(stopDelay);
    setValue(false);
  }, [stopDelay]);

  const toggle = useCallback(async () => {
    await timer(value ? stopDelay : startDelay);
    setValue((old) => !old);
  }, [startDelay, stopDelay, value]);

  return [value, start, stop, toggle, setValue];
};

export default useBooleanState;
