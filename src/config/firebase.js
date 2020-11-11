import { ENV } from "config/enums";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/functions";

const config = {
  apiKey: "AIzaSyDonP87rw7qNm073e_usZRG-E-eIb6ntIc",
  authDomain: "sayer-fr-covid.firebaseapp.com",
  databaseURL: "https://sayer-fr-covid.firebaseio.com",
  projectId: "sayer-fr-covid",
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

if (process.env.NODE_ENV === ENV.DEV) {
  firebase.functions().useEmulator("localhost", 5001);
}

export const auth = firebase.auth;
export const db = firebase.firestore();
export const functions = firebase.functions;
