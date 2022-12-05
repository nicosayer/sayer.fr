import {
  Badge,
  Button,
  Card,
  MultiSelect,
  Stack,
  TextInput,
} from "@mantine/core";
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
  const [tags, setTags] = useState(board?.tags ?? []);

  const form = useForm({
    initialValues: {
      name: board?.name ?? "",
      tags: board?.tags ?? [],
      users: board?.users ?? [],
    },

    validate: {
      name: (name) => {
        return name.length > 0 ? null : "Ce champ ne doit pas être vide";
      },
      tags: (tags) => {
        return Array.isArray(tags) && tags.every((tag) => tag.length > 0)
          ? null
          : "Ce champ ne doit pas être vide";
      },
      users: (users) => {
        return users.every(
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
              name: values.name.trim(),
              users: values.users,
              tags: values.tags,
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
            label="Étiquettes"
            data={tags}
            placeholder="John Doe"
            searchable
            creatable
            getCreateLabel={(query) => `+ Ajouter ${query}`}
            onCreate={(query) => {
              setTags((current) => [...current, query]);
              return query;
            }}
            shouldCreate={(query) => {
              return query.length > 2;
            }}
            valueComponent={({ value }) => {
              return (
                <Badge color="red" variant="dot" className="mr-2">
                  {value}
                </Badge>
              );
            }}
            {...form.getInputProps("tags")}
          />
          <MultiSelect
            label="Utilisateurs"
            description="Les utilisateurs peuvent visualiser, modifier et supprimer tous les élèments du board"
            data={users}
            placeholder="john.doe@acme.com"
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
            {...form.getInputProps("users")}
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
