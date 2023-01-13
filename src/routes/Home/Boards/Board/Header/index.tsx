import {
  ActionIcon,
  Burger,
  Button,
  Code,
  Group,
  Header as HeaderComponent,
  Menu,
  TextInput,
  useMantineTheme,
} from "@mantine/core";
import { useMediaQuery, useOs } from "@mantine/hooks";
import { useSpotlight } from "@mantine/spotlight";
import { IconSearch, IconUser } from "@tabler/icons";
import { useAppShell } from "components/atoms/AppShell";
import { FC } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Helmet } from "react-helmet";
import NewBoardMenuItem from "routes/Home/Boards/Board/Header/MenuItems/NewBoard";
import SwitchBoardMenuItem from "routes/Home/Boards/Board/Header/MenuItems/SwitchBoard";
import { auth } from "utils/firebase";
import ExtraBoardsBadge from "./ExtraBoardsBadge";
import DarkModeMenuItem from "./MenuItems/DarkMode";
import SettingsMenuItem from "./MenuItems/Settings";
import SignOutMenuItem from "./MenuItems/SignOut";
import Title from "./Title";

const Header: FC = () => {
  const { isNavbarOpened, toggleNavbar } = useAppShell();
  const theme = useMantineTheme();
  const [user] = useAuthState(auth);
  const spotlight = useSpotlight();
  const is768px = useMediaQuery("(min-width: 768px)");
  const os = useOs();

  return (
    <>
      <Helmet>
        <meta name="theme-color" content="#ffffff" data-react-helmet="true" />
      </Helmet>
      <HeaderComponent height={{ base: 50, md: 70 }} p="md">
        <div className="flex items-center justify-between h-full">
          <Group>
            {is768px ? null : (
              <Burger
                opened={isNavbarOpened}
                onClick={toggleNavbar}
                size="sm"
                color={theme.colors.gray[6]}
              />
            )}
            <Title />
            <ExtraBoardsBadge />
          </Group>
          <Group>
            {is768px ? (
              <TextInput
                readOnly
                placeholder="Rechercher"
                icon={<IconSearch size={18} />}
                onFocus={(event) => {
                  spotlight.openSpotlight();
                  event.target.blur();
                }}
                rightSectionWidth={80}
                rightSection={
                  <Code>{os === "macos" ? "Cmd" : "Ctrl"} + K</Code>
                }
                classNames={{ rightSection: "pointer-events-none" }}
              />
            ) : (
              <ActionIcon
                variant="light"
                onClick={() => {
                  spotlight.openSpotlight();
                }}
              >
                <IconSearch size={18} />
              </ActionIcon>
            )}
            <Menu shadow="md" width={200} withinPortal>
              <Menu.Target>
                <div>
                  {is768px ? (
                    <Button variant="light" leftIcon={<IconUser size={18} />}>
                      {user?.email}
                    </Button>
                  ) : (
                    <ActionIcon variant="light" color="blue">
                      <IconUser size={18} />
                    </ActionIcon>
                  )}
                </div>
              </Menu.Target>

              <Menu.Dropdown>
                <NewBoardMenuItem />
                <SwitchBoardMenuItem />
                <DarkModeMenuItem />
                <SettingsMenuItem />
                <SignOutMenuItem />
              </Menu.Dropdown>
            </Menu>
          </Group>
        </div>
      </HeaderComponent>
    </>
  );
};

export default Header;
