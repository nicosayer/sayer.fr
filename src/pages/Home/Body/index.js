import { Box } from "components/Box";
import { DateInput } from "@blueprintjs/datetime";
import { Callout, Intent, Spinner } from "@blueprintjs/core";
import { DialogButton } from "components/DialogButton";
import { REASONS } from "config/enums";
import { NewProfileDialog } from "components/NewProfileDialog";
import { useData } from "providers/useData";
import { caseInsensitiveSortBy } from "utils";
import { formatDate, formatTime, parseDate, parseTime } from "utils/date";
import { EditProfileDialog } from "components/EditProfileDialog";
import { css } from "emotion";
import { Button } from "components/Button";
import { Input } from "components/Input";

const Title = ({ title, description }) => {
  return (
    <Box style={{ marginBottom: "10px" }}>
      <Box style={{ fontSize: "large" }}>{title}</Box>
      <Box style={{ color: "grey" }}>{description}</Box>
    </Box>
  );
};

const Grid = ({ children }) => {
  return (
    <Box
      style={{
        marginTop: "10px",
        display: "grid",
        gridGap: "10px",
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
      }}
    >
      {children}
    </Box>
  );
};

const Item = ({ checked, setChecked, children, title, item }) => {
  return (
    <Box
      style={{ cursor: "pointer" }}
      css={css`
        .bp3-callout,
        .bp3-heading {
          color: ${checked ? undefined : "grey"};
          transition: all 0.2s;
        }
      `}
    >
      <Callout
        title={
          <Box style={{ display: "flex", alignItens: "center" }}>
            {title}
            {item?.uid && (
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
    selectedReason,
    setSelectedReason,
    date,
    setData,
    loading,
    profiles,
    time,
    setTime,
  } = useData();

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
      <Title title="Date et heure" />
      <Box
        style={{
          display: "grid",
          gridGap: "10px",
          gridTemplateColumns: "3fr 2fr 1fr",
          marginBottom: "40px",
        }}
      >
        <DateInput
          minDate={new Date("1900-01-01")}
          maxDate={new Date("2100-12-31")}
          fill
          value={parseDate(date)}
          onChange={(value) => setData(formatDate(value))}
          inputProps={{
            large: true,
            leftIcon: "calendar",
          }}
          formatDate={formatDate}
          parseDate={parseDate}
        />
        <Input
          leftIcon="time"
          fill
          large
          value={time}
          onChange={setTime}
          onBlur={(value) => {
            if (!parseTime(value)) {
              setTime(formatTime(new Date()));
            } else {
              setTime(formatTime(parseTime(value)));
            }
          }}
        />
        <Button
          icon="updated"
          onClick={() => {
            setData(formatDate(new Date()));
            setTime(formatTime(new Date()));
          }}
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
        description="Vous pouvez en sélectionnez plusieurs"
      />
      <Box style={{ marginBottom: "40px" }}>
        <Grid>
          {caseInsensitiveSortBy(profiles, ["firstname", "lastname"]).map(
            (profile) => (
              <Item
                key={profile.uid}
                item={profile}
                title={
                  <Box
                    style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "inline-flex",
                      alignItems: "center",
                    }}
                  >
                    {profile.firstname[0]}. {profile.lastname}
                  </Box>
                }
                checked={selectedProfiles.includes(profile.uid)}
                setChecked={(checked) => {
                  if (checked) {
                    setSelectedProfiles([...selectedProfiles, profile.uid]);
                  } else {
                    setSelectedProfiles(
                      selectedProfiles.filter(
                        (selectedProfile) => selectedProfile !== profile.uid
                      )
                    );
                  }
                }}
              >
                <Box
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {profile.address}
                </Box>
              </Item>
            )
          )}
        </Grid>
      </Box>
      <Title title="Motif" />
      <Box style={{ marginBottom: "40px" }}>
        <Grid>
          {REASONS.map((reason) => (
            <Item
              key={reason.slug}
              title={
                <Box style={{ paddingTop: "10px", paddingBottom: "10px" }}>
                  {reason.label}
                </Box>
              }
              checked={selectedReason === reason.slug}
              setChecked={(checked) => {
                if (checked) {
                  setSelectedReason(reason.slug);
                } else {
                  setSelectedReason("");
                }
              }}
            />
          ))}
        </Grid>
      </Box>
    </Box>
  );
}

export default Body;
