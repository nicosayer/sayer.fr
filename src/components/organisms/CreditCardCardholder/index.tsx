import { ActionIcon, Code, CopyButton, Group, Tooltip } from "@mantine/core";
import { IconCopy } from "@tabler/icons";
import { FC } from "react";
import { CreditCardDocument } from "types/firebase/collections";

interface CreditCardCardholderProps {
  creditCard: CreditCardDocument;
}

const CreditCardCardholder: FC<CreditCardCardholderProps> = ({
  creditCard,
}) => {
  return (
    <Group spacing="xs">
      <Code>{creditCard.cardholder}</Code>
      <CopyButton value={String(creditCard.cardholder)}>
        {({ copied, copy }) => (
          <Tooltip
            label={
              copied ? "Nom du titulaire copié" : "Copier le nom du titulaire"
            }
            withArrow
          >
            <ActionIcon color={copied ? "teal" : undefined} onClick={copy}>
              <IconCopy size={18} />
            </ActionIcon>
          </Tooltip>
        )}
      </CopyButton>
    </Group>
  );
};

export default CreditCardCardholder;
