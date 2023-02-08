import {
  Loader,
  LoadingOverlay as MantineLoadingOverlay,
  LoadingOverlayProps as MantineLoadingOverlayProps,
} from "@mantine/core";
import { useDidUpdate } from "@mantine/hooks";
import { FC, useState } from "react";

interface LoadingOverlayProps extends MantineLoadingOverlayProps {}

const getDefaultDeg = () =>
  Math.round((new Date().getMilliseconds() / 999) * 359);

const LoadingOverlay: FC<LoadingOverlayProps> = ({ visible, ...rest }) => {
  const [deg, setDeg] = useState(getDefaultDeg());

  useDidUpdate(() => {
    if (visible) {
      setDeg(getDefaultDeg());
    }
  }, [visible]);

  return (
    <MantineLoadingOverlay
      zIndex={0}
      visible={visible}
      loader={<Loader style={{ transform: `rotate(${deg}deg)` }} />}
      {...rest}
    />
  );
};

export default LoadingOverlay;