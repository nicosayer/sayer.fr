import { Navbar as MantineNavbar, Stack } from "@mantine/core";
import {
  IconChecklist,
  IconEdit,
  IconId,
  IconListCheck,
  IconLockOpen,
  IconSettings,
  IconShoppingCart,
} from "@tabler/icons-react";
import classNames from "classnames";
import { useAppShell } from "components/atoms/AppShell";
import useColors from "hooks/useColors";
import { ISecureLoginContext } from "providers/SecureLogin";
import { FC } from "react";
import NavbarButton from "routes/Home/Boards/Board/Navbar/Button";
import { IBoardContext } from "routes/Home/Boards/Board/Provider";

const COLORS = [
  "red",
  "pink",
  "grape",
  "violet",
  "indigo",
  "blue",
  "cyan",
  "teal",
  "green",
  "lime",
  "yellow",
  "orange",
];

export const menu: {
  icon: JSX.Element;
  label: string;
  to: string;
  getBadgeContent: (
    board: IBoardContext,
    secureLogin: ISecureLoginContext
  ) => string | number;
}[] = [
  {
    icon: <IconLockOpen size={18} />,
    label: "Mots de passe",
    to: "credentials",
    getBadgeContent: ({ credentials }, secureLogin) =>
      secureLogin.isSecure ? credentials?.length ?? 0 : "?",
  },
  {
    icon: <IconId size={18} />,
    label: "Documents",
    to: "documents",
    getBadgeContent: ({ documents }) => documents?.length ?? 0,
  },
  {
    icon: <IconEdit size={18} />,
    label: "Notes",
    to: "notes",
    getBadgeContent: ({ notes }) => notes?.length ?? 0,
  },
  {
    icon: <IconListCheck size={18} />,
    label: "Listes",
    to: "lists",
    getBadgeContent: ({ lists }) => lists?.length ?? 0,
  },
  {
    icon: <IconShoppingCart size={18} />,
    label: "Courses",
    to: "groceries",
    getBadgeContent: ({ groceries }) =>
      groceries?.filter((grocery) => !grocery.closedAt).length ?? 0,
  },
  {
    icon: <IconChecklist size={18} />,
    label: "Todos",
    to: "todos",
    getBadgeContent: ({ todos }) =>
      todos?.filter((todo) => !todo.closedAt).length ?? 0,
  },
];

const Navbar: FC = () => {
  const { isNavbarOpened } = useAppShell();
  const { darkMode } = useColors();

  return (
    <MantineNavbar
      p="md"
      hiddenBreakpoint="sm"
      hidden={!isNavbarOpened}
      width={{ sm: 200, lg: 300 }}
    >
      <MantineNavbar.Section>
        <Stack>
          {menu.map((element, index) => (
            <NavbarButton
              {...element}
              key={element.label}
              color={COLORS[index * 2]}
            />
          ))}
        </Stack>
      </MantineNavbar.Section>
      <MantineNavbar.Section
        className={classNames(
          "pt-4 mt-4 border-0 border-solid border-t",
          darkMode ? "border-[#2C2E33]" : "border-[#e9ecef]"
        )}
      >
        <NavbarButton
          icon={<IconSettings size={18} />}
          color="gray"
          label="Paramètres"
          to="settings"
        />
      </MantineNavbar.Section>
    </MantineNavbar>
  );
};

export default Navbar;
