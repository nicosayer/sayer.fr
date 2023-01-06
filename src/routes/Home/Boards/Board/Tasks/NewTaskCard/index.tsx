import { ActionIcon, Card, Group, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMediaQuery } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons";
import TagSelect from "components/molecules/Select/Tag";
import dayjs from "dayjs";
import { addDoc, collection } from "firebase/firestore";
import useBooleanState from "hooks/useBooleanState";
import { FC } from "react";
import { Collection, TaskDocument } from "types/firebase/collections";
import { useBoard } from "../../Provider";

const NewTaskCard: FC = () => {
  const { board } = useBoard();
  const is768Px = useMediaQuery("(min-width: 768px)");
  const [loading, start, stop] = useBooleanState();
  const form = useForm({
    initialValues: {
      description: "",
      tag: "",
    },
    validate: {
      description: (description) => {
        return description.length > 0 ? null : true;
      },
    },
  });

  return (
    <Card withBorder>
      <form
        onSubmit={form.onSubmit((values) => {
          if (board?.id && board.ref) {
            start();
            addDoc<TaskDocument>(collection(board.ref, Collection.tasks), {
              description: values.description.trim(),
              order: +dayjs(),
              date: dayjs().format("YYYY-MM-DD"),
              tag: values.tag,
            })
              .then(() => {
                form.setValues({
                  description: "",
                  tag: "",
                });
              })
              .finally(stop);
          }
        })}
      >
        <Group position="apart" noWrap>
          <div className="flex items-center w-full gap-2">
            <ActionIcon
              variant="light"
              type="submit"
              color={form.values.description ? "blue" : undefined}
            >
              <IconPlus size={18} />
            </ActionIcon>
            <TextInput
              autoFocus
              data-autofocus
              withAsterisk
              className="w-full"
              variant="unstyled"
              placeholder="Nouvelle tâche"
              {...form.getInputProps("description")}
            />
          </div>
          {board?.tags?.length && is768Px ? (
            <TagSelect
              placeholder="Étiquette"
              board={board}
              loading={loading}
              {...form.getInputProps("tag")}
            />
          ) : undefined}
        </Group>
      </form>
    </Card>
  );
};

export default NewTaskCard;
