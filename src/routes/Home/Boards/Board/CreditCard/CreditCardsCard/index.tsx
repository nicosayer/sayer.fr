import {
  ActionIcon,
  Button,
  Card,
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
import { sortBy } from "lodash";
import { FC, useCallback, useMemo } from "react";
import { useBoard } from "routes/Home/Boards/Board/Provider";
import { CreditCardDocument } from "types/firebase/collections";
import { sanitize } from "utils/string";
import EditCreditCardModal from "./EditCreditCardModal";

export interface CreditCardsCardsProps {
  search: string;
}

const CreditCardsCards: FC<CreditCardsCardsProps> = ({ search }) => {
  const { board, creditCards } = useBoard();
  const theme = useMantineTheme();
  const is768Px = useMediaQuery("(min-width: 768px)");

  const filteredCreditCards = useMemo(() => {
    return sortBy(
      (creditCards ?? []).filter((creditCard) => {
        return sanitize(String(creditCard.name)).indexOf(sanitize(search)) > -1;
      }),
      (creditCard) => sanitize(creditCard.name ?? "")
    );
  }, [creditCards, search]);

  const openEditModal = useCallback((creditCard: CreditCardDocument) => {
    return openModal({
      centered: true,
      title: "Modifier la carte de crédit",
      children: <EditCreditCardModal creditCard={creditCard} />,
    });
  }, []);

  const openDeleteModal = useCallback((creditCard: CreditCardDocument) => {
    openConfirmModal({
      title: "Supprimer la carte de crédit",
      centered: true,
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
      {filteredCreditCards.map((creditCard) => {
        return (
          <Card key={creditCard.id} withBorder>
            <Stack>
              <Group className="m-auto" spacing="xs">
                {creditCard.color && (
                  <ColorSwatch color={theme.colors[creditCard.color][6]} />
                )}
                <Text fw={600}>{creditCard.name}</Text>
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
              <Group grow>
                <CopyButton
                  value={`${process.env.REACT_APP_URL}/boards/${board?.id}/credit-cards/${creditCard.id}`}
                >
                  {({ copied, copy }) =>
                    is768Px ? (
                      <Button
                        fullWidth
                        variant="subtle"
                        color={copied ? "teal" : "blue"}
                        onClick={copy}
                        leftIcon={
                          copied ? (
                            <IconCheck size={18} />
                          ) : (
                            <IconLink size={18} />
                          )
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
                          color={copied ? "teal" : "blue"}
                          onClick={copy}
                        >
                          {copied ? (
                            <IconCheck size={18} />
                          ) : (
                            <IconLink size={18} />
                          )}
                        </ActionIcon>
                      </Tooltip>
                    )
                  }
                </CopyButton>
                {is768Px ? (
                  <Button
                    variant="subtle"
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
                      onClick={() => {
                        openEditModal(creditCard);
                      }}
                    >
                      <IconEdit size={18} />
                    </ActionIcon>
                  </Tooltip>
                )}
                {is768Px ? (
                  <Button
                    color="red"
                    variant="subtle"
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
                      onClick={() => {
                        openDeleteModal(creditCard);
                      }}
                    >
                      <IconTrash size={18} />
                    </ActionIcon>
                  </Tooltip>
                )}
              </Group>
            </Stack>
          </Card>
        );
      })}
    </Stack>
  );
};

export default CreditCardsCards;
