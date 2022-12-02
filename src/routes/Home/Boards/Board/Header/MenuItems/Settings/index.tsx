import { Menu } from "@mantine/core";
import { IconSettings } from "@tabler/icons";
import { FC } from "react";
import { useNavigate } from "react-router-dom";

const SettingsMenuItem: FC = () => {
  const navigate = useNavigate();

  return (
    <Menu.Item
      icon={<IconSettings size={14} />}
      onClick={() => {
        navigate("settings");
      }}
    >
      Paramètres
    </Menu.Item>
  );
};

export default SettingsMenuItem;