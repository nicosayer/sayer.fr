import { Card } from "@mantine/core";
import CredentialCardContent from "components/organisms/CredentialCardContent";
import { FC } from "react";
import { CredentialDocument } from "types/firebase/collections";

export interface CredentialCardProps {
  credential: CredentialDocument;
}

const CredentialCard: FC<CredentialCardProps> = ({ credential }) => {
  return (
    <Card withBorder>
      <CredentialCardContent credential={credential} />
    </Card>
  );
};

export default CredentialCard;
