import { DocumentReference } from "firebase/firestore";

export enum Collection {
  boards = "boards",
  credentials = "credentials",
  documents = "documents",
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

export interface DocumentDocument {
  id?: string;
  ref?: DocumentReference<BoardDocument>;
  type?: string;
  mime?: string;
  owner?: string;
}
