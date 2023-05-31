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
import useBooleanState from "hooks/useBooleanState";
import { FC, useMemo } from "react";
import { ChoreDocument, ChoreUnit } from "types/firebase/collections";
import { formatDate } from "utils/dayjs";
import { updateDoc } from "utils/firebase";
import { cleanString } from "utils/string";

export interface EditChoreModalContentProps {
  chore: ChoreDocument;
}

const EditChoreModalContent: FC<EditChoreModalContentProps> = ({ chore }) => {
  const [loading, start, stop] = useBooleanState();

  const form = useForm({
    initialValues: {
      name: chore.name ?? "",
      date: dayjs(chore.startDate).toDate(),
      frequency: chore.frequency ?? 1,
      unit: chore.unit ?? ChoreUnit.Week,
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

  const frequencyDescription = useMemo(() => {
    const frequency = form.values.frequency === 1 ? "" : form.values.frequency;

    switch (form.values.unit) {
      case ChoreUnit.Day:
        return `La tâche se répétera tous les ${frequency} jours`;
      case ChoreUnit.Week:
        return `La tâche se répétera toutes les ${frequency} semaines`;
      case ChoreUnit.Month:
        return `La tâche se répétera tous les ${frequency} mois`;
    }
  }, [form.values.frequency, form.values.unit]);

  return (
    <form
      onSubmit={form.onSubmit((values) => {
        if (chore?.ref) {
          start();
          updateDoc<ChoreDocument>(chore.ref, {
            name: values.name,
            startDate: values.date,
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
          disabled={loading}
          withAsterisk
          label="Description de la tâche"
          placeholder="Passeport"
          {...form.getInputProps("name")}
        />
        <DatePickerInput
          popoverProps={{ withinPortal: true }}
          withAsterisk
          disabled={loading}
          label="Date de début"
          {...form.getInputProps("date")}
        />
        <Input.Wrapper
          label="Fréquence"
          description={frequencyDescription}
          withAsterisk
        >
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
              Modifier
            </Button>
          </Group>
        </div>
      </Stack>
    </form>
  );
};

export default EditChoreModalContent;
