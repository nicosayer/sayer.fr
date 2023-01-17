import { ActionIcon, Autocomplete, Card, Group } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMediaQuery } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons";
import TagSelect from "components/molecules/Select/Tag";
import dayjs from "dayjs";
import { addDoc, collection, deleteDoc } from "firebase/firestore";
import useBooleanState from "hooks/useBooleanState";
import { FC } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Collection, GroceryDocument } from "types/firebase/collections";
import { auth } from "utils/firebase";
import { sanitize } from "utils/string";
import { useBoard } from "../../Provider";

const NewGroceryCard: FC = () => {
  const { board, groceries } = useBoard();
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
            const name = values.name.trim();
            addDoc<GroceryDocument>(
              collection(board.ref, Collection.groceries),
              {
                name,
                order: +dayjs(),
                openedBy: user?.email ?? "",
                openDate: dayjs().format("YYYY-MM-DD"),
                tag: values.tag,
              }
            )
              .then(() => {
                form.setValues({
                  name: "",
                  tag: "",
                });
                return groceries
                  ?.filter(
                    (grocery) =>
                      sanitize(String(grocery.name)) === sanitize(name)
                  )
                  .forEach((grocery) => {
                    if (grocery.ref) {
                      deleteDoc(grocery.ref);
                    }
                  });
              })
              .finally(stop);
          }
        })}
      >
        <Group position="apart" noWrap>
          <div className="flex items-center w-full gap-2">
            <ActionIcon
              type="submit"
              variant="light"
              color={form.values.name ? "blue" : undefined}
            >
              <IconPlus size={18} />
            </ActionIcon>
            <Autocomplete
              withinPortal
              data={
                form.values.name
                  ? (groceries ?? [])
                      .filter((grocery) => grocery.closeDate)
                      .map((grocery) => grocery.name)
                  : []
              }
              withAsterisk
              className="w-full"
              variant="unstyled"
              placeholder="Nouvelle course"
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

export default NewGroceryCard;
