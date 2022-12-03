import { AppShell as MantineAppShell, useMantineTheme } from "@mantine/core";
import React, {
  createContext,
  FC,
  ReactElement,
  ReactNode,
  useContext,
  useMemo,
  useState,
} from "react";

interface IAppShellContext {
  opened: boolean;
  setOpened: React.Dispatch<React.SetStateAction<boolean>>;
}

const AppShellContext = createContext<IAppShellContext>({
  opened: false,
  setOpened: () => false,
});

AppShellContext.displayName = "AppShell";

export const useAppShell = () => useContext(AppShellContext);

interface AppShellProps {
  header: ReactElement;
  navbar: ReactElement;
  children: ReactNode;
}

const AppShell: FC<AppShellProps> = ({ header, navbar, children }) => {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);

  const context = useMemo(() => {
    return { opened, setOpened };
  }, [opened]);

  return (
    <AppShellContext.Provider value={context}>
      <MantineAppShell
        styles={{
          main: {
            background:
              theme.colorScheme === "dark"
                ? theme.colors.dark[8]
                : theme.colors.gray[0],
          },
        }}
        navbarOffsetBreakpoint="sm"
        asideOffsetBreakpoint="sm"
        navbar={navbar}
        header={header}
      >
        <div className="max-w-[896px] m-auto h-full">{children}</div>
      </MantineAppShell>
    </AppShellContext.Provider>
  );
};

export default AppShell;
