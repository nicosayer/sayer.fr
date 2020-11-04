import { EncryptionContext } from "providers/EncryptionProvider";
import { useContext } from "react";

export const useEncryption = () => useContext(EncryptionContext);
