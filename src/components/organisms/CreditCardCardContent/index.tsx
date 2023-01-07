import {
  ActionIcon,
  Badge,
  Button,
  ColorSwatch,
  CopyButton,
  Group,
  Stack,
  Text,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { openConfirmModal, openModal } from "@mantine/modals";
import { IconCheck, IconEdit, IconLink, IconTrash } from "@tabler/icons";
import CreditCardCardholder from "components/organisms/CreditCardCardholder";
import CreditCardExpirationDate from "components/organisms/CreditCardExpirationDate";
import CreditCardNumber from "components/organisms/CreditCardNumber";
import CreditCardSecurityCode from "components/organisms/CreditCardSecurityCode";
import { deleteDoc } from "firebase/firestore";
import { FC, useCallback, useMemo } from "react";
import { useBoard } from "routes/Home/Boards/Board/Provider";
import { CreditCardDocument } from "types/firebase/collections";
import { getColorFromString } from "utils/color";
import EditCreditCardModal from "./EditCreditCardModal";

export interface CreditCardCardContentProps {
  creditCard: CreditCardDocument;
}

const CreditCardCardContent: FC<CreditCardCardContentProps> = ({
  creditCard,
}) => {
  const { boards } = useBoard();
  const theme = useMantineTheme();
  const is768Px = useMediaQuery("(min-width: 768px)");

  const board = useMemo(() => {
    return boards?.find(
      (board) => board.id === creditCard.ref?.parent.parent?.id
    );
  }, [boards, creditCard.ref?.parent.parent?.id]);

  const openEditModal = useCallback(
    (creditCard: CreditCardDocument) => {
      if (board) {
        return openModal({
          zIndex: 1000,
          centered: true,
          title: "Modifier la carte de crédit",
          children: (
            <EditCreditCardModal creditCard={creditCard} board={board} />
          ),
        });
      }
    },
    [board]
  );

  const openDeleteModal = useCallback((creditCard: CreditCardDocument) => {
    openConfirmModal({
      title: "Supprimer la carte de crédit",
      centered: true,
      zIndex: 1000,
      children: (
        <Text size="sm">
          Voulez-vous vraiment supprimer la carte de crédit ? Cette action est
          définitive et irréversible.
        </Text>
      ),
      labels: { confirm: "Supprimer", cancel: "Annuler" },
      confirmProps: { color: "red" },
      onConfirm: () => {
        if (creditCard.ref) {
          deleteDoc(creditCard.ref);
        }
      },
    });
  }, []);

  return (
    <Stack>
      <Group position="center" spacing="xs">
        {creditCard.color && (
          <ColorSwatch color={theme.colors[creditCard.color][6]} />
        )}
        <Text fw={600}>{creditCard.name}</Text>
        {creditCard.tag && (
          <Badge
            variant="dot"
            color={getColorFromString(creditCard.tag)}
            className="absolute right-[16px]"
          >
            {creditCard.tag}
          </Badge>
        )}
      </Group>
      <div className="grid gap-2">
        <Group position="center" spacing="xs">
          <div>Titulaire :</div>
          <CreditCardCardholder creditCard={creditCard} />
        </Group>
        <Group position="center" spacing="xs">
          <div>Numéro :</div>
          <CreditCardNumber creditCard={creditCard} />
        </Group>
        <Group position="center" spacing="xs">
          <div>Date d'expiration :</div>
          <CreditCardExpirationDate creditCard={creditCard} />
        </Group>
        <Group position="center" spacing="xs">
          <div>Code de sécurité :</div>
          <CreditCardSecurityCode creditCard={creditCard} />
        </Group>
      </div>
      <div className="grid grid-cols-3">
        <div className="m-auto">
          <CopyButton value={`${window.location.host}/${creditCard.ref?.path}`}>
            {({ copied, copy }) =>
              is768Px ? (
                <Button
                  size="xs"
                  variant="subtle"
                  color={copied ? "teal" : "blue"}
                  onClick={copy}
                  leftIcon={
                    copied ? <IconCheck size={18} /> : <IconLink size={18} />
                  }
                >
                  {copied ? "Lien copié" : "Copier le lien"}
                </Button>
              ) : (
                <Tooltip
                  label={copied ? "Lien copié" : "Copier le lien"}
                  withArrow
                >
                  <ActionIcon
                    className="m-auto"
                    color={copied ? "teal" : "blue"}
                    onClick={copy}
                  >
                    {copied ? <IconCheck size={18} /> : <IconLink size={18} />}
                  </ActionIcon>
                </Tooltip>
              )
            }
          </CopyButton>
        </div>
        <div className="m-auto">
          {is768Px ? (
            <Button
              variant="subtle"
              size="xs"
              onClick={() => {
                openEditModal(creditCard);
              }}
              leftIcon={<IconEdit size={18} />}
            >
              Modifier
            </Button>
          ) : (
            <Tooltip label="Modifier" withArrow>
              <ActionIcon
                color="blue"
                className="m-auto"
                onClick={() => {
                  openEditModal(creditCard);
                }}
              >
                <IconEdit size={18} />
              </ActionIcon>
            </Tooltip>
          )}
        </div>
        <div className="m-auto">
          {is768Px ? (
            <Button
              color="red"
              variant="subtle"
              size="xs"
              onClick={() => {
                openDeleteModal(creditCard);
              }}
              leftIcon={<IconTrash size={18} />}
            >
              Supprimer
            </Button>
          ) : (
            <Tooltip label="Supprimer" withArrow>
              <ActionIcon
                color="red"
                className="m-auto"
                onClick={() => {
                  openDeleteModal(creditCard);
                }}
              >
                <IconTrash size={18} />
              </ActionIcon>
            </Tooltip>
          )}
        </div>
      </div>
    </Stack>
  );
};

export default CreditCardCardContent;
