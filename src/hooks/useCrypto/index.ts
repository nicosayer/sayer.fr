import { useEffect, useState } from "react";
import { useHttpsCallable } from "react-firebase-hooks/functions";
import { functions } from "utils/firebase";

export const useEncrypt = () => {
  const [encrypt, loading, error] = useHttpsCallable<string, string>(
    functions,
    "encrypt"
  );

  return { encrypt, loading, error };
};

export const useDecrypt = (defaultValue?: string) => {
  const [value, setValue] = useState<string>();
  const [decrypt, loading, error] = useHttpsCallable<string, string>(
    functions,
    "decrypt"
  );

  useEffect(() => {
    (async () => {
      if (defaultValue) {
        const value = await decrypt(defaultValue);
        setValue(value?.data);
      }
    })();
  }, [defaultValue, decrypt]);

  return { decrypt, loading, error, value };
};
