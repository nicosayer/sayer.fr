import { Button, Menu, Stack } from "@mantine/core";
import { closeAllModals, openModal } from "@mantine/modals";
import { IconArrowRight, IconSwitchHorizontal } from "@tabler/icons-react";
import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { useBoards } from "routes/Home/Boards/Provider";

const SitchBoardMenuItem: FC = () => {
  const { boards } = useBoards();
  const navigate = useNavigate();

  if ((boards?.length ?? 0) < 2) {
    return null;
  }

  return (
    <Menu.Item
      icon={<IconSwitchHorizontal size={18} />}
      onClick={() => {
        openModal({
          centered: true,
          title: "Changer de board",
          children: (
            <Stack>
              {boards?.map((board) => (
                <Button
                  key={board.id}
                  variant="light"
                  rightIcon={<IconArrowRight size={18} />}
                  onClick={() => {
                    navigate(`../${board.id}`);
                    closeAllModals();
                  }}
                >
                  {board.name}
                </Button>
              ))}
            </Stack>
          ),
        });
      }}
    >
      Changer de board
    </Menu.Item>
  );
};

export default SitchBoardMenuItem;
