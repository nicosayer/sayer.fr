import { Menu } from "@mantine/core";
import { IconPlus } from "@tabler/icons";
import { auth } from "configs/firebase";
import { FC } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { useBoards } from "routes/Home/Boards/Provider";
import { newBoard } from "utils/boards";

const NewBoardMenuItem: FC = () => {
  const { boards } = useBoards();
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  return (
    <Menu.Item
      icon={<IconPlus size={14} />}
      onClick={() => {
        if (user?.email) {
          newBoard({ user, boards: boards ?? [] }).then((board) => {
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
