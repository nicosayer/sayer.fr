import { DocumentReference, Timestamp } from "firebase/firestore";

export enum Collection {
  boards = "boards",
  chores = "chores",
  credentials = "credentials",
  creditCards = "creditCards",
  documents = "documents",
  groceries = "groceries",
  lists = "lists",
  listItems = "listItems",
  notes = "notes",
  todos = "todos",
  users = "users",
}

export interface BoardDocument {
  id?: string;
  ref?: DocumentReference<BoardDocument>;
  name?: string;
  users?: string[];
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export enum ChoreUnit {
  Day = "DAY",
  Week = "WEEK",
  Month = "MONTH",
}

export interface ChoreDocument {
  id?: string;
  ref?: DocumentReference<CredentialDocument>;
  name?: string;
  startDate?: string;
  lastDoneDate?: string;
  frequency?: number;
  unit?: ChoreUnit;
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

export enum ListItemStatus {
  Empty = "EMPTY",
  Indeterminate = "INDETERMINATE",
  Checked = "CHECKED",
}

export interface ListItemDocument {
  id?: string;
  ref?: DocumentReference<ListItemDocument>;
  name?: string;
  status?: ListItemStatus;
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

export interface TodoDocument {
  id?: string;
  ref?: DocumentReference<TodoDocument>;
  name?: string;
  openedAt?: Timestamp;
  openedBy?: string;
  closedAt?: Timestamp;
  closedBy?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface UserDocument {
  id?: string;
  ref?: DocumentReference<UserDocument>;
  name?: string;
}
