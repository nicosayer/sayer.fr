import { ActionIcon, Code, Group, Tooltip } from "@mantine/core";
import { useClipboard, useDisclosure } from "@mantine/hooks";
import { IconCheck, IconCopy, IconEye, IconEyeOff } from "@tabler/icons-react";
import { useDecrypt } from "providers/Crypto/hooks";
import { FC } from "react";
import { CreditCardDocument } from "types/firebase/collections";

interface CreditCardSecurityCodeProps {
  creditCard: CreditCardDocument;
}

const CreditCardSecurityCodeCopyButton: FC<CreditCardSecurityCodeProps> = ({
  creditCard,
}) => {
  const { value, loading } = useDecrypt(creditCard.securityCode);
  const clipboard = useClipboard();

  return (
    <Tooltip
      disabled={loading}
      label={
        clipboard.copied
          ? "Code de sécurité copié"
          : "Copier le code de sécurité"
      }
      withArrow
    >
      <ActionIcon
        loading={loading}
        color={clipboard.copied && !loading ? "teal" : undefined}
        onClick={() => {
          clipboard.copy(value ?? "");
        }}
      >
        {clipboard.copied ? <IconCheck size={18} /> : <IconCopy size={18} />}
      </ActionIcon>
    </Tooltip>
  );
};

const CreditCardSecurityCode: FC<CreditCardSecurityCodeProps> = ({
  creditCard,
}) => {
  const { value, loading } = useDecrypt(creditCard.securityCode);
  const [visible, setVisible] = useDisclosure(false);

  return (
    <Group spacing="xs">
      <Code className="max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap">
        {visible && value ? value : "•••"}
      </Code>
      <Tooltip
        disabled={loading}
        label={
          visible ? "Cacher le code de sécurité" : "Voir le code de sécurité"
        }
        withArrow
      >
        <ActionIcon loading={loading} onClick={setVisible.toggle}>
          {visible ? <IconEyeOff size={18} /> : <IconEye size={18} />}
        </ActionIcon>
      </Tooltip>
      <CreditCardSecurityCodeCopyButton creditCard={creditCard} />
    </Group>
  );
};

export default CreditCardSecurityCode;
