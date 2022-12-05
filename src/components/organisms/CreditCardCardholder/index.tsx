import { ActionIcon, Code, CopyButton, Group, Tooltip } from "@mantine/core";
import { IconCheck, IconCopy } from "@tabler/icons";
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
      <Code className="max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap">
        {creditCard.cardholder}
      </Code>
      <CopyButton value={String(creditCard.cardholder)}>
        {({ copied, copy }) => (
          <Tooltip
            label={
              copied ? "Nom du titulaire copié" : "Copier le nom du titulaire"
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

export default CreditCardCardholder;
