import CryptoJS from "crypto-js";
import * as functions from "firebase-functions";

export const encrypt = functions
  .runWith({ enforceAppCheck: true })
  .region("europe-west3")
  .https.onCall((string) => {
    if (!process.env.CRYPTO_KEY) {
      throw new Error(`Missing key to encrypt ${string}`);
    }

    const result = CryptoJS.AES.encrypt(
      string,
      process.env.CRYPTO_KEY
    ).toString();

    if (!result) {
      throw new Error(`Cannot encrypt string ${string}`);
    }

    return result;
  });

export const decrypt = functions
  .runWith({ enforceAppCheck: true })
  .region("europe-west3")
  .https.onCall((string: string) => {
    if (!process.env.CRYPTO_KEY) {
      throw new Error(`Missing key to decrypt ${string}`);
    }

    const result = CryptoJS.AES.decrypt(
      string,
      process.env.CRYPTO_KEY
    ).toString(CryptoJS.enc.Utf8);

    if (!result) {
      throw new Error(`Cannot decrypt string ${string}`);
    }

    return result;
  });
