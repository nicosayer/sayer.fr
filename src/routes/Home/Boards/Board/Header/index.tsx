import {
  Burger,
  Button,
  Header as HeaderComponent,
  MediaQuery,
  Menu,
  Stack,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { closeAllModals, openModal } from "@mantine/modals";
import {
  IconArrowRight,
  IconMoon,
  IconPlus,
  IconPower,
  IconSettings,
  IconSun,
  IconSwitchHorizontal,
} from "@tabler/icons";
import { useAppShell } from "components/atoms/AppShell";
import { auth, db } from "configs/firebase";
import { addDoc, collection } from "firebase/firestore";
import { FC } from "react";
import { useAuthState, useSignOut } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { useBoard } from "routes/Home/Boards/Board/Provider";
import { useBoards } from "routes/Home/Boards/Provider";
import { Collection } from "types/firebase/collections";

const Header: FC = () => {
  const { opened, setOpened } = useAppShell();
  const theme = useMantineTheme();
  const [user] = useAuthState(auth);
  const [signOut] = useSignOut(auth);
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const { board } = useBoard();
  const { boards } = useBoards();
  const navigate = useNavigate();

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
              <Button variant="light">{user?.email}</Button>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item
                icon={<IconPlus size={14} />}
                onClick={() => {
                  if (user?.email) {
                    addDoc(collection(db, Collection.boards), {
                      users: [user.email],
                      name: `Board de ${user.displayName ?? user.email}`,
                    }).then((board) => {
                      navigate(`../${board.id}`);
                    });
                  }
                }}
              >
                Nouveau board
              </Menu.Item>
              <Menu.Item
                icon={<IconSwitchHorizontal size={14} />}
                onClick={() => {
                  openModal({
                    centered: true,
                    title: "Changer de board",
                    children: (
                      <Stack>
                        {boards?.map((board) => (
                          <Button
                            key={board.id}
                            variant="light"
                            rightIcon={<IconArrowRight />}
                            onClick={() => {
                              navigate(`../${board.id}`);
                              closeAllModals();
                            }}
                          >
                            {board.name}
                          </Button>
                        ))}
                      </Stack>
                    ),
                  });
                }}
              >
                Changer de board
              </Menu.Item>
              <Menu.Item
                icon={
                  colorScheme === "dark" ? (
                    <IconSun size={14} />
                  ) : (
                    <IconMoon size={14} />
                  )
                }
                onClick={() => toggleColorScheme()}
              >
                {colorScheme === "dark" ? "Mode clair" : "Mode sombre"}
              </Menu.Item>
              <Menu.Item
                icon={<IconSettings size={14} />}
                onClick={() => {
                  navigate("settings");
                }}
              >
                Paramètres
              </Menu.Item>
              <Menu.Item
                color="red"
                icon={<IconPower size={14} />}
                onClick={signOut}
              >
                Se déconnecter
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </div>
      </div>
    </HeaderComponent>
  );
};

export default Header;
