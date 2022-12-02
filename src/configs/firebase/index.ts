import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { FirestoreDataConverter, getFirestore } from "firebase/firestore";

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

// TODO: Put back on
// setPersistence(auth, inMemoryPersistence);

export { auth, db };

export const firestoreConverter: FirestoreDataConverter<any> = {
  toFirestore(data) {
    const { id: _id, ref: _ref, ...rest } = data;
    return rest;
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);

    return {
      ...data,
      id: snapshot.id,
      ref: snapshot.ref,
    };
  },
};
