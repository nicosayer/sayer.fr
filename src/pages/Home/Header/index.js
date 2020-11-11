import { Button, Intent } from "@blueprintjs/core";
import { Box } from "components/Box";
import { LogoutButton } from "components/LogoutButton";
import { functions } from "config/firebase";
import { useToaster } from "providers/ToasterProvider";
import { useData } from "providers/useData";
import { useUser } from "providers/UserProvider";
import { useWindowSize } from "providers/WindowSizeProvider";
import { useMemo, useState } from "react";
import { formatISODate } from "utils/date";

function Header() {
  const { isOnComputer } = useWindowSize();
  const { selectedProfiles, selectedReasons, date } = useData();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const { successToast, dangerToast } = useToaster();

  const count = useMemo(
    () => (date ? selectedProfiles.length * selectedReasons.length : 0),
    [selectedProfiles.length, selectedReasons.length, date]
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
          icon={isOnComputer ? "envelope" : undefined}
          rightIcon="arrow-right"
          disabled={!count}
          loading={loading}
          onClick={() => {
            setLoading(true);
            var addMessage = functions().httpsCallable("sendCertificates");
            addMessage({
              profiles: selectedProfiles,
              reasons: selectedReasons,
              date: formatISODate(date),
            })
              .then(function (result) {
                setLoading(false);
                successToast({
                  icon: "tick",
                  message: "Les attestations ont été envoyées",
                });
              })
              .catch(function (error) {
                setLoading(false);
                dangerToast({
                  icon: "warning-sign",
                  message: "Une erreur est survenue",
                });
              });
          }}
        >
          Envoyer les attestations {count ? `(${count})` : ""}
        </Button>
        <Box style={{ marginLeft: "10px" }}>
          <LogoutButton
            intent={Intent.DANGER}
            rightIcon="power"
            large
            tooltipProps={{ content: user.email }}
          >
            {isOnComputer && "Déconnexion"}
          </LogoutButton>
        </Box>
      </Box>
    </Box>
  );
}

export default Header;
