import { Modal } from "@mantine/core";
import TaskCardContent from "components/organisms/TaskCardContent";
import { FC, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useBoard } from "../../Provider";

const Task: FC = () => {
  const { tasks } = useBoard();
  const { boardId, taskId } = useParams();
  const navigate = useNavigate();

  const task = useMemo(() => {
    return tasks?.find((task) => task.id === taskId);
  }, [taskId, tasks]);

  if (!task) {
    return null;
  }

  return (
    <Modal
      opened={Boolean(taskId)}
      onClose={() => navigate(`/boards/${boardId}/tasks`)}
      withCloseButton={false}
      centered
      trapFocus={false}
      size="xl"
    >
      <TaskCardContent task={task} />
    </Modal>
  );
};

export default Task;
