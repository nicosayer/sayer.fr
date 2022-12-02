import { Menu } from "@mantine/core";
import { IconPower } from "@tabler/icons";
import { auth } from "configs/firebase";
import { FC } from "react";
import { useSignOut } from "react-firebase-hooks/auth";

const SignOutMenuItem: FC = () => {
  const [signOut] = useSignOut(auth);

  return (
    <Menu.Item color="red" icon={<IconPower size={18} />} onClick={signOut}>
      Se déconnecter
    </Menu.Item>
  );
};

export default SignOutMenuItem;
