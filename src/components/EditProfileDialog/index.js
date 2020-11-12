import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FormDialog } from "components/FormDialog";
import { Label } from "components/Label";
import { Input } from "components/Input";
import { Button } from "components/Button";
import { DateInput } from "@blueprintjs/datetime";
import { useWriteData } from "hooks/useWriteData";
import { Intent } from "@blueprintjs/core";
import { useToaster } from "providers/ToasterProvider";
import { formatDate, parseDate } from "utils/date";
import { ConfirmDeleteButton } from "components/ConfirmDeleteButton";
import { useData } from "providers/useData";
import { uniq } from "lodash/fp";
import { useUser } from "providers/UserProvider";

export const EditProfileDialog = ({ isOpen, onClose, item: profile }) => {
  const { selectedProfiles, setSelectedProfiles } = useData();
  const { user } = useUser();
  const defaultData = useMemo(
    () => ({
      firstname: profile.firstname,
      lastname: profile.lastname,
      birthday: profile.birthday,
      placeofbirth: profile.placeofbirth,
      address: profile.address,
      city: profile.city,
      zipcode: profile.zipcode,
    }),
    [
      profile.firstname,
      profile.lastname,
      profile.birthday,
      profile.placeofbirth,
      profile.address,
      profile.city,
      profile.zipcode,
    ]
  );
  const [data, setData] = useState(defaultData);
  const [writeData, loading] = useWriteData();
  const { primaryToast, toast } = useToaster();

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
              writeData({
                collection: "profiles",
                id: profile.uid,
                data: { ...data, userId: user.uid },
                onSuccess: () => {
                  setSelectedProfiles(uniq([...selectedProfiles, profile.uid]));
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
            setSelectedProfiles(
              selectedProfiles.filter((profile) => profile !== profile.uid)
            );
          }}
        >
          Supprimer
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
