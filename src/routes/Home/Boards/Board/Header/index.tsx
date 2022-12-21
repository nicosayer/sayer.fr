import {
  ActionIcon,
  Burger,
  Button,
  Group,
  Header as HeaderComponent,
  Menu,
  Text,
  TextInput,
  useMantineTheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useSpotlight } from "@mantine/spotlight";
import { IconHome, IconSearch, IconUser } from "@tabler/icons";
import { useAppShell } from "components/atoms/AppShell";
import { FC } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import NewBoardMenuItem from "routes/Home/Boards/Board/Header/MenuItems/NewBoard";
import SwitchBoardMenuItem from "routes/Home/Boards/Board/Header/MenuItems/SwitchBoard";
import { useBoard } from "routes/Home/Boards/Board/Provider";
import { auth } from "utils/firebase";
import DarkModeMenuItem from "./MenuItems/DarkMode";
import SettingsMenuItem from "./MenuItems/Settings";
import SignOutMenuItem from "./MenuItems/SignOut";

const Header: FC = () => {
  const { isNavbarOpened, toggleNavbar } = useAppShell();
  const theme = useMantineTheme();
  const [user] = useAuthState(auth);
  const { board } = useBoard();
  const spotlight = useSpotlight();
  const is768px = useMediaQuery("(min-width: 768px)");
  const navigate = useNavigate();

  return (
    <HeaderComponent height={{ base: 50, md: 70 }} p="md">
      <div className="flex items-center justify-between h-full">
        <div className="flex items-center h-full">
          {is768px ? null : (
            <Burger
              opened={isNavbarOpened}
              onClick={toggleNavbar}
              size="sm"
              color={theme.colors.gray[6]}
              mr="xl"
            />
          )}
          <Group
            spacing="xs"
            className="cursor-pointer"
            onClick={() => {
              navigate("/");
            }}
          >
            {is768px ? <IconHome size={18} /> : null}
            <Text
              fw={500}
              className="max-w-[250px] overflow-hidden text-ellipsis whitespace-nowrap"
            >
              {board?.name ?? 'Tous les boards'}
            </Text>
          </Group>
        </div>
        {is768px ? (
          <TextInput
            placeholder="Rechercher"
            icon={<IconSearch size={18} />}
            onFocus={(event) => {
              spotlight.openSpotlight();
              event.target.blur();
            }}
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
        <Menu shadow="md" width={200}>
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
      </div>
    </HeaderComponent>
  );
};

export default Header;
