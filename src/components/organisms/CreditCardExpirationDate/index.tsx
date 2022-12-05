import { ActionIcon, Code, CopyButton, Group, Tooltip } from "@mantine/core";
import { IconCheck, IconCopy } from "@tabler/icons";
import { FC, useMemo } from "react";
import { CreditCardDocument } from "types/firebase/collections";

interface CreditCardExpirationDateProps {
  creditCard: CreditCardDocument;
}

const CreditCardExpirationDate: FC<CreditCardExpirationDateProps> = ({
  creditCard,
}) => {
  const expirationDate = useMemo(() => {
    return `${creditCard.expirationMonth}/${creditCard.expirationYear}`;
  }, [creditCard.expirationMonth, creditCard.expirationYear]);

  return (
    <Group spacing="xs">
      <Code>{expirationDate}</Code>
      <CopyButton value={String(expirationDate)}>
        {({ copied, copy }) => (
          <Tooltip
            label={
              copied ? "Date d'expiration copié" : "Copier la date d'expiration"
            }
            withArrow
          >
            <ActionIcon color={copied ? "teal" : undefined} onClick={copy}>
            {copied ? <IconCheck size={18} /> : <IconCopy size={18} />}
            </ActionIcon>
          </Tooltip>
        )}
      </CopyButton>
    </Group>
  );
};

export default CreditCardExpirationDate;
