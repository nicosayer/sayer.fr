import useBooleanState from "hooks/useBooleanState";
import { useCrypto } from "providers/Crypto";
import { useEffect } from "react";

export const useDecrypt = (value?: string) => {
  const [loading, start, stop] = useBooleanState();
  const { decrypt, data } = useCrypto();

  useEffect(() => {
    (async () => {
      if (value && !data[value]) {
        start();
        await decrypt(value);
        stop();
      }
    })();
  }, [data, decrypt, start, stop, value]);

  return {
    value: value ? data[value] : undefined,
    loading,
  };
};
