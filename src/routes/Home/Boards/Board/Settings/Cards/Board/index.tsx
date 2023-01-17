import {
  ActionIcon,
  Badge,
  Button,
  Card,
  MultiSelect,
  Stack,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconX } from "@tabler/icons";
import { updateDoc } from "firebase/firestore";
import useBooleanState from "hooks/useBooleanState";
import { FC, useState } from "react";
import { BoardDocument } from "types/firebase/collections";
import { getColorFromString } from "utils/color";
import { capitalizeFirsts, sanitize } from "utils/string";
import { ONE_SECOND } from "utils/time";

export interface BoardCardProps {
  board: BoardDocument;
}

const BoardCard: FC<BoardCardProps> = ({ board }) => {
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
              const tag = capitalizeFirsts(query.trim());
              setTags((old) => [...old, tag]);
              return tag;
            }}
            shouldCreate={(query) => {
              return (
                query.length > 2 &&
                !tags.map(sanitize).includes(sanitize(query))
              );
            }}
            valueComponent={({ value, onRemove, ...p }) => {
              return (
                <Badge
                  color={getColorFromString(value)}
                  variant="dot"
                  className="mr-2"
                  rightSection={
                    <ActionIcon
                      size="xs"
                      variant="transparent"
                      onClick={onRemove}
                      className="-mr-[6px]"
                    >
                      <IconX size={10} />
                    </ActionIcon>
                  }
                >
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
