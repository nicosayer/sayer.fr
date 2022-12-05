import {
  ColorSwatch,
  Drawer,
  Group,
  Input,
  Stack,
  useMantineTheme,
} from "@mantine/core";
import CreditCardCardholder from "components/organisms/CreditCardCardholder";
import CreditCardExpirationDate from "components/organisms/CreditCardExpirationDate";
import CreditCardNumber from "components/organisms/CreditCardNumber";
import CreditCardSecurityCode from "components/organisms/CreditCardSecurityCode";
import { FC, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
    <Drawer
      opened={Boolean(creditCardId)}
      onClose={() => navigate(`/boards/${board?.id}/credit-cards`)}
      title="Carte de crédit"
      padding="xl"
      position="right"
    >
      <Stack spacing="xl">
        <Input.Wrapper label="Nom de la carte">
          <Group className="m-auto" spacing="xs">
            {creditCard.color && (
              <ColorSwatch color={theme.colors[creditCard.color][6]} />
            )}
            {creditCard.name}
          </Group>
        </Input.Wrapper>
        <Input.Wrapper label="Titulaire">
          <div>
            <CreditCardCardholder creditCard={creditCard} />
          </div>
        </Input.Wrapper>
        <Input.Wrapper label="Numéro">
          <div>
            <CreditCardNumber creditCard={creditCard} />
          </div>
        </Input.Wrapper>
        <Input.Wrapper label="Date d'expiration">
          <div>
            <CreditCardExpirationDate creditCard={creditCard} />
          </div>
        </Input.Wrapper>
        <Input.Wrapper label="Code de sécurité">
          <div>
            <CreditCardSecurityCode creditCard={creditCard} />
          </div>
        </Input.Wrapper>
      </Stack>
    </Drawer>
  );
};

export default CreditCard;
