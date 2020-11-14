import { auth } from "config/firebase";
import { logError } from "utils";

export const loginWithGoogle = (): void => {
  const provider = new auth.GoogleAuthProvider();
  auth().signInWithRedirect(provider).catch(logError);
};

export const logout = (): void => {
  auth()
    .signOut()
    .then(() => {
      window.location.reload();
    })
    .catch(logError);
};
