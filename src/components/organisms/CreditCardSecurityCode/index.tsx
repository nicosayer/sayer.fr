import { ActionIcon, Code, CopyButton, Group, Tooltip } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconCheck, IconCopy, IconEye, IconEyeOff } from "@tabler/icons";
import { FC } from "react";
import { CreditCardDocument } from "types/firebase/collections";
import { ONE_SECOND } from "utils/time";

interface CreditCardSecurityCodeProps {
  creditCard: CreditCardDocument;
}

const CreditCardSecurityCode: FC<CreditCardSecurityCodeProps> = ({
  creditCard,
}) => {
  const [visible, setVisible] = useDisclosure(false, {
    onOpen: () => {
      setTimeout(() => {
        if (visible) {
          setVisible.close();
        }
      }, 10 * ONE_SECOND);
    },
  });

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
        <ActionIcon onClick={setVisible.toggle}>
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
