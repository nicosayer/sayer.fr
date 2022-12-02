import { Button, Card, MultiSelect, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { updateDoc } from "firebase/firestore";
import useBooleanState from "hooks/useBooleanState";
import { FC, useState } from "react";
import { useBoard } from "routes/Home/Boards/Board/Provider";
import { BoardDocument } from "types/firebase/collections";
import { ONE_SECOND } from "utils/time";

const SettingsCard: FC = () => {
  const { board } = useBoard();
  const [loading, start, stop] = useBooleanState({ stopDelay: ONE_SECOND });

  const [users, setUsers] = useState(board?.users ?? []);

  const form = useForm({
    initialValues: {
      boardName: board?.name ?? "",
      boardUsers: board?.users ?? [],
    },

    validate: {
      boardName: (name) => {
        return typeof name === "string" && name.length > 0
          ? null
          : "Ce champ ne doit pas être vide";
      },
      boardUsers: (users) => {
        return Array.isArray(users) &&
          users.every(
            (user) => typeof user === "string" && /^.+@.+\..+$/.test(user)
          )
          ? null
          : "Ce champ ne doit pas être vide";
      },
    },
  });

  return (
    <Card withBorder>
      <form
        onSubmit={form.onSubmit((values) => {
          if (board?.ref) {
            start();
            updateDoc<BoardDocument>(board.ref, {
              name: values.boardName.trim(),
              users: values.boardUsers,
            }).finally(stop);
          }
        })}
      >
        <Stack>
          <TextInput
            label="Nom du board"
            placeholder="Board de Nicolas"
            disabled={loading}
            {...form.getInputProps("boardName")}
          />
          <MultiSelect
            label="Utilisateurs"
            description="Les utilisateurs peuvent visualiser, modifier et supprimer tous les élèments du board"
            data={users}
            placeholder="admin@acme.com"
            searchable
            creatable
            getCreateLabel={(query) => `+ Ajouter ${query}`}
            onCreate={(query) => {
              setUsers((current) => [...current, query]);
              return query;
            }}
            shouldCreate={(query) => {
              return /^.+@.+\..+$/.test(query);
            }}
            {...form.getInputProps("boardUsers")}
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

export default SettingsCard;
