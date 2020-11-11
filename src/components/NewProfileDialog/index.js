import React, { useCallback, useEffect, useState } from "react";
import { FormDialog } from "components/FormDialog";
import { Label } from "components/Label";
import { Input } from "components/Input";
import { Button } from "components/Button";
import { DateInput } from "@blueprintjs/datetime";
import { useWriteData } from "hooks/useWriteData";
import { Intent } from "@blueprintjs/core";
import { useToaster } from "providers/ToasterProvider";
import { useUser } from "providers/UserProvider";
import { uniqueId } from "utils";
import { formatDate, parseDate } from "utils/date";
import { useData } from "providers/useData";

const DEFAULT_DATA = {
  firstName: "",
  lastName: "",
  birthDate: null,
  birthPlace: "",
  address: "",
  city: "",
  zipCode: "",
};

export const NewProfileDialog = ({ isOpen, onClose }) => {
  const { selectedProfiles, setSelectedProfiles } = useData();
  const [data, setData] = useState(DEFAULT_DATA);
  const [writeData, loading] = useWriteData();
  const { primaryToast } = useToaster();
  const { user } = useUser();

  useEffect(() => {
    setData(DEFAULT_DATA);
  }, [isOpen]);

  const handleChange = useCallback(
    (key) => (value) => {
      setData({ ...data, [key]: value });
    },
    [data]
  );

  return (
    <FormDialog
      title="Nouveau profil"
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
              const id = uniqueId();
              writeData({
                collection: `users/${user.email}/profiles`,
                id,
                data: data,
                onSuccess: () => {
                  setSelectedProfiles([...selectedProfiles, id]);
                  onClose();
                  primaryToast({
                    icon: "edit",
                    message: "Nouveau profil créé avec succès",
                  });
                },
              });
            }}
          >
            Submit
          </Button>
        </>
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
