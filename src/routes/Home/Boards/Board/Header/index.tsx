import {
  Burger,
  Button,
  Header as HeaderComponent,
  MediaQuery,
  Menu,
  useMantineTheme,
} from "@mantine/core";
import { IconUser } from "@tabler/icons";
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

  return (
    <HeaderComponent height={{ base: 50, md: 70 }} p="md">
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
        <div className="ml-auto">
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <Button variant="light" leftIcon={<IconUser />}>{user?.email}</Button>
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
      </div>
    </HeaderComponent>
  );
};

export default Header;
