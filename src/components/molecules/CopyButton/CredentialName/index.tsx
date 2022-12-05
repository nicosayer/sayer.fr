import { ActionIcon, Group, Text, TextProps, Tooltip } from "@mantine/core";
import { IconExternalLink } from "@tabler/icons";
import { FC } from "react";
import { CredentialDocument } from "types/firebase/collections";

interface CredentialNameCopyButtonProps extends TextProps {
  credential: CredentialDocument;
}

const CredentialNameCopyButton: FC<CredentialNameCopyButtonProps> = ({
  credential,
  ...rest
}) => {
  return (
    <Group spacing="xs">
      <Text
        className="max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap"
        {...rest}
      >
        {credential?.name}
      </Text>
      <Tooltip label="Aller sur le site" withArrow>
        <ActionIcon
          component="a"
          target="_blank"
          rel="noopener noreferrer"
          href={
            credential?.url ||
            `https://www.google.com/search?q=${credential.name}`
          }
        >
          <IconExternalLink size={18} />
        </ActionIcon>
      </Tooltip>
    </Group>
  );
};

export default CredentialNameCopyButton;
