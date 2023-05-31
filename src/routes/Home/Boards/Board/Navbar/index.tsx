import { Navbar as MantineNavbar, Stack } from "@mantine/core";
import {
  IconChecklist,
  IconCreditCard,
  IconEdit,
  IconId,
  IconIroning1,
  IconListCheck,
  IconLockOpen,
  IconSettings,
  IconShoppingCart,
} from "@tabler/icons-react";
import classNames from "classnames";
import { useAppShell } from "components/atoms/AppShell";
import useColors from "hooks/useColors";
import { FC } from "react";
import NavbarButton from "routes/Home/Boards/Board/Navbar/Button";
import { IBoardContext } from "routes/Home/Boards/Board/Provider";

export const menu = [
  {
    icon: <IconLockOpen size={18} />,
    color: "red",
    label: "Mots de passe",
    to: "credentials",
  },
  {
    icon: <IconCreditCard size={18} />,
    color: "grape",
    label: "Cartes de crédit",
    to: "credit-cards",
  },
  {
    icon: <IconId size={18} />,
    color: "indigo",
    label: "Documents",
    to: "documents",
  },
  {
    icon: <IconEdit size={18} />,
    color: "blue",
    label: "Notes",
    to: "notes",
  },
  {
    icon: <IconListCheck size={18} />,
    color: "teal",
    label: "Listes",
    to: "lists",
  },
  {
    icon: <IconIroning1 size={18} />,
    color: "lime",
    label: "Tâches",
    to: "chores",
  },
  {
    icon: <IconShoppingCart size={18} />,
    color: "yellow",
    label: "Courses",
    to: "groceries",
    count: ({ groceries }: IBoardContext) =>
      groceries?.filter((grocery) => !grocery.closedAt).length ?? 0,
  },
  {
    icon: <IconChecklist size={18} />,
    color: "orange",
    label: "Todos",
    to: "todos",
    count: ({ todos }: IBoardContext) =>
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
          {menu.map((element) => (
            <NavbarButton {...element} key={element.label} />
          ))}
        </Stack>
      </MantineNavbar.Section>
      <MantineNavbar.Section
        className={classNames(
          "pt-4 mt-4 border-0 border-solid border-t-[1px]",
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
