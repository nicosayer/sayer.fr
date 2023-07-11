import { Button, Input, TextInput } from "@mantine/core";
import { usePrevious } from "@mantine/hooks";
import { doc } from "firebase/firestore";
import useBooleanState from "hooks/useBooleanState";
import { FC, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useBoard } from "routes/Home/Boards/Board/Provider";
import { Collection } from "types/firebase/collections";
import { auth, db, updateDoc } from "utils/firebase";
import { cleanString } from "utils/string";

export interface NameInputProps {
  defaultValue?: string;
}

const NameInput: FC<NameInputProps> = ({ defaultValue }) => {
  const [user] = useAuthState(auth);
  const { users } = useBoard();
  const previousName = usePrevious(users?.[String(user?.email)].name);
  const [value, setValue] = useState("");
  const [loading, start, stop] = useBooleanState();

  useEffect(() => {
    const currentName = users?.[String(user?.email)].name;
    if (currentName && currentName !== previousName && currentName !== value) {
      setValue(currentName);
    }
  }, [previousName, user?.email, users, value]);

  return (
    <Input.Wrapper label="Nom">
      <div className="flex gap-4">
        <TextInput
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
          }}
          className="w-full"
          disabled={loading}
        />
        <Button
          loading={loading}
          onClick={() => {
            if (user?.email && value) {
              start();
              updateDoc(doc(db, Collection.users, user.email), {
                name: cleanString(value),
              }).finally(stop);
            }
          }}
        >
          Sauvegarder
        </Button>
      </div>
    </Input.Wrapper>
  );
};

export default NameInput;
