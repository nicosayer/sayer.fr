import { initializeApp } from "firebase/app";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
import { getAuth, inMemoryPersistence, setPersistence } from "firebase/auth";
import {
  DocumentSnapshot,
  FirestoreDataConverter,
  getFirestore,
  SnapshotOptions,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";

if (window.location.hostname === "localhost") {
  // @ts-ignore
  window.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
}

const firebaseConfig = {
  apiKey: "AIzaSyDKUdxvqC_0Nb8KXitDLijpCLqhGTGiTcU",
  authDomain: "home-sayer-fr.firebaseapp.com",
  projectId: "home-sayer-fr",
  storageBucket: "home-sayer-fr.appspot.com",
  messagingSenderId: "845978010592",
  appId: "1:845978010592:web:ceec0d2e1329e54892e185",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider("6Ld27OsjAAAAAC6T__xbD0Szvn1yogbKXcNqV-vN"),
  isTokenAutoRefreshEnabled: true,
});

setPersistence(auth, inMemoryPersistence);

export { auth, db, storage, appCheck };

export const firestoreConverter: FirestoreDataConverter<any> = {
  toFirestore(data) {
    const { id: _id, ref: _ref, ...rest } = data;
    return rest;
  },
  fromFirestore(snapshot, options) {
    return spreadSnapshot(snapshot, options);
  },
};

export const spreadSnapshot = (
  doc: DocumentSnapshot,
  options?: SnapshotOptions
) => {
  return { ...doc.data(options), id: doc.id, ref: doc.ref };
};
