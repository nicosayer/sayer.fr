import { useFullPageLoading } from "providers/FullPageLoading";
import { FC, useEffect } from "react";

const FullPageLoading: FC = () => {
  const { start, stop } = useFullPageLoading();

  useEffect(() => {
    start();

    return () => {
      stop();
    };
  }, [start, stop]);

  return null;
};

export default FullPageLoading;
