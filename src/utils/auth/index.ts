import { auth } from "config/firebase";

export const loginWithGoogle = (): void => {
  const provider = new auth.GoogleAuthProvider();
  auth().signInWithRedirect(provider);
};

export const logout = (): void => {
  auth().signOut();
};
