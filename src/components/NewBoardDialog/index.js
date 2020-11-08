import {
  Button,
  Classes,
  Dialog,
  FormGroup,
  InputGroup,
  Intent,
  TagInput,
} from "@blueprintjs/core";
import { useToaster } from "providers/ToasterProvider";
import { useWriteData } from "hooks/useWriteData";
import { useCallback, useEffect, useMemo, useState } from "react";
import { isEmail, uniqueId } from "utils";
import { Tooltip } from "components/Tooltip";
import { uniq } from "lodash/fp";
import { useUser } from "providers/UserProvider";
import { useWindowSize } from "hooks/useWindowSize";

export const NewBoardDialog = ({ isOpen, onClose }) => {
  const { user } = useUser();
  const defaultData = useMemo(
    () => ({
      name: "",
      editors: [user.email],
      viewers: [],
    }),
    [user.email]
  );
  const [data, setData] = useState(defaultData);
  const [writeData, loading] = useWriteData();
  const { primaryToast, warningToast } = useToaster();
  const { isOnComputer } = useWindowSize();

  useEffect(() => {
    setData(defaultData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleChange = useCallback(
    (key) => (event) => {
      setData({ ...data, [key]: event?.target?.value });
    },
    [data]
  );

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="New board">
      <form>
        <div className={Classes.DIALOG_BODY}>
          <FormGroup large label="Name" labelFor="name-input" labelInfo="*">
            <InputGroup
              disabled={loading}
              leftIcon="label"
              value={data.name}
              onChange={handleChange("name")}
              autoFocus={isOnComputer}
              large
              id="name-input"
              placeholder="Family"
            />
          </FormGroup>
          <FormGroup
            large
            label="Administrators"
            labelFor="editors-input"
            labelInfo="*"
            helperText="Administrators will be able to read, create, edit and delete."
          >
            <TagInput
              fill
              large
              disabled={loading}
              leftIcon="envelope"
              values={data.editors}
              placeholder="john@doe.com"
              onChange={(values) => {
                setData({
                  ...data,
                  editors: uniq(values.filter(isEmail)),
                });
              }}
              id="editors-input"
              addOnBlur
              tagProps={{
                minimal: true,
                fill: true,
              }}
              inputProps={{
                autoCapitalize: "none",
              }}
              rightElement={
                <Tooltip content="Reset">
                  <Button
                    icon="reset"
                    onClick={() => {
                      setData({
                        ...data,
                        editors: [user.email],
                      });
                    }}
                  />
                </Tooltip>
              }
            />
          </FormGroup>
          <FormGroup
            large
            label="Viewers only"
            labelFor="viewers-input"
            labelInfo="*"
            helperText="Viewers will only be able to read."
          >
            <TagInput
              fill
              large
              disabled={loading}
              leftIcon="envelope"
              values={data.viewers}
              placeholder="john@doe.com"
              onChange={(values) => {
                setData({
                  ...data,
                  viewers: uniq(
                    values
                      .filter(isEmail)
                      .filter((value) => !data.editors.includes(value))
                  ),
                });
              }}
              id="viewers-input"
              addOnBlur
              tagProps={{
                minimal: true,
                fill: true,
              }}
              inputProps={{
                autoCapitalize: "none",
              }}
            />
          </FormGroup>
        </div>
        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button large onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button
              large
              intent={Intent.PRIMARY}
              loading={loading}
              disabled={!data.name}
              onClick={(event) => {
                event.preventDefault();
                if (!data.editors.length) {
                  warningToast({
                    icon: "warning-sign",
                    message: "You must enter at least one administrator",
                  });
                } else {
                  writeData({
                    collection: "boards",
                    id: uniqueId(),
                    data: {
                      name: data.name,
                      editors: data.editors,
                      viewers: data.viewers,
                    },
                    onSuccess: () => {
                      onClose();
                      primaryToast({
                        icon: "plus",
                        message: "Board created with success",
                      });
                    },
                  });
                }
              }}
            >
              Submit
            </Button>
          </div>
        </div>
      </form>
    </Dialog>
  );
};
