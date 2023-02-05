import { Card } from "@mantine/core";
import TaskCardContent from "components/organisms/TaskCardContent";
import { FC } from "react";
import { TaskDocument } from "types/firebase/collections";

export interface ClosedTaskCardProps {
  task: TaskDocument;
}

const ClosedTaskCard: FC<ClosedTaskCardProps> = ({ task }) => {
  return (
    <Card withBorder className="opacity-50">
      <TaskCardContent task={task} />
    </Card>
  );
};

export default ClosedTaskCard;
