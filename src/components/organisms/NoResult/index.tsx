import { Text } from "@mantine/core";
import { IconSearch } from "@tabler/icons";
import { FC } from "react";

const NoResult: FC = () => {
  return (
    <div className="mt-10 text-center">
      <IconSearch size={36} className="text-gray-500" />
      <Text c="dimmed">Aucun résultat</Text>
    </div>
  );
};

export default NoResult;
