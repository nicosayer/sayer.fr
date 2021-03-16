import firebase from "firebase/app";
import "firebase/auth";
import "firebase/storage";
import "firebase/firestore";

const config = {
  apiKey: "AIzaSyC9ZYWZtUwwl19ZXhR65sxvT5K6B_PXwrE",
  authDomain: "sayer-fr-family.firebaseapp.com",
  databaseURL: "https://sayer-fr-family.firebaseio.com",
  projectId: "sayer-fr-family",
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

export type DocumentData = Record<string, any>;
export const auth = firebase.auth;
export const db = firebase.firestore();
