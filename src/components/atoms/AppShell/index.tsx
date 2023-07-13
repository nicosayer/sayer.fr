import { AppShell as MantineAppShell, useMantineTheme } from "@mantine/core";
import useBooleanState from "hooks/useBooleanState";
import {
  createContext,
  FC,
  ReactElement,
  ReactNode,
  useContext,
  useMemo,
} from "react";

interface IAppShellContext {
  isNavbarOpened: boolean;
  openNavbar: () => void;
  closeNavbar: () => void;
  toggleNavbar: () => void;
}

const AppShellContext = createContext<IAppShellContext>({
  isNavbarOpened: false,
  openNavbar: () => {},
  closeNavbar: () => {},
  toggleNavbar: () => {},
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
  const [isNavbarOpened, openNavbar, closeNavbar, toggleNavbar] =
    useBooleanState();

  const context = useMemo(() => {
    return { isNavbarOpened, openNavbar, closeNavbar, toggleNavbar };
  }, [isNavbarOpened, openNavbar, closeNavbar, toggleNavbar]);

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
        <div className="h-full max-w-4xl m-auto">{children}</div>
      </MantineAppShell>
    </AppShellContext.Provider>
  );
};

export default AppShell;
