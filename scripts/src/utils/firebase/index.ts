import { cert, initializeApp, ServiceAccount } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

import * as fs from "fs";
import * as path from "path";

const SERVICE_ACCOUNT_PATH = "../../service-account.json";

export const getFirebase = async () => {
  const file = fs.readFileSync(path.resolve(__dirname, SERVICE_ACCOUNT_PATH));
  const serviceAccount = JSON.parse(file.toString());
  initializeApp({
    credential: cert(serviceAccount as ServiceAccount),
  });

  const auth = getAuth();
  const db = getFirestore();
  const storage = getStorage();

  db.settings({ ignoreUndefinedProperties: true });

  return { auth, db, storage };
};

export const spreadDocumentData = <T>(
  document:
    | FirebaseFirestore.QueryDocumentSnapshot
    | FirebaseFirestore.DocumentSnapshot
) => {
  const data = document.data();

  return { ...data, id: document.id, ref: document.ref } as T;
};

export const spreadDocumentsData = (
  documents: FirebaseFirestore.QuerySnapshot
) => {
  return documents.docs.map(spreadDocumentData);
};
