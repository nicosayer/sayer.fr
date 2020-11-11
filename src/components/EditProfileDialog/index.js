import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FormDialog } from "components/FormDialog";
import { Label } from "components/Label";
import { Input } from "components/Input";
import { Button } from "components/Button";
import { DateInput } from "@blueprintjs/datetime";
import { useWriteData } from "hooks/useWriteData";
import { Intent } from "@blueprintjs/core";
import { useToaster } from "providers/ToasterProvider";
import { useUser } from "providers/UserProvider";
import { formatDate, formatFirestoreDate, parseDate } from "utils/date";
import { ConfirmDeleteButton } from "components/ConfirmDeleteButton";

export const EditProfileDialog = ({ isOpen, onClose, item: profile }) => {
  const defaultData = useMemo(
    () => ({
      firstName: profile.firstName,
      lastName: profile.lastName,
      birthDate: formatFirestoreDate(profile.birthDate),
      birthPlace: profile.birthPlace,
      address: profile.address,
      city: profile.city,
      zipCode: profile.zipCode,
    }),
    [
      profile.firstName,
      profile.lastName,
      profile.birthDate,
      profile.birthPlace,
      profile.address,
      profile.city,
      profile.zipCode,
    ]
  );
  const [data, setData] = useState(defaultData);
  const [writeData, loading] = useWriteData();
  const { primaryToast, toast } = useToaster();
  const { user } = useUser();

  useEffect(() => {
    setData(defaultData);
  }, [isOpen, defaultData]);

  const handleChange = useCallback(
    (key) => (value) => {
      setData({ ...data, [key]: value });
    },
    [data]
  );

  return (
    <FormDialog
      title="Modifier le profil"
      isOpen={isOpen}
      onClose={onClose}
      actions={
        <>
          <Button large onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={
              !data.firstName ||
              !data.lastName ||
              !data.birthDate ||
              !data.birthPlace ||
              !data.address ||
              !data.city ||
              !data.zipCode
            }
            loading={loading}
            large
            intent={Intent.PRIMARY}
            onClick={(event) => {
              event.preventDefault();
              writeData({
                collection: `users/${user.email}/profiles`,
                id: profile.uid,
                data: data,
                onSuccess: () => {
                  onClose();
                  primaryToast({
                    icon: "edit",
                    message: "Profile modifié avec succès",
                  });
                },
              });
            }}
          >
            Submit
          </Button>
        </>
      }
      leftAction={
        <ConfirmDeleteButton
          src={profile.ref}
          message="Êtes-vous sûr de vouloir supprimer ce profil ?"
          intent={Intent.DANGER}
          large
          onSuccess={() => {
            toast({ icon: "trash", message: "Profil supprimé avec succès" });
          }}
        >
          Delete
        </ConfirmDeleteButton>
      }
      inputs={
        <>
          <Label
            labelInfo="*"
            label="Prénom"
            component={Input}
            componentProps={{
              large: true,
              value: data.firstName,
              onChange: handleChange("firstName"),
            }}
          />
          <Label
            labelInfo="*"
            label="Nom"
            component={Input}
            componentProps={{
              large: true,
              value: data.lastName,
              onChange: handleChange("lastName"),
            }}
          />
          <Label
            labelInfo="*"
            label="Date de naissance"
            component={DateInput}
            componentProps={{
              fill: true,
              inputProps: { large: true },
              value: data.birthDate,
              onChange: handleChange("birthDate"),
              formatDate: formatDate,
              parseDate: parseDate,
              minDate: new Date("1900-01-01"),
              maxDate: new Date("2100-12-31"),
            }}
          />
          <Label
            labelInfo="*"
            label="Lieu de naissance"
            component={Input}
            componentProps={{
              large: true,
              value: data.birthPlace,
              onChange: handleChange("birthPlace"),
            }}
          />
          <Label
            labelInfo="*"
            label="Adresse"
            component={Input}
            componentProps={{
              large: true,
              value: data.address,
              onChange: handleChange("address"),
            }}
          />
          <Label
            labelInfo="*"
            label="Ville"
            component={Input}
            componentProps={{
              large: true,
              value: data.city,
              onChange: handleChange("city"),
            }}
          />
          <Label
            labelInfo="*"
            label="Code postal"
            component={Input}
            componentProps={{
              large: true,
              value: data.zipCode,
              onChange: handleChange("zipCode"),
            }}
          />
        </>
      }
    />
  );
};
