import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Group,
  Input,
  MultiSelect,
  Stack,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconX } from "@tabler/icons";
import { deleteDoc } from "firebase/firestore";
import useBooleanState from "hooks/useBooleanState";
import { FC, useState } from "react";
import { BoardDocument, TagDocument } from "types/firebase/collections";
import { updateDoc } from "utils/firebase";
import { cleanString } from "utils/string";
import { ONE_SECOND } from "utils/time";
import NewTagBadge from "./NewTagBadge";

export interface BoardCardProps {
  board: BoardDocument;
  tags: TagDocument[];
}

const BoardCard: FC<BoardCardProps> = ({ board, tags }) => {
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
          <Input.Wrapper label="Etiquettes">
            <Group>
              {tags.map((tag) => {
                return (
                  <Badge
                    key={tag.id}
                    color={tag.color}
                    variant="dot"
                    rightSection={
                      <ActionIcon
                        size="xs"
                        variant="transparent"
                        className="-mr-[6px]"
                        onClick={() => {
                          if (tag.ref) {
                            deleteDoc(tag.ref);
                          }
                        }}
                      >
                        <IconX size={10} />
                      </ActionIcon>
                    }
                  >
                    <div
                      className="outline-none"
                      contentEditable
                      onBlur={(event) => {
                        const value = cleanString(
                          event.currentTarget.textContent ?? ""
                        );

                        if (
                          value &&
                          !tags.some((tag) => tag.name === value) &&
                          tag?.ref
                        ) {
                          event.currentTarget.blur();
                          updateDoc<TagDocument>(tag.ref, { name: value });
                        } else {
                          event.currentTarget.textContent = String(tag.name);
                        }
                      }}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          event.currentTarget.blur();
                        }
                      }}
                    >
                      {tag.name}
                    </div>
                  </Badge>
                );
              })}
              <NewTagBadge board={board} tags={tags} />
            </Group>
          </Input.Wrapper>
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
