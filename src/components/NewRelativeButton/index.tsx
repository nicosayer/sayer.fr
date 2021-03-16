import {
  Button,
  ButtonProps,
  Dialog,
  SelectField,
  TextInputField,
} from "evergreen-ui";
import React, { ChangeEvent, useState } from "react";

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
                onCompleted(doc);
              });
          }

          setIsShown(false);
          setFirstName("");
          setLastName("");
          setGender(GenderType.male);
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
      </Dialog>
    </>
  );
};
