import { Navbar as MantineNavbar, Stack } from "@mantine/core";
import {
  IconCreditCard,
  IconId,
  IconLockOpen,
  IconNotes,
  IconSettings,
} from "@tabler/icons";
import { useAppShell } from "components/atoms/AppShell";
import { FC } from "react";
import NavbarButton from "routes/Home/Boards/Board/Navbar/Button";

const menu = [
  {
    icon: <IconLockOpen size={18} />,
    color: "blue",
    label: "Mot de passes",
    to: "credentials",
  },
  {
    icon: <IconId size={18} />,
    color: "green",
    label: "Documents",
    to: "documents",
  },
  {
    icon: <IconCreditCard size={18} />,
    color: "red",
    label: "Cartes de crédit",
    to: "credit-cards",
  },
  {
    icon: <IconNotes size={18} />,
    color: "orange",
    label: "Notes",
    to: "notes",
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
