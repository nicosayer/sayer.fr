import { Intent } from "@blueprintjs/core";
import { certificateGenerator } from "certificateGenerator";
import { Box } from "components/Box";
import { Button } from "components/Button";
import { LogoutButton } from "components/LogoutButton";
import { REASONS } from "config/enums";
import { useCallCloudFunction } from "hooks/useCallCloudFunction";
import { useToaster } from "providers/ToasterProvider";
import { useData } from "providers/useData";
import { useUser } from "providers/UserProvider";
import { useDevice } from "providers/DeviceProvider";
import { useMemo, useState } from "react";

const blobToBase64 = (blob) => {
  const reader = new FileReader();
  reader.readAsDataURL(blob);
  return new Promise((resolve) => {
    reader.onloadend = () => {
      resolve(reader.result);
    };
  });
};

function Header() {
  const { isComputerSize } = useDevice();
  const { selectedProfiles, selectedReason, date, profiles, time } = useData();
  const { user } = useUser();
  const [callCloudFunction] = useCallCloudFunction();
  const [loading, setLoading] = useState(false);
  const { successToast, dangerToast } = useToaster();

  const disabled = useMemo(
    () => !date || !selectedProfiles.length || !selectedReason,
    [selectedProfiles.length, selectedReason, date]
  );

  return (
    <Box
      style={{
        width: "100%",
        backgroundColor: "white",
        borderBottom: "classic",
        borderColor: "lightgray",
        display: "flex",
        alignItems: "center",
        position: "sticky",
        top: 0,
        zIndex: 2,
      }}
    >
      <Box
        style={{
          margin: "auto",
          width: "100%",
          maxWidth: "max",
          display: "flex",
          alignItems: "center",
          padding: "10px",
        }}
      >
        <Button
          large
          fill
          intent={Intent.SUCCESS}
          icon="envelope"
          disabled={disabled}
          loading={loading}
          onClick={async () => {
            setLoading(true);

            const validProfiles = selectedProfiles
              .map((profile) => profiles.find(({ uid }) => uid === profile))
              .filter(Boolean);

            const validReason = REASONS.find(
              ({ slug }) => slug === selectedReason
            );

            const files = await Promise.all(
              validProfiles.map((profile) =>
                certificateGenerator({
                  profiles: {
                    ...profile,
                    datesortie: date,
                    heuresortie: time,
                  },
                  reasons: validReason.slug,
                }).then(blobToBase64)
              )
            ).then((base64) =>
              validProfiles.map((profile, index) => ({
                filename: `${profile.firstname[0]}_${profile.lastname}_${validReason.name}.pdf`,
                path: base64[index],
              }))
            );

            callCloudFunction({
              name: "sendEmail",
              data: {
                files: JSON.stringify(files),
                date: `${date} ${time}`,
              },
              onSuccess: () => {
                setLoading(false);
                successToast({
                  icon: "tick",
                  message: "Les attestations ont été envoyées",
                });
              },
              onError: () => {
                setLoading(false);
                dangerToast({
                  icon: "warning-sign",
                  message: "Une erreur est survenue",
                });
              },
            });
          }}
        >
          Envoyer sur mon email
        </Button>
        <Box style={{ marginLeft: "10px" }}>
          <LogoutButton
            intent={Intent.DANGER}
            rightIcon="power"
            large
            tooltipProps={{ content: user.email }}
          >
            {isComputerSize && "Déconnexion"}
          </LogoutButton>
        </Box>
      </Box>
    </Box>
  );
}

export default Header;
