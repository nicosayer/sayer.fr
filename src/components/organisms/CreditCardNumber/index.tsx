import { ActionIcon, Code, Group, Tooltip } from "@mantine/core";
import { useClipboard, useDisclosure } from "@mantine/hooks";
import {
  IconCheck,
  IconCopy,
  IconEye,
  IconEyeOff,
  IconX,
} from "@tabler/icons-react";
import { useDecrypt } from "hooks/useCrypto";
import { FC, useEffect, useState } from "react";
import { CreditCardDocument } from "types/firebase/collections";

interface CreditCardNumberProps {
  creditCard: CreditCardDocument;
}

const CreditCardNumberCopyButton: FC<CreditCardNumberProps> = ({
  creditCard,
}) => {
  const { decrypt, loading, error } = useDecrypt();
  const clipboard = useClipboard();

  return (
    <Tooltip
      disabled={loading}
      label={
        clipboard.copied
          ? error
            ? "Erreur"
            : "Numéro copié"
          : "Copier le numéro"
      }
      withArrow
    >
      <ActionIcon
        loading={loading}
        color={
          clipboard.copied && !loading ? (error ? "red" : "teal") : undefined
        }
        onClick={async () => {
          const number = await decrypt(creditCard.number);

          clipboard.copy(number?.data ?? "");
        }}
      >
        {clipboard.copied ? (
          error ? (
            <IconX size={18} />
          ) : (
            <IconCheck size={18} />
          )
        ) : (
          <IconCopy size={18} />
        )}
      </ActionIcon>
    </Tooltip>
  );
};

const CreditCardNumber: FC<CreditCardNumberProps> = ({ creditCard }) => {
  const { decrypt, loading, error } = useDecrypt();
  const [number, setNumber] = useState<string>();

  const [visible, setVisible] = useDisclosure(false, {
    onOpen: () => {
      if (!number) {
        decrypt(creditCard.number).then((number) => {
          setNumber(number?.data);
        });
      }
    },
  });

  useEffect(() => {
    if (error) {
      setVisible.close();
    }
  }, [error, setVisible]);

  return (
    <Group spacing="xs">
      <Code className="max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap">
        {visible && number ? (
          number?.match(/.{1,4}/g)?.join(" ")
        ) : (
          <>•••• •••• •••• {creditCard.lastDigits}</>
        )}
      </Code>
      <Tooltip
        label={visible ? "Cacher le numéro" : "Voir le numéro"}
        withArrow
        disabled={loading}
      >
        <ActionIcon loading={loading} onClick={setVisible.toggle}>
          {visible ? <IconEyeOff size={18} /> : <IconEye size={18} />}
        </ActionIcon>
      </Tooltip>
      <CreditCardNumberCopyButton creditCard={creditCard} />
    </Group>
  );
};

export default CreditCardNumber;
