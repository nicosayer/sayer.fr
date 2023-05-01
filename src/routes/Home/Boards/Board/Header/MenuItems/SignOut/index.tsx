import { Menu } from "@mantine/core";
import { IconPower } from "@tabler/icons-react";
import { FC } from "react";
import { useSignOut } from "react-firebase-hooks/auth";
import { auth } from "utils/firebase";

const SignOutMenuItem: FC = () => {
  const [signOut] = useSignOut(auth);

  return (
    <Menu.Item color="red" icon={<IconPower size={18} />} onClick={signOut}>
      Se déconnecter
    </Menu.Item>
  );
};

export default SignOutMenuItem;
