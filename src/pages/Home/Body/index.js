import { Box } from "components/Box";
import { useUser } from "providers/UserProvider";
import { DateInput, TimePrecision } from "@blueprintjs/datetime";
import { Callout, Intent, Spinner } from "@blueprintjs/core";
import { useEffect, useMemo } from "react";
import { DialogButton } from "components/DialogButton";
import { REASONS } from "config/enums";
import { NewProfileDialog } from "components/NewProfileDialog";
import { useListenData } from "hooks/useListenData";
import { useData } from "providers/useData";
import { EmailsInput } from "components/EmailsInput";
import { useReadData } from "hooks/useReadData";
import { caseInsensitiveSortBy } from "utils";
import { EditProfileDialog } from "components/EditProfileDialog";

const Title = ({ title, description }) => {
  return (
    <Box style={{ marginBottom: "10px" }}>
      <Box style={{ fontSize: "large" }}>{title}</Box>
      <Box style={{ color: "grey" }}>{description}</Box>
    </Box>
  );
};

const Grid = ({
  items,
  selectedItems,
  setSelectedItems,
  renderTitle = (item) => item.label,
  renderContent = () => null,
}) => {
  return (
    <Box
      style={{
        marginTop: "10px",
        display: "grid",
        gridGap: "10px",
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
      }}
    >
      {items.map((item) => (
        <Item
          key={item.slug || item.uid}
          item={item}
          title={renderTitle(item)}
          checked={selectedItems.includes(item.slug || item.uid)}
          setChecked={(checked) => {
            if (checked) {
              setSelectedItems([...selectedItems, item.slug || item.uid]);
            } else {
              setSelectedItems(
                selectedItems.filter(
                  (selectedReason) => selectedReason !== (item.slug || item.uid)
                )
              );
            }
          }}
        >
          {renderContent(item)}
        </Item>
      ))}
    </Box>
  );
};

const Item = ({ checked, setChecked, children, title, item }) => {
  return (
    <Box style={{ cursor: "pointer" }}>
      <Callout
        title={
          <Box style={{ display: "flex", alignItens: "center" }}>
            {title}
            {item.uid && (
              <Box style={{ marginLeft: "4px" }}>
                <DialogButton
                  minimal
                  tooltipProps={{ content: "Modifier le profil" }}
                  icon="edit"
                  dialog={EditProfileDialog}
                  onClick={(event) => {
                    event.stopPropagation();
                  }}
                  dialogProps={{ item }}
                />
              </Box>
            )}
          </Box>
        }
        icon={null}
        intent={checked ? Intent.PRIMARY : Intent.NONE}
        onClick={() => setChecked(!checked)}
      >
        {children}
      </Callout>
    </Box>
  );
};

function Body() {
  const {
    selectedProfiles,
    setSelectedProfiles,
    selectedReasons,
    setSelectedReasons,
    emails,
    setEmails,
    date,
    setData,
  } = useData();

  const { user } = useUser();
  const [data = {}, loadingData] = useReadData({
    collection: "users",
    id: user.email,
  });
  const [profiles = [], loadingProfiles] = useListenData({
    collection: "profiles",
    src: data.ref,
    skip: !data.ref,
  });

  useEffect(() => {
    if (data.emails) {
      setEmails(data.emails);
    }
  }, [data.emails, setEmails]);

  useEffect(() => {
    if (data.reasons) {
      setSelectedReasons(data.reasons);
    }
  }, [data.reasons, setSelectedReasons]);

  useEffect(() => {
    if (data.profiles) {
      setSelectedProfiles(data.profiles);
    }
  }, [data.profiles, setSelectedProfiles]);

  const loading = useMemo(() => loadingData || loadingProfiles, [
    loadingData,
    loadingProfiles,
  ]);

  if (loading) {
    return (
      <Box
        style={{
          marginTop: "40px",
        }}
      >
        <Spinner />
      </Box>
    );
  }

  return (
    <Box
      style={{
        padding: "10px",
        maxWidth: "max",
        margin: "auto",
      }}
    >
      <Title title="Date" description="Date et heure de la sortie" />
      <Box style={{ marginBottom: "40px" }}>
        <DateInput
          fill
          value={date}
          onChange={setData}
          formatDate={(date) =>
            date.toLocaleDateString("fr", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          }
          parseDate={(str) => new Date(str)}
          inputProps={{ large: true, leftIcon: "calendar" }}
          timePrecision={TimePrecision.MINUTE}
        />
      </Box>
      <Title
        title="Emails"
        description="Les attestations serons envoyés à ces emails."
      />
      <Box style={{ marginBottom: "40px" }}>
        <EmailsInput
          values={emails}
          fill
          large
          onReset={() => {
            setEmails([user.email]);
          }}
          onChange={setEmails}
        />
      </Box>
      <Title
        title={
          <>
            Profiles
            <Box as="span" style={{ marginLeft: "10px" }}>
              <DialogButton
                large
                tooltipProps={{ content: "Nouveau profil" }}
                icon="plus"
                dialog={NewProfileDialog}
              />
            </Box>
          </>
        }
        description="Les personnes concernées par la sortie."
      />
      <Box style={{ marginBottom: "40px" }}>
        <Grid
          items={caseInsensitiveSortBy(profiles, ["firstName", "lastName"])}
          selectedItems={selectedProfiles}
          setSelectedItems={setSelectedProfiles}
          renderTitle={(profile) => (
            <Box
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              {profile.firstName[0]}. {profile.lastName}
            </Box>
          )}
          renderContent={(profile) => (
            <Box
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {profile.address}
            </Box>
          )}
        />
      </Box>
      <Title
        title="Motifs"
        description="Le motif de la sotie. Vous pouvez en sélectionner plusieurs."
      />
      <Box style={{ marginBottom: "40px" }}>
        <Grid
          items={REASONS}
          selectedItems={selectedReasons}
          setSelectedItems={setSelectedReasons}
        />
      </Box>
    </Box>
  );
}

export default Body;
