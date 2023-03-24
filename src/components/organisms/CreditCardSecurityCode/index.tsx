import { ActionIcon, Code, Group, Tooltip } from "@mantine/core";
import { useClipboard, useDisclosure } from "@mantine/hooks";
import { IconCheck, IconCopy, IconEye, IconEyeOff, IconX } from "@tabler/icons";
import { useDecrypt } from "hooks/useCrypto";
import { FC, useEffect, useState } from "react";
import { CreditCardDocument } from "types/firebase/collections";

interface CreditCardSecurityCodeProps {
  creditCard: CreditCardDocument;
}

const CreditCardSecurityCodeCopyButton: FC<CreditCardSecurityCodeProps> = ({
  creditCard,
}) => {
  const { decrypt, loading, error } = useDecrypt();
  const clipboard = useClipboard();

  return (
    <Tooltip
      disabled={(loading)}
      label={
        clipboard.copied
          ? (error ? 'Erreur' : "Code de sécurité copié")
          : "Copier le code de sécurité"
      }
      withArrow
    >
      <ActionIcon
        loading={loading}
        color={
          clipboard.copied && !loading ? (error ? "red" : "teal") : undefined
        }
        onClick={async () => {
          const securityCode = await decrypt(creditCard.securityCode)

          clipboard.copy(securityCode?.data ?? "");
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

const CreditCardSecurityCode: FC<CreditCardSecurityCodeProps> = ({
  creditCard,
}) => {
  const { decrypt, loading, error } = useDecrypt();
  const [securityCode, setSecurityCode] = useState<string>();

  const [visible, setVisible] = useDisclosure(false, {
    onOpen: () => {
      if (!securityCode) {
        decrypt(creditCard.securityCode).then((securityCode) => {
          setSecurityCode(securityCode?.data);
        });
      }
    },
  });

  useEffect(() => {
    if (error) {
      setVisible.close()
    }
  }, [error, setVisible])

  return (
    <Group spacing="xs">
      <Code className="max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap">
        {visible && securityCode ? securityCode : "•••"}
      </Code>
      <Tooltip
        disabled={loading}
        label={
          visible ? "Cacher le code de sécurité" : "Voir le code de sécurité"
        }
        withArrow
      >
        <ActionIcon
          loading={loading}
          onClick={setVisible.toggle}
        >
          {visible ? <IconEyeOff size={18} /> : <IconEye size={18} />}
        </ActionIcon>
      </Tooltip>
      <CreditCardSecurityCodeCopyButton creditCard={creditCard} />
    </Group>
  );
};

export default CreditCardSecurityCode;
