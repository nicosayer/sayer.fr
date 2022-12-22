import { Checkbox, Group, Indicator, Stack, TextInput } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { IconChevronDown } from "@tabler/icons";
import TagSelect from "components/molecules/Select/Tag";
import { deleteDoc, updateDoc } from "firebase/firestore";
import { FC, useEffect, useMemo, useState } from "react";
import { useBoard } from "routes/Home/Boards/Board/Provider";
import { TaskDocument } from "types/firebase/collections";
import { getColorFromString } from "utils/color";
import { ONE_SECOND } from "utils/time";

export interface TaskCardContentProps {
  task: TaskDocument;
}

const TaskCardContent: FC<TaskCardContentProps> = ({ task }) => {
  const { boards } = useBoard();
  const [description, setDescription] = useState(task?.description);
  const [debouncedDescription] = useDebouncedValue(
    task?.description,
    10 * ONE_SECOND
  );

  const board = useMemo(() => {
    return boards?.find((board) => board.id === task?.ref?.parent.parent?.id);
  }, [boards, task?.ref?.parent.parent?.id]);

  useEffect(() => {
    setDescription(debouncedDescription);
  }, [debouncedDescription]);

  return (
    <Stack>
      <Group position="apart" noWrap>
        <div className="flex items-center w-full gap-2">
          <Checkbox
            checked={Boolean(task.done)}
            className="flex"
            classNames={{ input: "cursor-pointer" }}
            onChange={(event) => {
              if (task.ref) {
                updateDoc<TaskDocument>(task.ref, {
                  done: event.currentTarget.checked,
                });
              }
            }}
          />
          <TextInput
            disabled={task.done}
            className="w-full"
            variant="unstyled"
            value={description}
            onChange={(event) => {
              setDescription(event.target.value);
              if (task.ref && event.target.value) {
                updateDoc<TaskDocument>(task.ref, {
                  description: event.target.value,
                });
              }
            }}
            onBlur={(event) => {
              if (!event.target.value && task.ref) {
                deleteDoc(task.ref);
              }
            }}
          />
        </div>
        {board?.tags?.length ? (
          <TagSelect
            variant="unstyled"
            rightSection={<div />}
            icon={
              task.tag ? (
                <Indicator color={getColorFromString(task.tag)}>
                  <div />
                </Indicator>
              ) : (
                <IconChevronDown size={18} />
              )
            }
            placeholder="Étiquette"
            board={board}
            value={task.tag}
            onChange={(tag) => {
              if (task.ref) {
                updateDoc<TaskDocument>(task.ref, {
                  tag: tag ?? "",
                });
              }
            }}
          />
        ) : undefined}
        {/* {task.tag && (
          <div>
            <Badge variant="dot" color={getColorFromString(task.tag)}>
              {task.tag}
            </Badge>
          </div>
        )} */}
      </Group>
    </Stack>
  );
};

export default TaskCardContent;
