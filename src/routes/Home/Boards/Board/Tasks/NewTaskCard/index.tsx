import { ActionIcon, Card, Group, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMediaQuery } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons";
import TagSelect from "components/molecules/Select/Tag";
import dayjs from "dayjs";
import { addDoc, collection } from "firebase/firestore";
import useBooleanState from "hooks/useBooleanState";
import { FC } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Collection, TaskDocument } from "types/firebase/collections";
import { auth } from "utils/firebase";
import { useBoard } from "../../Provider";

const NewTaskCard: FC = () => {
  const { board } = useBoard();
  const [user] = useAuthState(auth);
  const is768Px = useMediaQuery("(min-width: 768px)");
  const [loading, start, stop] = useBooleanState();
  const form = useForm({
    initialValues: {
      name: "",
      tag: "",
    },
    validate: {
      name: (name) => {
        return name.length > 0 ? null : true;
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
              name: values.name.trim(),
              order: +dayjs(),
              openedBy: user?.email ?? "",
              openDate: dayjs().format("YYYY-MM-DD"),
              tag: values.tag,
            })
              .then(() => {
                form.setValues({
                  name: "",
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
              color={form.values.name ? "blue" : undefined}
            >
              <IconPlus size={18} />
            </ActionIcon>
            <TextInput
              data-autofocus
              withAsterisk
              className="w-full"
              variant="unstyled"
              placeholder="Nouvelle tâche"
              {...form.getInputProps("name")}
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
