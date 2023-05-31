import {
  Button,
  Card,
  Group,
  Indicator,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { Calendar } from "@mantine/dates";
import { useMediaQuery } from "@mantine/hooks";
import { openModal } from "@mantine/modals";
import { IconPlus, IconSearch } from "@tabler/icons-react";
import LoadingOverlay from "components/atoms/LoadingOverlay";
import dayjs from "dayjs";
import { FC, useMemo, useState } from "react";
import ChoresList from "routes/Home/Boards/Board/Chores/ChoresList";
import NewChoreModalContent from "routes/Home/Boards/Board/Chores/NewChoreModalContent";
import { useBoard } from "routes/Home/Boards/Board/Provider";
import { ChoreUnit } from "types/firebase/collections";
import { formatDate } from "utils/dayjs";

const openNewModal = () => {
  openModal({
    centered: true,
    title: "Nouvelle tâche",
    children: <NewChoreModalContent defaultDate={formatDate()} />,
  });
};

const Chores: FC = () => {
  const { loadingChores, chores } = useBoard();
  const [search, setSearch] = useState("");
  const is768Px = useMediaQuery("(min-width: 768px)", true);

  const choresWithDates = useMemo(() => {
    return (chores ?? []).map((chore) => {
      let startDate = formatDate(chore.startDate);
      let previousDate: string | undefined = undefined;
      let nextDate: string | undefined = undefined;
      const lastDoneDate = chore.lastDoneDate ?? "2001-01-01";

      do {
        const dayjsUnit =
          chore.unit === ChoreUnit.Day
            ? "day"
            : chore.unit === ChoreUnit.Week
            ? "week"
            : "month";

        const newStartDate = formatDate(
          dayjs(startDate).add(chore.frequency ?? 1, dayjsUnit)
        );

        if (newStartDate > formatDate()) {
          previousDate = startDate;
          nextDate = newStartDate;
        } else {
          startDate = newStartDate;
        }
      } while (!previousDate || !nextDate);

      return {
        ...chore,
        lastDoneDate,
        previousDate,
        nextDate,
        nextDoneDate: lastDoneDate < previousDate ? previousDate : nextDate,
      };
    });
  }, [chores]);

  if (!chores || loadingChores) {
    return <LoadingOverlay visible />;
  }

  if (!chores?.length) {
    return (
      <div className="flex items-center justify-center h-full">
        <Button
          size="lg"
          leftIcon={<IconPlus size={18} />}
          onClick={openNewModal}
        >
          {is768Px ? "Ajouter votre première tâche" : "Nouvelle tâche"}
        </Button>
      </div>
    );
  }

  return (
    <>
      <Stack>
        <Group position="apart">
          <Group spacing="xs">
            <Text weight={500}>Tâches</Text>
            <Text c="dimmed">({chores.length})</Text>
          </Group>
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
              onClick={openNewModal}
            >
              Nouvelle tâche
            </Button>
          </Group>
        </Group>
        <Card className="m-auto w-fit" withBorder>
          <Calendar
            level="month"
            getDayProps={(day) => {
              const formattedDay = formatDate(day);

              return {
                selected: formatDate() === formattedDay,
              };
            }}
            renderDay={(day) => {
              const today = formatDate();
              const formattedDate = formatDate(day);
              const dayDate = day.getDate();

              const color = formattedDate > today ? "blue" : "red";

              const showIndicator = choresWithDates.some((choreDates) => {
                return choreDates.nextDoneDate === formattedDate;
              });

              return (
                <Indicator
                  size={6}
                  color={color}
                  offset={-2}
                  disabled={!showIndicator}
                >
                  <div>{dayDate}</div>
                </Indicator>
              );
            }}
          />
        </Card>
        <ChoresList search={search} choresWithDates={choresWithDates} />
      </Stack>
    </>
  );
};

export default Chores;
