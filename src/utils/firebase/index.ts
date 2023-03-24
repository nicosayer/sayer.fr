import { FirebaseOptions, initializeApp } from "firebase/app";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
import { getAuth } from "firebase/auth";
import {
  addDoc as firestoreAddDoc,
  CollectionReference,
  DocumentReference,
  DocumentSnapshot,
  FirestoreDataConverter,
  initializeFirestore,
  QuerySnapshot,
  SnapshotOptions,
  Timestamp,
  UpdateData,
  updateDoc as firestoreUpdateDoc,
  WithFieldValue,
} from "firebase/firestore";
import { getFunctions } from "firebase/functions";
import { getStorage } from "firebase/storage";

if (window.location.hostname === "localhost") {
  // @ts-ignore
  window.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
}

const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyDKUdxvqC_0Nb8KXitDLijpCLqhGTGiTcU",
  authDomain: "home-sayer-fr.firebaseapp.com",
  projectId: "home-sayer-fr",
  storageBucket: "home-sayer-fr.appspot.com",
  messagingSenderId: "845978010592",
  appId: "1:845978010592:web:ceec0d2e1329e54892e185",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = initializeFirestore(app, { ignoreUndefinedProperties: true });
const storage = getStorage(app);
const functions = getFunctions(app, "europe-west3");
const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider("6Ld27OsjAAAAAC6T__xbD0Szvn1yogbKXcNqV-vN"),
  isTokenAutoRefreshEnabled: true,
});

export { auth, db, functions, storage, appCheck };

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

export const spreadQuerySnapshot = (
  query: QuerySnapshot,
  options?: SnapshotOptions
) => {
  return query.docs.map((doc) => spreadSnapshot(doc, options));
};

export const addDoc = <T>(
  reference: CollectionReference<T>,
  data: WithFieldValue<T>
) => {
  return firestoreAddDoc<T>(reference, {
    // @ts-ignore
    ...data,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
};

export const updateDoc = <T>(
  reference: DocumentReference<T>,
  data: UpdateData<T>
) => {
  return firestoreUpdateDoc<T>(reference, {
    // @ts-ignore
    ...data,
    updatedAt: Timestamp.now(),
  });
};
