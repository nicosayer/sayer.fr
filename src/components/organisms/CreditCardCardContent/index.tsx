import {
  ActionIcon,
  Button,
  ColorSwatch,
  CopyButton,
  Group,
  Menu,
  Stack,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { useClipboard } from "@mantine/hooks";
import { openConfirmModal, openModal } from "@mantine/modals";
import {
  IconCheck,
  IconDotsVertical,
  IconEdit,
  IconLink,
  IconSwitchHorizontal,
  IconTrash,
} from "@tabler/icons-react";
import CreditCardCardholder from "components/organisms/CreditCardCardholder";
import CreditCardExpirationDate from "components/organisms/CreditCardExpirationDate";
import CreditCardNumber from "components/organisms/CreditCardNumber";
import CreditCardSecurityCode from "components/organisms/CreditCardSecurityCode";
import { deleteDoc } from "firebase/firestore";
import { useDecrypt } from "hooks/useCrypto";
import { FC } from "react";
import { useBoard } from "routes/Home/Boards/Board/Provider";
import { CreditCardDocument } from "types/firebase/collections";
import EditCreditCardModal from "./EditCreditCardModal";
import MoveCreditCardModal from "./MoveCreditCardModal";

export interface CreditCardCardContentProps {
  creditCard: CreditCardDocument;
}

const openEditModal = (creditCard: CreditCardDocument) => {
  openModal({
    zIndex: 1000,
    centered: true,
    title: "Modifier la carte de crédit",
    children: <EditCreditCardModal creditCard={creditCard} />,
  });
};

const openMoveModal = (creditCard: CreditCardDocument) => {
  openModal({
    centered: true,
    zIndex: 1000,
    title: "Déplacer la carte de crédit",
    children: <MoveCreditCardModal creditCard={creditCard} />,
  });
};

const openDeleteModal = (creditCard: CreditCardDocument) => {
  openConfirmModal({
    title: "Supprimer la carte de crédit",
    centered: true,
    zIndex: 1000,
    children: (
      <Text size="sm">
        Voulez-vous vraiment supprimer cette carte de crédit ? Cette action est
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
};

const CreditCardCardContent: FC<CreditCardCardContentProps> = ({
  creditCard,
}) => {
  const { value: number, loading: loadingNumber } = useDecrypt(
    creditCard.number
  );
  const { value: securityCode, loading: loadingSecurityCode } = useDecrypt(
    creditCard.securityCode
  );
  const clipboard = useClipboard();
  const { boards } = useBoard();
  const theme = useMantineTheme();

  return (
    <Stack align="center">
      <Group position="center" spacing="xs">
        {creditCard.color && (
          <ColorSwatch color={theme.colors[creditCard.color][6]} />
        )}
        <Text weight={500}>{creditCard.name}</Text>
      </Group>
      <Stack spacing="xs">
        <Group position="center" spacing="xs">
          <Text size="sm">Titulaire :</Text>
          <CreditCardCardholder creditCard={creditCard} />
        </Group>
        <Group position="center" spacing="xs">
          <Text size="sm">Numéro :</Text>
          <CreditCardNumber creditCard={creditCard} />
        </Group>
        <Group position="center" spacing="xs">
          <Text size="sm">Date d'expiration :</Text>
          <CreditCardExpirationDate creditCard={creditCard} />
        </Group>
        <Group position="center" spacing="xs">
          <Text size="sm">Code de sécurité :</Text>
          <CreditCardSecurityCode creditCard={creditCard} />
        </Group>
      </Stack>
      <Group className="w-full">
        <Button
          loading={loadingNumber || loadingSecurityCode}
          variant="light"
          className="flex-1"
          color={clipboard.copied ? "teal" : undefined}
          onClick={() => {
            clipboard.copy(
              number && securityCode
                ? `${creditCard.cardholder} ${number} ${creditCard.expirationMonth}/${creditCard.expirationYear} ${securityCode}`
                : ""
            );
          }}
        >
          {clipboard.copied ? "Informations copiés" : "Copier les informations"}
        </Button>
        <CopyButton
          value={`${window.location.host}/${creditCard.ref?.path.replace(
            "creditCards",
            "credit-cards"
          )}`}
        >
          {({ copied, copy }) => (
            <Menu shadow="md" width={200} withinPortal>
              <Menu.Target>
                <ActionIcon
                  variant="light"
                  radius="md"
                  size={36}
                  color={copied ? "teal" : undefined}
                >
                  {copied ? (
                    <IconCheck size={18} />
                  ) : (
                    <IconDotsVertical size={18} />
                  )}
                </ActionIcon>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item icon={<IconLink size={18} />} onClick={copy}>
                  Copier le lien
                </Menu.Item>
                {(boards?.length ?? 0) > 1 ? (
                  <Menu.Item
                    onClick={() => {
                      openMoveModal(creditCard);
                    }}
                    icon={<IconSwitchHorizontal size={18} />}
                  >
                    Déplacer
                  </Menu.Item>
                ) : undefined}
                <Menu.Item
                  onClick={() => {
                    openEditModal(creditCard);
                  }}
                  icon={<IconEdit size={18} />}
                >
                  Modifier
                </Menu.Item>
                <Menu.Item
                  color="red"
                  onClick={() => {
                    openDeleteModal(creditCard);
                  }}
                  icon={<IconTrash size={18} />}
                >
                  Supprimer
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          )}
        </CopyButton>
      </Group>
    </Stack>
  );
};

export default CreditCardCardContent;
