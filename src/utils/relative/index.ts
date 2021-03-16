import firebase from "firebase/app";

import { db, DocumentData } from "config/firebase";
import {
  IFirebaseSubRelative,
  ISubRelative,
  RelativeType,
} from "config/relative";

export const cleanName = (name: string) => {
  return name.replace(/[^\p{L}]+/u, "-");
};

export const cleanSubRelatives = (
  subRelatives: IFirebaseSubRelative[]
): ISubRelative[] => {
  return subRelatives
    .map(({ relative, type }) => ({
      id: relative.id,
      type: RelativeType[type] as keyof typeof RelativeType,
    }))
    .filter(({ id, type }) => id && type);
};

export const relativeDoc = (id: string) => {
  return db.doc(`relatives/${id}`);
};

export const relativeData = (id: string) => {
  return relativeDoc(id)
    .get()
    .then((doc) => doc.data());
};

export const linkParentAndChild = ({
  parentDoc,
  childDoc,
}: {
  parentDoc: DocumentData;
  childDoc: DocumentData;
}) => {
  parentDoc.update({
    children: firebase.firestore.FieldValue.arrayUnion({
      type: RelativeType.blood,
      relative: childDoc,
    }),
  });

  childDoc.update({
    parents: firebase.firestore.FieldValue.arrayUnion({
      type: RelativeType.blood,
      relative: parentDoc,
    }),
  });
};

export const linkSiblings = ({
  sibling1,
  sibling2,
  type,
}: {
  type: RelativeType;
  sibling1: DocumentData;
  sibling2: DocumentData;
}) => {
  sibling1.update({
    siblings: firebase.firestore.FieldValue.arrayUnion({
      type,
      relative: sibling2,
    }),
  });

  sibling2.update({
    siblings: firebase.firestore.FieldValue.arrayUnion({
      type,
      relative: sibling1,
    }),
  });
};

export const linkSpouses = ({
  spouse1,
  spouse2,
  type,
}: {
  type: RelativeType;
  spouse1: DocumentData;
  spouse2: DocumentData;
}) => {
  spouse1.update({
    spouses: firebase.firestore.FieldValue.arrayUnion({
      type,
      relative: spouse2,
    }),
  });

  spouse2.update({
    spouses: firebase.firestore.FieldValue.arrayUnion({
      type,
      relative: spouse1,
    }),
  });
};
