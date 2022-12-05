import { ActionIcon, Code, CopyButton, Group, Tooltip } from "@mantine/core";
import { IconCopy, IconEye, IconEyeOff } from "@tabler/icons";
import useBooleanState from "hooks/useBooleanState";
import { FC } from "react";
import { CreditCardDocument } from "types/firebase/collections";

interface CreditCardSecurityCodeProps {
  creditCard: CreditCardDocument;
}

const CreditCardSecurityCode: FC<CreditCardSecurityCodeProps> = ({
  creditCard,
}) => {
  const [visible, , , toggle] = useBooleanState();

  return (
    <Group spacing="xs">
      <Code>{visible ? creditCard.securityCode : "•••"}</Code>
      <Tooltip
        label={
          visible ? "Cacher le code de sécurité" : "Voir le code de sécurité"
        }
        withArrow
      >
        <ActionIcon onClick={toggle}>
          {visible ? <IconEyeOff size={18} /> : <IconEye size={18} />}
        </ActionIcon>
      </Tooltip>
      <CopyButton value={String(creditCard?.securityCode)}>
        {({ copied, copy }) => (
          <Tooltip
            label={
              copied ? "Code de sécurité copié" : "Copier le code de sécurité"
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

export default CreditCardSecurityCode;
