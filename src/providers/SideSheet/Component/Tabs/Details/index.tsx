import {
  Button,
  Card,
  FormField,
  Pane,
  SelectField,
  TextInputField,
} from "evergreen-ui";
import React, { ChangeEvent, useState } from "react";

import { DateSelect } from "components/DateSelect";
import { db } from "config/firebase";
import { useAuth } from "providers/Auth";
import { cleanName } from "utils/relative";

export const Details = ({ relative }: { relative: Record<string, any> }) => {
  const data = relative.data();
  const { isAuth } = useAuth();

  const [firstName, setFirstName] = useState<string>(data.firstName);
  const [lastName, setLastName] = useState<string>(data.lastName);
  const [gender, setGender] = useState<number>(data.gender);
  const [birthDay, setBirthDay] = useState<number | null>(
    data.birthDate?.day ?? null
  );
  const [birthMonth, setBirthMonth] = useState<number | null>(
    data.birthDate?.month ?? null
  );
  const [birthYear, setBirthYear] = useState<number | null>(
    data.birthDate?.year ?? null
  );
  const [deathDay, setDeathDay] = useState<number | null>(
    data.deathDate?.day ?? null
  );
  const [deathMonth, setDeathMonth] = useState<number | null>(
    data.deathDate?.month ?? null
  );
  const [deathYear, setDeathYear] = useState<number | null>(
    data.deathDate?.year ?? null
  );

  return (
    <Pane background="tint1" padding={16}>
      <Card backgroundColor="white" elevation={0} padding={16}>
        <TextInputField
          disabled={!isAuth}
          label="First name"
          placeholder="John"
          value={firstName}
          onChange={(event: ChangeEvent) => {
            // @ts-ignore
            setFirstName(event.target.value);
          }}
        />
        <TextInputField
          disabled={!isAuth}
          label="Last name"
          placeholder="Doe"
          value={lastName}
          onChange={(event: ChangeEvent) => {
            // @ts-ignore
            setLastName(event.target.value);
          }}
        />
        <SelectField
          disabled={!isAuth}
          label="Gender"
          value={gender}
          onChange={(event: ChangeEvent) => {
            // @ts-ignore
            setGender(event.target.value);
          }}
        >
          <option value={0}>Male</option>
          <option value={1}>Female</option>
        </SelectField>
        <FormField label="Date of birth" marginBottom={24}>
          <DateSelect
            disabled={!isAuth}
            day={birthDay}
            month={birthMonth}
            year={birthYear}
            setDay={setBirthDay}
            setMonth={setBirthMonth}
            setYear={setBirthYear}
          />
        </FormField>
        <FormField label="Date of death">
          <DateSelect
            disabled={!isAuth}
            day={deathDay}
            month={deathMonth}
            year={deathYear}
            setDay={setDeathDay}
            setMonth={setDeathMonth}
            setYear={setDeathYear}
          />
        </FormField>
        {isAuth && (
          <Button
            appearance="primary"
            display="flex"
            marginLeft="auto"
            onClick={() => {
              db.collection("relatives")
                .doc(relative.id)
                .set(
                  {
                    firstName: cleanName(firstName),
                    lastName,
                    gender: gender,
                    birthDate: {
                      day: birthDay,
                      month: birthMonth,
                      year: birthYear,
                    },
                    deathDate: {
                      day: deathDay,
                      month: deathMonth,
                      year: deathYear,
                    },
                  },
                  { merge: true }
                );
            }}
          >
            Save
          </Button>
        )}
      </Card>
    </Pane>
  );
};
