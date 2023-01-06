import {
  Button,
  Group,
  LoadingOverlay,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { openModal } from "@mantine/modals";
import { IconPlus, IconSearch } from "@tabler/icons";
import { FC, useState } from "react";
import { useBoard } from "../Provider";
import CreditCard from "./CreditCard";
import CreditCardsCards from "./CreditCardsCards";
import NewCreditCardModal from "./NewCreditCardModal";

const CreditCards: FC = () => {
  const { board, loading, creditCards } = useBoard();
  const [search, setSearch] = useState("");
  const is768Px = useMediaQuery("(min-width: 768px)");

  if (!creditCards || loading) {
    return <LoadingOverlay visible />;
  }

  if (!creditCards?.length) {
    return (
      <div className="flex items-center justify-center h-full">
        <Button
          className="mx-4"
          size="lg"
          leftIcon={<IconPlus size={18} />}
          onClick={() => {
            if (board) {
              openModal({
                centered: true,
                title: "Nouvelle carte de crédit",
                children: <NewCreditCardModal board={board} />,
              });
            }
          }}
        >
          {is768Px
            ? "Ajouter votre première carte de crédit"
            : "Nouvelle carte de crédit"}
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
                if (board) {
                  openModal({
                    centered: true,
                    title: "Nouvelle carte de crédit",
                    children: <NewCreditCardModal board={board} />,
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
