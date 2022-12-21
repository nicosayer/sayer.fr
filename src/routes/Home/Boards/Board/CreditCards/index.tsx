import {
  Button,
  Group,
  LoadingOverlay,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { openModal } from "@mantine/modals";
import { IconPlus, IconSearch } from "@tabler/icons";
import { FC, useState } from "react";
import { useBoard } from "../Provider";
import CreditCard from "./CreditCard";
import CreditCardsCards from "./CreditCardsCards";
import NewCreditCardModal from "./NewCreditCardModal";

const CreditCards: FC = () => {
  const { boards, loading, creditCards } = useBoard();
  const [search, setSearch] = useState("");

  if (!creditCards || loading) {
    return <LoadingOverlay visible />;
  }

  if (!creditCards?.length) {
    return (
      <div className="flex items-center justify-center h-full">
        <Button
          size="lg"
          leftIcon={<IconPlus size={18} />}
          onClick={() => {
            if (boards) {
              openModal({
                centered: true,
                title: "Nouvelle carte de crédit",
                children: <NewCreditCardModal boards={boards} />,
              });
            }
          }}
        >
          Ajouter votre première carte de crédit
        </Button>
      </div>
    );
  }

  return (
    <>
      <CreditCard />
      <Stack>
        <Group position="apart">
          <Text fw={500}>Cartes de crédit</Text>
          <Group>
            <TextInput
              placeholder="Rechercher"
              variant="filled"
              icon={<IconSearch size={18} />}
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
              }}
            />
            <Button
              variant="default"
              leftIcon={<IconPlus size={18} />}
              onClick={() => {
                if (boards) {
                  openModal({
                    centered: true,
                    title: "Nouvelle carte de crédit",
                    children: <NewCreditCardModal boards={boards} />,
                  });
                }
              }}
            >
              Nouvelle carte de crédit
            </Button>
          </Group>
        </Group>
        <CreditCardsCards search={search} />
      </Stack>
    </>
  );
};

export default CreditCards;
