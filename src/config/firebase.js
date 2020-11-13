import { ENV } from "config/enums";
import firebase from "firebase/app";
import {
  REACT_APP_FIREBASE_EMULATOR,
  REACT_APP_FIREBASE_API_KEY,
  REACT_APP_FIREBASE_AUTH_DOMAIN,
  REACT_APP_FIREBASE_PROJECT_ID,
  REACT_APP_FIREBASE_DATABASE_URL,
} from "config/env";
import "firebase/auth";
import "firebase/firestore";
import "firebase/functions";
import { testEnv } from "utils";

const config = {
  apiKey: REACT_APP_FIREBASE_API_KEY,
  authDomain: REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: REACT_APP_FIREBASE_DATABASE_URL,
  projectId: REACT_APP_FIREBASE_PROJECT_ID,
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

if (testEnv(REACT_APP_FIREBASE_EMULATOR) && process.env.NODE_ENV === ENV.DEV) {
  firebase.functions().useEmulator("localhost", 5001);
}

export const auth = firebase.auth;
export const db = firebase.firestore();
export const functions = firebase.functions;
