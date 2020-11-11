import { auth } from "config/firebase";
import { logError } from "utils";

export const loginWithGoogle = () => {
  const provider = new auth.GoogleAuthProvider();
  auth().signInWithRedirect(provider).catch(logError);
};

export const logout = () => {
  auth()
    .signOut()
    .then(() => {
      window.location.reload();
    })
    .catch(logError);
};
