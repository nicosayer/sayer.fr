import { useDebouncedState } from "@mantine/hooks";
import classNames from "classnames";
import LoadingOverlay from "components/atoms/LoadingOverlay";
import { createContext, FC, ReactNode, useContext, useMemo } from "react";

interface IFullPageLoadingContext {
  loading: boolean;
  start: () => void;
  stop: () => void;
}

const FullPageLoadingContext = createContext<IFullPageLoadingContext>({
  loading: true,
  start: () => {},
  stop: () => {},
});

FullPageLoadingContext.displayName = "FullPageLoading";

export const useFullPageLoading = () => useContext(FullPageLoadingContext);

interface FullPageLoadingProviderProps {
  children: ReactNode;
}

const FullPageLoadingProvider: FC<FullPageLoadingProviderProps> = ({
  children,
}) => {
  const [loading, setFullPageLoading] = useDebouncedState(true, 200);

  const context = useMemo(() => {
    return {
      loading,
      start: () => {
        setFullPageLoading(true);
      },
      stop: () => {
        setFullPageLoading(false);
      },
    };
  }, [loading, setFullPageLoading]);

  return (
    <FullPageLoadingContext.Provider value={context}>
      <LoadingOverlay visible={loading} />
      <div
        className={classNames("h-full", loading ? "opacity-0" : "opacity-1")}
      >
        {children}
      </div>
    </FullPageLoadingContext.Provider>
  );
};

export default FullPageLoadingProvider;
