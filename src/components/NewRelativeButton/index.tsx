import {
  Button,
  ButtonProps,
  Dialog,
  FormField,
  SelectField,
  TextInputField,
} from "evergreen-ui";
import React, { ChangeEvent, useState } from "react";

import { DateSelect } from "components/DateSelect";
import { db, DocumentData } from "config/firebase";
import { GenderType } from "config/relative";
import { useOneTimeRelatives } from "providers/OneTimeRelatives";
import { isSet } from "utils/general";
import { cleanName } from "utils/relative";

export const NewRelativeButton = ({
  onCompleted = () => {},
  ...rest
}: ButtonProps & { onCompleted?: (doc: DocumentData) => void }) => {
  const { updateRelatives } = useOneTimeRelatives();
  const [isShown, setIsShown] = useState(false);
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [gender, setGender] = useState<number>(GenderType.male);
  const [birthDay, setBirthDay] = useState<number | null>(null);
  const [birthMonth, setBirthMonth] = useState<number | null>(null);
  const [birthYear, setBirthYear] = useState<number | null>(null);
  const [deathDay, setDeathDay] = useState<number | null>(null);
  const [deathMonth, setDeathMonth] = useState<number | null>(null);
  const [deathYear, setDeathYear] = useState<number | null>(null);

  return (
    <>
      <Button
        onClick={() => {
          setIsShown(true);
        }}
        {...rest}
      />
      <Dialog
        isShown={isShown}
        title="New relative"
        onCloseComplete={() => {
          setIsShown(false);
          setFirstName("");
          setLastName("");
          setGender(GenderType.male);
          setBirthDay(null);
          setBirthMonth(null);
          setBirthYear(null);
          setDeathDay(null);
          setDeathMonth(null);
          setDeathYear(null);
        }}
        confirmLabel="Add"
        onConfirm={() => {
          const cleanedFirstName = cleanName(firstName);

          if (cleanedFirstName && lastName && isSet(gender)) {
            db.collection("relatives")
              .add({
                firstName: cleanedFirstName,
                lastName: lastName,
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
              })
              .then((doc) => {
                updateRelatives();
                onCompleted(doc);
              });
          }

          setIsShown(false);
        }}
      >
        <TextInputField
          autoFocus
          label="First name"
          placeholder="John"
          value={firstName}
          onChange={(event: ChangeEvent) => {
            // @ts-ignore
            setFirstName(event.target.value);
          }}
        />
        <TextInputField
          label="Last name"
          placeholder="Doe"
          value={lastName}
          onChange={(event: ChangeEvent) => {
            // @ts-ignore
            setLastName(event.target.value);
          }}
        />
        <SelectField
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
            day={birthDay}
            month={birthMonth}
            year={birthYear}
            setDay={setBirthDay}
            setMonth={setBirthMonth}
            setYear={setBirthYear}
          />
        </FormField>
        <FormField label="Date of birth">
          <DateSelect
            day={deathDay}
            month={deathMonth}
            year={deathYear}
            setDay={setDeathDay}
            setMonth={setDeathMonth}
            setYear={setDeathYear}
          />
        </FormField>
      </Dialog>
    </>
  );
};
