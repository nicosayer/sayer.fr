import { Navbar as MantineNavbar, Stack } from "@mantine/core";
import {
  IconChecklist,
  IconCreditCard,
  IconId,
  IconLockOpen,
  IconPencilPlus,
  IconSettings,
  IconShoppingCart,
} from "@tabler/icons";
import { useAppShell } from "components/atoms/AppShell";
import { FC } from "react";
import NavbarButton from "routes/Home/Boards/Board/Navbar/Button";

const menu = [
  {
    icon: <IconLockOpen size={18} />,
    color: "red",
    label: "Mot de passes",
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
  },
  {
    icon: <IconPencilPlus size={18} />,
    color: "blue",
    label: "Notes",
    to: "notes",
  },
  {
    icon: <IconChecklist size={18} />,
    color: "violet",
    label: "Tâches",
    to: "tasks",
  },
];

const Navbar: FC = () => {
  const { isNavbarOpened } = useAppShell();

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
      <MantineNavbar.Section className="pt-4 mt-4 border-0 border-gray-200 border-solid border-t-[1px]">
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
