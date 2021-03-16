import { db } from "config/firebase";
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
