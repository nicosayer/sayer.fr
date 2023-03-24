import {
  Badge,
  Group,
  Text,
  UnstyledButton,
  useMantineColorScheme,
} from "@mantine/core";
import { SpotlightActionProps, SpotlightProvider } from "@mantine/spotlight";
import { IconSearch } from "@tabler/icons";
import classNames from "classnames";
import { PropsWithChildren, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TagDocument } from "types/firebase/collections";
import { formatDate } from "utils/dayjs";
import { searchString } from "utils/string";
import { useBoards } from "../../Provider";
import { useBoard } from "../Provider";

function CustomAction({
  action,
  styles,
  hovered,
  onTrigger,
  ...others
}: SpotlightActionProps) {
  const theme = useMantineColorScheme();
  const { getTags } = useBoards();

  const tags = useMemo(() => {
    return getTags(action.tags);
  }, [action.tags, getTags]);

  return (
    <UnstyledButton
      className={classNames(
        "relative block w-full py-[10px] px-[12px] rounded",
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
        {tags.map((tag) => (
          <Badge key={tag.id} variant="dot" color={tag.color} size="sm">
            {tag.name}
          </Badge>
        ))}
      </Group>
    </UnstyledButton>
  );
}

const Spotlight = ({ children }: PropsWithChildren) => {
  const { credentials, creditCards, documents, notes } = useBoard();
  const navigate = useNavigate();
  const { boardId } = useParams();
  const { getTags } = useBoards();

  return (
    <SpotlightProvider
      className="mx-4"
      shortcut="mod + K"
      nothingFoundMessage="Aucun résultat"
      placeholder="Rechercher"
      searchIcon={<IconSearch size={18} />}
      limit={5}
      searchPlaceholder="Rechercher"
      actions={(query) =>
        query
          ? [
              ...(credentials ?? []).map((credential) => {
                const tags = getTags(credential.tags);

                return {
                  title: credential.name ?? "",
                  description: credential.username,
                  tags,
                  group: "Mot de passe",
                  onTrigger: () => {
                    navigate(`/boards/${boardId}/credentials/${credential.id}`);
                  },
                };
              }),
              ...(creditCards ?? []).map((creditCard) => {
                const tags = getTags(creditCard.tags);

                return {
                  title: creditCard.name ?? "",
                  description: creditCard.cardholder,
                  tags,
                  group: "Carte de crédit",
                  onTrigger: () => {
                    navigate(
                      `/boards/${boardId}/credit-cards/${creditCard.id}`
                    );
                  },
                };
              }),
              ...(documents ?? []).map((document) => {
                const tags = getTags(document.tags);

                return {
                  title: document.name ?? "",
                  tags,
                  group: "Document",
                  description: document.mime?.split("/")[1].toUpperCase(),
                  onTrigger: () => {
                    navigate(`/boards/${boardId}/documents/${document.id}`);
                  },
                };
              }),
              ...(notes ?? []).map((note) => {
                const tags = getTags(note.tags);

                return {
                  title: note.name ?? "",
                  description: formatDate(note.date, "D MMMM YYYY"),
                  search: note.text,
                  tags,
                  group: "Note",
                  onTrigger: () => {
                    navigate(`/boards/${boardId}/notes/${note.id}`);
                  },
                };
              }),
            ]
          : []
      }
      filter={(query, actions) =>
        actions.filter((action) => {
          return searchString(
            `${action.title}${action.description}${
              action.search
            }${action.tags.map((tag: TagDocument) => tag.name)}`,
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
