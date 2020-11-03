import { ENV } from "config/enums";
import { auth } from "config/firebase";
import { logError } from "utils";

export const loginWithGoogle = () => {
  auth()
    .setPersistence(
      process.env.NODE_ENV === ENV.DEV
        ? auth.Auth.Persistence.LOCAL
        : auth.Auth.Persistence.NONE
    )
    .then(() => {
      const provider = new auth.GoogleAuthProvider();
      auth().signInWithRedirect(provider).catch(logError);
    })
    .catch(logError);
};

export const logout = () => {
  auth().signOut().catch(logError);
};
