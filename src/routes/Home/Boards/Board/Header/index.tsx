import {
  ActionIcon,
  Badge,
  Burger,
  Button,
  Checkbox,
  Code,
  Group,
  Header as HeaderComponent,
  Menu,
  Text,
  TextInput,
  useMantineTheme,
} from "@mantine/core";
import { useMediaQuery, useOs } from "@mantine/hooks";
import { useSpotlight } from "@mantine/spotlight";
import { IconLayoutList, IconSearch, IconUser } from "@tabler/icons";
import { useAppShell } from "components/atoms/AppShell";
import { xor } from "lodash";
import { FC, useMemo } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate, useParams } from "react-router-dom";
import NewBoardMenuItem from "routes/Home/Boards/Board/Header/MenuItems/NewBoard";
import SwitchBoardMenuItem from "routes/Home/Boards/Board/Header/MenuItems/SwitchBoard";
import { useBoard } from "routes/Home/Boards/Board/Provider";
import { auth } from "utils/firebase";
import { useBoards } from "../../Provider";
import DarkModeMenuItem from "./MenuItems/DarkMode";
import SettingsMenuItem from "./MenuItems/Settings";
import SignOutMenuItem from "./MenuItems/SignOut";

const Header: FC = () => {
  const { isNavbarOpened, toggleNavbar } = useAppShell();
  const theme = useMantineTheme();
  const [user] = useAuthState(auth);
  const { board, boards: currentBoards, setExtraBoardIds } = useBoard();
  const { boards } = useBoards();
  const { boardId } = useParams();
  const spotlight = useSpotlight();
  const is768px = useMediaQuery("(min-width: 768px)");
  const navigate = useNavigate();
  const os = useOs();

  const otherBoards = useMemo(() => {
    return boards?.filter((board) => board.id !== boardId) ?? [];
  }, [boards, boardId]);

  const title = useMemo(() => {
    return (
      <Group spacing="xs">
        {is768px ? <IconLayoutList size={18} /> : null}
        <Text
          fw={500}
          className="max-w-[250px] overflow-hidden text-ellipsis whitespace-nowrap"
        >
          {board?.name ?? "Tous les boards"}
        </Text>
      </Group>
    );
  }, [board?.name, is768px]);

  return (
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
          {otherBoards.length ? (
            <Menu
              shadow="md"
              width={200}
              withinPortal
              trigger="hover"
              position="bottom-start"
            >
              <Menu.Target>{title}</Menu.Target>

              <Menu.Dropdown>
                <Menu.Label>Changer de board</Menu.Label>
                {otherBoards.map((board) => (
                  <Menu.Item
                    key={board.id}
                    onClick={() => {
                      navigate(`../${board.id}`);
                    }}
                  >
                    {board.name}
                  </Menu.Item>
                ))}
              </Menu.Dropdown>
            </Menu>
          ) : (
            title
          )}
          {otherBoards.length ? (
            <Menu
              shadow="md"
              width={200}
              withinPortal
              trigger="hover"
              position="bottom-start"
            >
              <Menu.Target>
                <Badge>+{(currentBoards?.length ?? 1) - 1}</Badge>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>Afficher les boards</Menu.Label>
                {boards?.map((board) => (
                  <Menu.Item
                    key={board.id}
                    disabled={board.id === boardId}
                    icon={
                      <Checkbox
                        disabled={board.id === boardId}
                        checked={Boolean(
                          currentBoards?.find(
                            (currentBoard) => currentBoard.id === board.id
                          )
                        )}
                        readOnly
                        classNames={{
                          input: "cursor-pointer",
                        }}
                      />
                    }
                    onClick={() => {
                      if (board.id) {
                        setExtraBoardIds(
                          (old) => xor(old, [board.id]) as string[]
                        );
                      }
                    }}
                  >
                    {board.name}
                  </Menu.Item>
                ))}
              </Menu.Dropdown>
            </Menu>
          ) : undefined}
        </Group>
        <Group>
          {is768px ? (
            <TextInput
              placeholder="Rechercher"
              icon={<IconSearch size={18} />}
              onFocus={(event) => {
                spotlight.openSpotlight();
                event.target.blur();
              }}
              rightSectionWidth={80}
              rightSection={<Code>{os === "macos" ? "Cmd" : "Ctrl"} + K</Code>}
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
        </Group>
      </div>
    </HeaderComponent>
  );
};

export default Header;
