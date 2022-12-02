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

export interface CredentialDocument {
  id?: string;
  ref?: DocumentReference<BoardDocument>;
  name?: string;
  url?: string;
  username?: string;
  password?: string;
}
