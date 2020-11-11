import { Button, Intent } from "@blueprintjs/core";
import { Box } from "components/Box";
import { LogoutButton } from "components/LogoutButton";
import { useWriteData } from "hooks/useWriteData";
import { useToaster } from "providers/ToasterProvider";
import { useData } from "providers/useData";
import { useUser } from "providers/UserProvider";
import { useWindowSize } from "providers/WindowSizeProvider";
import { useMemo } from "react";

function Header() {
  const { isOnComputer } = useWindowSize();
  const { selectedProfiles, selectedReasons, date, emails } = useData();
  const { user } = useUser();
  const [writeData, loading] = useWriteData();
  const { successToast } = useToaster();

  const count = useMemo(
    () =>
      date && emails.length
        ? selectedProfiles.length * selectedReasons.length
        : 0,
    [selectedProfiles.length, selectedReasons.length, date, emails.length]
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
            writeData({
              collection: "users",
              id: user.email,
              data: {
                profiles: selectedProfiles,
                reasons: selectedReasons,
                emails,
              },
              onSuccess: () => {
                successToast({
                  icon: "tick",
                  message: "Attestations envoyées avec succès",
                });
              },
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
