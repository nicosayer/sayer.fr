import { auth } from "config/firebase";
import { log } from "utils";

export const loginWithGoogle = (): void => {
  const provider = new auth.GoogleAuthProvider();
  auth().signInWithRedirect(provider).catch(log);
};

export const logout = (): void => {
  auth()
    .signOut()
    .then(() => {
      window.location.reload();
    })
    .catch(log);
};
