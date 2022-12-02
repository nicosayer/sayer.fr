import { Navbar as MantineNavbar } from "@mantine/core";
import { IconId, IconLockOpen, IconSettings } from "@tabler/icons";
import { useAppShell } from "components/atoms/AppShell";
import { FC } from "react";
import NavbarButton from "routes/Home/Boards/Board/Navbar/Button";

const menu = [
  {
    icon: <IconLockOpen size={16} />,
    color: "blue",
    label: "Mot de passes",
    to: "passwords",
  },
  {
    icon: <IconId size={16} />,
    color: "green",
    label: "Documents",
    to: "documents",
  },
];

const Navbar: FC = () => {
  const { opened } = useAppShell();

  return (
    <MantineNavbar
      p="md"
      hiddenBreakpoint="sm"
      hidden={!opened}
      width={{ sm: 200, lg: 300 }}
    >
      <MantineNavbar.Section grow>
        <div>
          {menu.map((element) => (
            <NavbarButton {...element} key={element.label} />
          ))}
        </div>
      </MantineNavbar.Section>
      <MantineNavbar.Section>
        <NavbarButton
          icon={<IconSettings size={16} />}
          color="gray"
          label="Paramètres"
          to="settings"
        />
      </MantineNavbar.Section>
    </MantineNavbar>
  );
};

export default Navbar;
