import { Menu, useMantineColorScheme } from "@mantine/core";
import { IconMoon, IconSun } from "@tabler/icons";
import { FC } from "react";

const DarkModeMenuItem: FC = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return (
    <Menu.Item
      icon={
        colorScheme === "dark" ? <IconSun size={14} /> : <IconMoon size={14} />
      }
      onClick={() => toggleColorScheme()}
    >
      {colorScheme === "dark" ? "Mode clair" : "Mode sombre"}
    </Menu.Item>
  );
};

export default DarkModeMenuItem;
