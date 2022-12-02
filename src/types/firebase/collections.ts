import { DocumentReference } from "firebase/firestore";

export enum Collection {
  boards = "boards",
  credentials = "credentials",
}

export interface BoardDocument {
  id?: string;
  ref?: DocumentReference<BoardDocument>;
  name?: string;
  users?: string[];
}
