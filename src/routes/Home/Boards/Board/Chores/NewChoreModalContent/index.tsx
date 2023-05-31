import {
  Button,
  Group,
  Input,
  NumberInput,
  Select,
  Stack,
  TextInput,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { closeAllModals } from "@mantine/modals";
import dayjs from "dayjs";
import { collection } from "firebase/firestore";
import useBooleanState from "hooks/useBooleanState";
import { FC, useRef } from "react";
import { useBoard } from "routes/Home/Boards/Board/Provider";
import {
  Collection,
  ChoreDocument,
  ChoreUnit,
} from "types/firebase/collections";
import { formatDate } from "utils/dayjs";
import { addDoc } from "utils/firebase";
import { cleanString } from "utils/string";

export interface NewChoreModalContentProps {
  defaultDate: string;
}

const NewChoreModalContent: FC<NewChoreModalContentProps> = ({
  defaultDate,
}) => {
  const { board } = useBoard();
  const [loading, start, stop] = useBooleanState();
  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm({
    initialValues: {
      name: "",
      date: dayjs(defaultDate).toDate(),
      frequency: 1,
      unit: ChoreUnit.Week,
    },

    validate: {
      name: (name) => {
        return name.length > 0 ? null : "Ce champ ne doit pas être vide";
      },
      date: (date) => {
        return date && dayjs(date).isValid()
          ? null
          : "Ce champ ne doit pas être vide";
      },
      frequency: (frequency) => {
        return frequency > 0 && frequency < 13
          ? null
          : "Ce champ ne doit pas être vide";
      },
      unit: (unit) => {
        return Object.values(ChoreUnit).includes(unit)
          ? null
          : "Ce champ ne doit pas être vide";
      },
    },

    transformValues: (values) => {
      return {
        name: cleanString(values.name),
        date: formatDate(values.date),
        frequency: values.frequency,
        unit: values.unit,
      };
    },
  });

  return (
    <form
      ref={formRef}
      onSubmit={form.onSubmit(async (values) => {
        if (board?.id && board.ref) {
          start();

          addDoc<ChoreDocument>(collection(board.ref, Collection.chores), {
            name: values.name,
            startDate: values.date,
            lastDoneDate: formatDate(dayjs(values.date).subtract(1, "day")),
            frequency: values.frequency,
            unit: values.unit,
          })
            .then(() => closeAllModals())
            .finally(stop);
        }
      })}
    >
      <Stack>
        <TextInput
          data-autofocus
          autoFocus
          withAsterisk
          disabled={loading}
          label="Description de la tâche"
          placeholder="Repassage"
          {...form.getInputProps("name")}
        />
        <DatePickerInput
          popoverProps={{ withinPortal: true }}
          withAsterisk
          disabled={loading}
          label="Date de début"
          {...form.getInputProps("date")}
        />
        <Input.Wrapper label="Fréquence" withAsterisk>
          <Group noWrap>
            <Group spacing="xs" noWrap>
              <NumberInput
                max={12}
                min={1}
                {...form.getInputProps("frequency")}
              />
            </Group>
            <Select
              data={Object.values(ChoreUnit).map((value) => {
                const label =
                  value === ChoreUnit.Day
                    ? "Jour"
                    : value === ChoreUnit.Week
                    ? "Semaine"
                    : "Mois";

                return {
                  label,
                  value,
                };
              })}
              {...form.getInputProps("unit")}
            />
          </Group>
        </Input.Wrapper>
        <div className="flex ml-auto">
          <Group>
            <Button
              variant="default"
              disabled={loading}
              onClick={() => {
                closeAllModals();
              }}
            >
              Annuler
            </Button>
            <Button type="submit" loading={loading}>
              Ajouter
            </Button>
          </Group>
        </div>
      </Stack>
    </form>
  );
};

export default NewChoreModalContent;
