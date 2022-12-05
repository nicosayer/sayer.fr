import { ActionIcon, Code, CopyButton, Group, Tooltip } from "@mantine/core";
import { IconCheck, IconCopy, IconEye, IconEyeOff } from "@tabler/icons";
import useBooleanState from "hooks/useBooleanState";
import { FC } from "react";
import { CreditCardDocument } from "types/firebase/collections";

interface CreditCardNumberProps {
  creditCard: CreditCardDocument;
}

const CreditCardNumber: FC<CreditCardNumberProps> = ({ creditCard }) => {
  const [visible, , , toggle] = useBooleanState();

  return (
    <Group spacing="xs">
      <Code className="max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap">
        {visible ? (
          creditCard.number?.match(/.{1,4}/g)?.join(" ")
        ) : (
          <>
            •••• •••• ••••{" "}
            {creditCard.number?.substring(creditCard.number.length - 4)}
          </>
        )}
      </Code>
      <Tooltip
        label={visible ? "Cacher le numéro" : "Voir le numéro"}
        withArrow
      >
        <ActionIcon onClick={toggle}>
          {visible ? <IconEyeOff size={18} /> : <IconEye size={18} />}
        </ActionIcon>
      </Tooltip>
      <CopyButton value={String(creditCard?.number)}>
        {({ copied, copy }) => (
          <Tooltip
            label={copied ? "Numéro copié" : "Copier le numéro"}
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

export default CreditCardNumber;
