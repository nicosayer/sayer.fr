import {
  Badge,
  ColorSwatch,
  Group,
  Modal,
  Stack,
  Text,
  useMantineTheme,
} from "@mantine/core";
import CreditCardCardholder from "components/organisms/CreditCardCardholder";
import CreditCardExpirationDate from "components/organisms/CreditCardExpirationDate";
import CreditCardNumber from "components/organisms/CreditCardNumber";
import CreditCardSecurityCode from "components/organisms/CreditCardSecurityCode";
import { FC, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getColorFromString } from "utils/color";
import { useBoard } from "../../Provider";

const CreditCard: FC = () => {
  const { board, creditCards } = useBoard();
  const { creditCardId } = useParams();
  const navigate = useNavigate();
  const theme = useMantineTheme();

  const creditCard = useMemo(() => {
    return creditCards?.find((creditCard) => creditCard.id === creditCardId);
  }, [creditCardId, creditCards]);

  if (!creditCard) {
    return null;
  }

  return (
    <Modal
      opened={Boolean(creditCardId)}
      onClose={() => navigate(`/boards/${board?.id}/credit-cards`)}
      withCloseButton={false}
      centered
    >
      <Stack>
        <Group className="m-auto" spacing="xs">
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
      </Stack>
    </Modal>
  );
};

export default CreditCard;
