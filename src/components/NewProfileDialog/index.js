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
  firstname: "",
  lastname: "",
  birthday: "",
  placeofbirth: "",
  address: "",
  city: "",
  zipcode: "",
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
            Annuler
          </Button>
          <Button
            type="submit"
            disabled={
              !data.firstname ||
              !data.lastname ||
              !data.birthday ||
              !data.placeofbirth ||
              !data.address ||
              !data.city ||
              !data.zipcode
            }
            loading={loading}
            large
            intent={Intent.PRIMARY}
            onClick={(event) => {
              event.preventDefault();
              const id = uniqueId();
              writeData({
                collection: "profiles",
                id,
                data: { ...data, userId: user.uid },
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
              value: data.firstname,
              onChange: handleChange("firstname"),
            }}
          />
          <Label
            labelInfo="*"
            label="Nom"
            component={Input}
            componentProps={{
              large: true,
              value: data.lastname,
              onChange: handleChange("lastname"),
            }}
          />
          <Label
            labelInfo="*"
            label="Date de naissance"
            component={DateInput}
            componentProps={{
              fill: true,
              inputProps: { large: true },
              value: parseDate(data.birthday),
              onChange: (value) => handleChange("birthday")(formatDate(value)),
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
              value: data.placeofbirth,
              onChange: handleChange("placeofbirth"),
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
              value: data.zipcode,
              onChange: handleChange("zipcode"),
            }}
          />
        </>
      }
    />
  );
};
