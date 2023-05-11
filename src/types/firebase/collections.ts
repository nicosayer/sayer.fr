import { DocumentReference, Timestamp } from "firebase/firestore";

export enum Collection {
  boards = "boards",
  credentials = "credentials",
  creditCards = "creditCards",
  documents = "documents",
  groceries = "groceries",
  lists = "lists",
  listItems = "listItems",
  notes = "notes",
  tasks = "tasks",
}

export interface BoardDocument {
  id?: string;
  ref?: DocumentReference<BoardDocument>;
  name?: string;
  users?: string[];
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface CredentialDocument {
  id?: string;
  ref?: DocumentReference<CredentialDocument>;
  name?: string;
  url?: string;
  username?: string;
  password?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface CreditCardDocument {
  id?: string;
  ref?: DocumentReference<CreditCardDocument>;
  name?: string;
  cardholder?: string;
  number?: string;
  lastDigits?: string;
  expirationMonth?: string;
  expirationYear?: string;
  securityCode?: string;
  color?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export enum DocumentMime {
  Png = "image/png",
  Jpeg = "image/jpeg",
  Pdf = "application/pdf",
}

export interface DocumentDocument {
  id?: string;
  ref?: DocumentReference<DocumentDocument>;
  name?: string;
  mime?: DocumentMime;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface GroceryDocument {
  id?: string;
  ref?: DocumentReference<GroceryDocument>;
  name?: string;
  openedAt?: Timestamp;
  openedBy?: string;
  closedAt?: Timestamp;
  closedBy?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface ListDocument {
  id?: string;
  ref?: DocumentReference<ListDocument>;
  name?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface ListItemDocument {
  id?: string;
  ref?: DocumentReference<ListItemDocument>;
  name?: string;
  checked?: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface NoteDocument {
  id?: string;
  ref?: DocumentReference<NoteDocument>;
  name?: string;
  base64?: string;
  text?: string;
  date?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface TaskDocument {
  id?: string;
  ref?: DocumentReference<TaskDocument>;
  name?: string;
  openedAt?: Timestamp;
  openedBy?: string;
  closedAt?: Timestamp;
  closedBy?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}
