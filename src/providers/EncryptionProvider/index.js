import React, { useCallback, useContext, useState } from "react";
import CryptoJS from "crypto-js";

const EncryptionContext = React.createContext();

export const useEncryption = () => useContext(EncryptionContext);

export const EncryptionProvider = ({ children }) => {
  const [key, setKey] = useState("");

  const encrypt = useCallback(
    (string) => {
      return CryptoJS.AES.encrypt(string, key)?.toString();
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
