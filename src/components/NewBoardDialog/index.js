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

export const NewBoardDialog = ({ isOpen, onClose }) => {
  const { user } = useUser();
  const defaultData = useMemo(
    () => ({
      name: "",
      access: [user.email],
    }),
    [user.email]
  );
  const [data, setData] = useState(defaultData);
  const [writeData, loading] = useWriteData();
  const { primary, warning } = useToaster();

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
              autoFocus
              large
              id="name-input"
              placeholder="Family"
            />
          </FormGroup>
          <FormGroup
            large
            label="Access"
            labelFor="access-input"
            labelInfo="*"
            helperText="Users with access will be able to read, edit and delete."
          >
            <TagInput
              fill
              large
              disabled={loading}
              leftIcon="envelope"
              values={data.access}
              placeholder="Enter emails"
              onChange={(values) => {
                setData({
                  ...data,
                  access: uniq(values.filter(isEmail)),
                });
              }}
              id="access-input"
              addOnBlur
              tagProps={{
                minimal: true,
                fill: true,
              }}
              rightElement={
                <Tooltip content="Reset">
                  <Button
                    icon="reset"
                    onClick={() => {
                      setData({
                        ...data,
                        access: [user.email],
                      });
                    }}
                  />
                </Tooltip>
              }
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
                if (!data.access.length) {
                  warning({
                    icon: "warning-sign",
                    message: "You must enter at least one email",
                  });
                } else {
                  writeData({
                    collection: "boards",
                    id: uniqueId(),
                    data: {
                      name: data.name,
                      access: data.access,
                    },
                    onSuccess: () => {
                      onClose();
                      primary({
                        icon: "check",
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
