import { Button, Card, Stack, TextInput, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { db } from "configs/firebase";
import { doc, updateDoc } from "firebase/firestore";
import useBooleanState from "hooks/useBooleanState";
import { FC } from "react";
import { useBoard } from "routes/Home/Boards/Board/Provider";
import { Collection } from "types/firebase/collections";
import { ONE_SECOND } from "utils/time";

const Settings: FC = () => {
  const { board } = useBoard();
  const [loading, start, stop] = useBooleanState({ stopDelay: ONE_SECOND });

  const form = useForm({
    initialValues: {
      boardName: board?.name ?? "",
    },

    validate: {
      boardName: (value) => {
        return typeof value === "string" && value.length > 0 ? null : "Erreur";
      },
    },
  });

  return (
    <Card withBorder>
      <Card.Section className="p-4 border-b-4 border-indigo-500">
        <Title order={3}>Paramètres</Title>
      </Card.Section>
      <form
        onSubmit={form.onSubmit((values) => {
          if (board?.id) {
            start();
            updateDoc(doc(db, Collection.boards, board.id), {
              name: values.boardName.trim(),
            }).finally(stop);
          }
        })}
      >
        <Stack>
          <TextInput
            label="Nom du board"
            placeholder="Board de Xavier Niel"
            disabled={loading}
            {...form.getInputProps("boardName")}
          />
          <div>
            <Button loading={loading} type="submit">
              Sauvegarder
            </Button>
          </div>
        </Stack>
      </form>
    </Card>
  );
};

export default Settings;
