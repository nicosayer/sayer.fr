import firebase from "firebase";

const config = {
  apiKey: "AIzaSyCyqmq4oCytwbsPQEztqa724K6f2DiEL4U",
  authDomain: "sayer-fr.firebaseapp.com",
  databaseURL: "https://sayer-fr.firebaseio.com",
  projectId: "sayer-fr",
};

firebase.initializeApp(config);

export const auth = firebase.auth;
export const db = firebase.firestore();
