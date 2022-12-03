import {
  ActionIcon,
  Burger,
  Button,
  Header as HeaderComponent,
  MediaQuery,
  Menu,
  TextInput,
  useMantineTheme,
} from "@mantine/core";
import { useSpotlight } from "@mantine/spotlight";
import { IconSearch, IconUser } from "@tabler/icons";
import { useAppShell } from "components/atoms/AppShell";
import { auth } from "configs/firebase";
import { FC } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import NewBoardMenuItem from "routes/Home/Boards/Board/Header/MenuItems/NewBoard";
import SwitchBoardMenuItem from "routes/Home/Boards/Board/Header/MenuItems/SwitchBoard";
import { useBoard } from "routes/Home/Boards/Board/Provider";
import DarkModeMenuItem from "./MenuItems/DarkMode";
import SettingsMenuItem from "./MenuItems/Settings";
import SignOutMenuItem from "./MenuItems/SignOut";

const Header: FC = () => {
  const { opened, setOpened } = useAppShell();
  const theme = useMantineTheme();
  const [user] = useAuthState(auth);
  const { board } = useBoard();
  const spotlight = useSpotlight();

  return (
    <HeaderComponent height={{ base: 50, md: 70 }} p="md">
      <div className="flex items-center justify-between h-full">
        <div className="flex items-center h-full">
          <MediaQuery largerThan="sm" styles={{ display: "none" }}>
            <Burger
              opened={opened}
              onClick={() => setOpened((o) => !o)}
              size="sm"
              color={theme.colors.gray[6]}
              mr="xl"
            />
          </MediaQuery>
          <div>{board?.name}</div>
        </div>
        <MediaQuery largerThan="sm" styles={{ display: "none" }}>
          <ActionIcon
            variant="light"
            onClick={() => {
              spotlight.openSpotlight();
            }}
          >
            <IconSearch size={18} />
          </ActionIcon>
        </MediaQuery>
        <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
          <TextInput
            placeholder="Rechercher"
            variant="filled"
            icon={<IconSearch size={18} />}
            onFocus={(event) => {
              spotlight.openSpotlight();
              event.target.blur();
            }}
          />
        </MediaQuery>

        <Menu shadow="md" width={200}>
          <Menu.Target>
            <div>
              <MediaQuery largerThan="sm" styles={{ display: "none" }}>
                <ActionIcon variant="light" color="blue">
                  <IconUser size={18} />
                </ActionIcon>
              </MediaQuery>
              <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
                <Button variant="light" leftIcon={<IconUser size={18} />}>
                  {user?.email}
                </Button>
              </MediaQuery>
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
      </div>
    </HeaderComponent>
  );
};

export default Header;
