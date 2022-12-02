import { LoadingOverlay } from "@mantine/core";
import { useDebouncedState } from "@mantine/hooks";
import classNames from "classnames";
import { createContext, FC, ReactNode, useContext, useMemo } from "react";

interface ILoadingContext {
  loading: boolean;
  start: () => void;
  stop: () => void;
}

const LoadingContext = createContext<ILoadingContext>({
  loading: true,
  start: () => {},
  stop: () => {},
});

LoadingContext.displayName = "Loading";

export const useLoading = () => useContext(LoadingContext);

interface LoadingProviderProps {
  children: ReactNode;
}

const LoadingProvider: FC<LoadingProviderProps> = ({ children }) => {
  const [loading, setLoading] = useDebouncedState(true, 200);

  const context = useMemo(() => {
    return {
      loading,
      start: () => {
        setLoading(true);
      },
      stop: () => {
        setLoading(false);
      },
    };
  }, [loading, setLoading]);

  return (
    <LoadingContext.Provider value={context}>
      <LoadingOverlay visible={loading} />
      <div
        className={classNames("h-full", loading ? "opacity-0" : "opacity-1")}
      >
        {children}
      </div>
    </LoadingContext.Provider>
  );
};

export default LoadingProvider;
