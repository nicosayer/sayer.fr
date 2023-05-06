import { Button, Card, MultiSelect, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import useBooleanState from "hooks/useBooleanState";
import { FC, useState } from "react";
import { BoardDocument } from "types/firebase/collections";
import { updateDoc } from "utils/firebase";
import { cleanString } from "utils/string";
import { ONE_SECOND } from "utils/time";

export interface BoardCardProps {
  board: BoardDocument;
}

const BoardCard: FC<BoardCardProps> = ({ board }) => {
  const [loading, start, stop] = useBooleanState({ stopDelay: ONE_SECOND });
  const [users, setUsers] = useState(board?.users ?? []);

  const form = useForm({
    initialValues: {
      name: board?.name ?? "",
      users: board?.users ?? [],
    },

    validate: {
      name: (name) => {
        return name.length > 0 ? null : "Ce champ ne doit pas être vide";
      },
      users: (users) => {
        return users.every(
          (user) => typeof user === "string" && /^.+@.+\..+$/.test(user)
        )
          ? null
          : "Ce champ ne doit pas être vide";
      },
    },

    transformValues: (values) => {
      return {
        name: cleanString(values.name),
        users: values.users,
      };
    },
  });

  return (
    <Card withBorder>
      <form
        onSubmit={form.onSubmit((values) => {
          if (board?.ref) {
            start();
            updateDoc<BoardDocument>(board.ref, {
              name: values.name,
              users: values.users,
            }).finally(stop);
          }
        })}
      >
        <Stack>
          <TextInput
            label="Nom du board"
            placeholder="Board de John"
            disabled={loading}
            {...form.getInputProps("name")}
          />
          <MultiSelect
            withinPortal
            label="Utilisateurs"
            description="Les utilisateurs peuvent visualiser, modifier et supprimer tous les élèments du board"
            data={users}
            placeholder="john.doe@acme.com"
            searchable
            creatable
            getCreateLabel={(query) => `+ Ajouter ${query}`}
            onCreate={(query) => {
              const user = query.trim().toLowerCase();
              setUsers((old) => [...old, user]);
              return user;
            }}
            shouldCreate={(query) => {
              return /^.+@.+\..+$/.test(query);
            }}
            {...form.getInputProps("users")}
          />
          <div>
            <button
              type="submit"
              disabled
              className="hidden"
              aria-hidden="true"
            />
            <Button loading={loading} type="submit">
              Sauvegarder
            </Button>
          </div>
        </Stack>
      </form>
    </Card>
  );
};

export default BoardCard;
