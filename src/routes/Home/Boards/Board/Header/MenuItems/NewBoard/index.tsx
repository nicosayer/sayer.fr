import { Menu } from "@mantine/core";
import { IconPlus } from "@tabler/icons";
import { auth, db } from "configs/firebase";
import { addDoc, collection } from "firebase/firestore";
import { FC } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { Collection } from "types/firebase/collections";

const NewBoardMenuItem: FC = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  return (
    <Menu.Item
      icon={<IconPlus size={14} />}
      onClick={() => {
        if (user?.email) {
          addDoc(collection(db, Collection.boards), {
            users: [user.email],
            name: `Board de ${user.displayName ?? user.email}`,
          }).then((board) => {
            navigate(`../${board.id}`);
          });
        }
      }}
    >
      Nouveau board
    </Menu.Item>
  );
};

export default NewBoardMenuItem;
