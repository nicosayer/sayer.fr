import firebase from "firebase/app";

export const cleanDoc = (
  doc: firebase.firestore.DocumentSnapshot
): {
  uid: string;
  ref: firebase.firestore.DocumentReference;
  [key: string]: any;
} => {
  return { uid: doc.id, ref: doc.ref, ...doc.data() };
};

export const cleanSnapshot = (
  snapshot:
    | firebase.firestore.DocumentSnapshot
    | firebase.firestore.QuerySnapshot
) => {
  if (snapshot instanceof firebase.firestore.QuerySnapshot) {
    return snapshot.docs
      .map((doc) => {
        return cleanDoc(doc);
      })
      .filter(Boolean);
  }

  return cleanDoc(snapshot);
};
