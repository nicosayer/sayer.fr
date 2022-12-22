import { DocumentReference } from "firebase/firestore";

export enum Collection {
  boards = "boards",
  credentials = "credentials",
  creditCards = "creditCards",
  documents = "documents",
  notes = "notes",
  tasks = "tasks",
  groceries = "groceries",
}

export interface BoardDocument {
  id?: string;
  ref?: DocumentReference<BoardDocument>;
  name?: string;
  users?: string[];
  tags?: string[];
}

export interface CredentialDocument {
  id?: string;
  ref?: DocumentReference<CredentialDocument>;
  name?: string;
  url?: string;
  username?: string;
  password?: string;
  tag?: string;
}

export interface CreditCardDocument {
  id?: string;
  ref?: DocumentReference<CreditCardDocument>;
  name?: string;
  cardholder?: string;
  number?: string;
  expirationMonth?: string;
  expirationYear?: string;
  securityCode?: string;
  color?: string;
  tag?: string;
}

export enum Mime {
  Png = "image/png",
  Jpeg = "image/jpeg",
  Pdf = "application/pdf",
}

export interface DocumentDocument {
  id?: string;
  ref?: DocumentReference<DocumentDocument>;
  name?: string;
  mime?: Mime;
  tag?: string;
}

export interface GroceryDocument {
  id?: string;
  ref?: DocumentReference<GroceryDocument>;
  name?: string;
  openDate?: string;
  closeDate?: string;
  order?: number;
  closedBy?: string;
  tag?: string;
}

export interface NoteDocument {
  id?: string;
  ref?: DocumentReference<NoteDocument>;
  name?: string;
  content?: string;
  date?: string;
  tag?: string;
}

export interface TaskDocument {
  id?: string;
  ref?: DocumentReference<TaskDocument>;
  description?: string;
  order?: number;
  done?: boolean;
  tag?: string;
}
