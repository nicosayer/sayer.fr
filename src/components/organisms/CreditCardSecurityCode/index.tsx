import { ActionIcon, Code, CopyButton, Group, Tooltip } from "@mantine/core";
import { IconCheck, IconCopy, IconEye, IconEyeOff } from "@tabler/icons";
import useBooleanState from "hooks/useBooleanState";
import { FC, useEffect } from "react";
import { CreditCardDocument } from "types/firebase/collections";
import { ONE_SECOND } from "utils/time";

interface CreditCardSecurityCodeProps {
  creditCard: CreditCardDocument;
}

const CreditCardSecurityCode: FC<CreditCardSecurityCodeProps> = ({
  creditCard,
}) => {
  const [visible, , off, toggle] = useBooleanState();

  useEffect(() => {
    if (visible) {
      setTimeout(() => {
        if (visible) {
          off()
        }
      }, 10 * ONE_SECOND);
    }
  }, [visible, off])

  return (
    <Group spacing="xs">
      <Code className="max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap">
        {visible
          ? creditCard.securityCode
          : Array(creditCard.securityCode?.length).fill("•").join("")}
      </Code>
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
              {copied ? <IconCheck size={18} /> : <IconCopy size={18} />}
            </ActionIcon>
          </Tooltip>
        )}
      </CopyButton>
    </Group>
  );
};

export default CreditCardSecurityCode;
