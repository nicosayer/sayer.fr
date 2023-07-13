import {
  Group,
  Text,
  UnstyledButton,
  useMantineColorScheme,
} from "@mantine/core";
import { SpotlightActionProps, SpotlightProvider } from "@mantine/spotlight";
import { IconSearch } from "@tabler/icons-react";
import classNames from "classnames";
import { PropsWithChildren, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useBoard } from "routes/Home/Boards/Board/Provider";
import { formatDate } from "utils/dayjs";
import { searchString } from "utils/string";

function CustomAction({
  action,
  styles,
  hovered,
  onTrigger,
  ...others
}: SpotlightActionProps) {
  const theme = useMantineColorScheme();

  return (
    <UnstyledButton
      className={classNames(
        "relative block w-full py-2.5 px-3 rounded",
        {
          "bg-dark-400": hovered && theme.colorScheme === "dark",
          "bg-gray-100": hovered && theme.colorScheme !== "dark",
        }
      )}
      onClick={onTrigger}
      {...others}
    >
      <Group noWrap>
        <div className="flex-1">
          <Text>{action.title}</Text>
          {action.description && (
            <Text color="dimmed" size="xs">
              {action.description}
            </Text>
          )}
        </div>
      </Group>
    </UnstyledButton>
  );
}

const Spotlight = ({ children }: PropsWithChildren) => {
  const { credentials, documents, lists, notes } = useBoard();
  const [query, setQuery] = useState("");

  const navigate = useNavigate();
  const { boardId } = useParams();

  return (
    <SpotlightProvider
      className="mx-4"
      shortcut="mod + K"
      nothingFoundMessage="Aucun résultat"
      placeholder="Rechercher"
      searchIcon={<IconSearch size={18} />}
      limit={5}
      searchPlaceholder="Rechercher"
      query={query}
      onQueryChange={setQuery}
      actions={[
        ...(credentials ?? []).map((credential) => {
          return {
            title: credential.name ?? "",
            description: credential.username,
            group: "Mot de passe",
            onTrigger: () => {
              navigate(`/boards/${boardId}/credentials/${credential.id}`);
            },
          };
        }),
        ...(documents ?? []).map((document) => {
          return {
            title: document.name ?? "",
            group: "Document",
            description: document.mime?.split("/")[1].toUpperCase(),
            onTrigger: () => {
              navigate(`/boards/${boardId}/documents/${document.id}`);
            },
          };
        }),
        ...(lists ?? []).map((list) => {
          return {
            title: list.name ?? "",
            group: "List",
            onTrigger: () => {
              navigate(`/boards/${boardId}/lists/${list.id}`);
            },
          };
        }),
        ...(notes ?? []).map((note) => {
          return {
            title: note.name ?? "",
            description: formatDate(note.date, "D MMMM YYYY"),
            search: note.text,
            group: "Note",
            onTrigger: () => {
              navigate(`/boards/${boardId}/notes/${note.id}`);
            },
          };
        }),
      ]}
      filter={(query, actions) =>
        actions.filter((action) => {
          return searchString(
            `${action.title}${action.description}${action.search}`,
            query
          );
        })
      }
      actionComponent={CustomAction}
    >
      {children}
    </SpotlightProvider>
  );
};

export default Spotlight;
