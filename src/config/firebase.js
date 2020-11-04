import firebase from "firebase/app";
import "firebase/auth";
import "firebase/storage";
import "firebase/firestore";

const config = {
  apiKey: "AIzaSyCyqmq4oCytwbsPQEztqa724K6f2DiEL4U",
  authDomain: "sayer-fr.firebaseapp.com",
  databaseURL: "https://sayer-fr.firebaseio.com",
  projectId: "sayer-fr",
  storageBucket: "gs://sayer-fr.appspot.com",
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

export const auth = firebase.auth;
export const storage = firebase.storage();
export const db = firebase.firestore();
