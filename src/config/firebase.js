import firebase from "firebase/app";
import "firebase/auth";
import "firebase/storage";
import "firebase/firestore";

const config = {
  apiKey: "AIzaSyDonP87rw7qNm073e_usZRG-E-eIb6ntIc",
  authDomain: "sayer-fr-covid.firebaseapp.com",
  databaseURL: "https://sayer-fr-covid.firebaseio.com",
  projectId: "sayer-fr-covid",
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

export const auth = firebase.auth;
export const storage = firebase.storage();
export const db = firebase.firestore();
