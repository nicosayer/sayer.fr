import { Card } from "@mantine/core";
import TaskCardContent from "components/organisms/TaskCardContent";
import { Timestamp } from "firebase/firestore";
import { FC } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { TaskDocument } from "types/firebase/collections";
import { auth, updateDoc } from "utils/firebase";

export interface OpenedTaskCardProps {
  task: TaskDocument;
}

const OpenedTaskCard: FC<OpenedTaskCardProps> = ({ task }) => {
  const [user] = useAuthState(auth);

  return (
    <Card
      withBorder
      className="cursor-pointer"
      onClick={() => {
        if (task.ref && user?.email) {
          updateDoc<TaskDocument>(task.ref, {
            closedAt: Timestamp.now(),
            closedBy: user.email,
          });
        }
      }}
    >
      <TaskCardContent task={task} />
    </Card>
  );
};

export default OpenedTaskCard;
