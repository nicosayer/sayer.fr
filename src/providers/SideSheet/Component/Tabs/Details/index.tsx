import { Button, Card, Pane, SelectField, TextInputField } from "evergreen-ui";
import React, { ChangeEvent, useState } from "react";

import { db } from "config/firebase";
import { cleanName } from "utils/relative";

export const Details = ({ relative }: { relative: Record<string, any> }) => {
  const data = relative.data();

  const [firstName, setFirstName] = useState<string>(data.firstName);
  const [lastName, setLastName] = useState<string>(data.lastName);
  const [gender, setGender] = useState<number>(data.gender);

  return (
    <Pane background="tint1" padding={16}>
      <Card backgroundColor="white" elevation={0} padding={16}>
        <TextInputField
          label="First name"
          placeholder="Nicolas"
          value={firstName}
          onChange={(event: ChangeEvent) => {
            // @ts-ignore
            setFirstName(event.target.value);
          }}
        />
        <TextInputField
          label="Last name"
          placeholder="Sayer"
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
                  lastName: cleanName(lastName),
                  gender: Number(gender),
                },
                { merge: true }
              );
          }}
        >
          Save
        </Button>
      </Card>
    </Pane>
  );
};
