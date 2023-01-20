import { Navbar as MantineNavbar, Stack } from "@mantine/core";
import {
  IconChecklist,
  IconCreditCard,
  IconId,
  IconLockOpen,
  IconPencil,
  IconSettings,
  IconShoppingCart,
} from "@tabler/icons";
import classNames from "classnames";
import { useAppShell } from "components/atoms/AppShell";
import useColors from "hooks/useColors";
import { FC } from "react";
import NavbarButton from "routes/Home/Boards/Board/Navbar/Button";
import { IBoardContext } from "../Provider";

const menu = [
  {
    icon: <IconLockOpen size={18} />,
    color: "red",
    label: "Mots de passe",
    to: "credentials",
  },
  {
    icon: <IconCreditCard size={18} />,
    color: "orange",
    label: "Cartes de crédit",
    to: "credit-cards",
  },
  {
    icon: <IconId size={18} />,
    color: "yellow",
    label: "Documents",
    to: "documents",
  },
  {
    icon: <IconShoppingCart size={18} />,
    color: "green",
    label: "Courses",
    to: "groceries",
    count: ({ groceries }: IBoardContext) =>
      groceries?.filter((grocery) => !grocery.closeDate).length ?? 0,
  },
  {
    icon: <IconPencil size={18} />,
    color: "blue",
    label: "Notes",
    to: "notes",
  },
  // {
  //   icon: <IconPhoto size={18} />,
  //   color: "violet",
  //   label: "Souvenirs",
  //   to: "souvenirs",
  // },
  {
    icon: <IconChecklist size={18} />,
    color: "violet",
    label: "Tâches",
    to: "tasks",
    count: ({ tasks }: IBoardContext) =>
      tasks?.filter((task) => !task.closeDate).length ?? 0,
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
