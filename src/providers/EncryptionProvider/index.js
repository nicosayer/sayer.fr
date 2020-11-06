import React, { useCallback, useContext, useEffect, useState } from "react";
import CryptoJS from "crypto-js";
import { ENV } from "config/enums";

const EncryptionContext = React.createContext();

export const useEncryption = () => useContext(EncryptionContext);

export const EncryptionProvider = ({ children }) => {
  const [key, setKey] = useState(
    (process.env.NODE_ENV === ENV.DEV &&
      localStorage.getItem("encryption-key")) ||
      ""
  );

  useEffect(() => {
    if (process.env.NODE_ENV === ENV.DEV) {
      localStorage.setItem("encryption-key", key);
    }
  }, [key]);

  const encrypt = useCallback(
    (string, tempKey = key) => {
      return CryptoJS.AES.encrypt(string, tempKey)?.toString();
    },
    [key]
  );

  const decrypt = useCallback(
    (string) => {
      try {
        return CryptoJS.AES.decrypt(string, key).toString(CryptoJS.enc.Utf8);
      } catch (error) {
        return "";
      }
    },
    [key]
  );

  const test = useCallback(
    (string) => {
      return Boolean(decrypt(string));
    },
    [decrypt]
  );

  return (
    <EncryptionContext.Provider
      value={{
        key,
        setKey,
        encrypt,
        decrypt,
        test,
        locked: !key,
      }}
    >
      {children}
    </EncryptionContext.Provider>
  );
};
