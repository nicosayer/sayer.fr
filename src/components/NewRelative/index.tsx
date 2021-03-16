import {
  Button,
  Dialog,
  PlusIcon,
  SelectField,
  TextInputField,
} from "evergreen-ui";
import React, { ChangeEvent, useState } from "react";

import { db } from "config/firebase";
import { GenderType } from "config/relative";
import { useOneTimeRelatives } from "providers/OneTimeRelatives";
import { useSideSheet } from "providers/SideSheet";
import { isSet } from "utils/general";
import { cleanName } from "utils/relative";

export const NewRelative = () => {
  const { openSideSheet } = useSideSheet();
  const { updateRelatives } = useOneTimeRelatives();
  const [isShown, setIsShown] = useState(false);
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [gender, setGender] = useState<number>(GenderType.male);

  return (
    <>
      <Button
        appearance="primary"
        iconBefore={PlusIcon}
        onClick={() => {
          setIsShown(true);
        }}
      >
        New relative
      </Button>
      <Dialog
        isShown={isShown}
        title="New relative"
        onCloseComplete={() => setIsShown(false)}
        confirmLabel="Add"
        onConfirm={() => {
          const cleanedFirstName = cleanName(firstName);

          if (cleanedFirstName && lastName && isSet(gender)) {
            db.collection("relatives")
              .add({
                firstName: cleanedFirstName,
                lastName: lastName,
                gender,
              })
              .then((doc) => {
                updateRelatives();
                openSideSheet(doc.id);
              });
          }

          setIsShown(false);
          setFirstName("");
          setLastName("");
          setGender(GenderType.male);
        }}
      >
        <TextInputField
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
      </Dialog>
    </>
  );
};
