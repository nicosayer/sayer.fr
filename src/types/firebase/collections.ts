import { DocumentReference, Timestamp } from "firebase/firestore";

export enum Collection {
  boards = "boards",
  credentials = "credentials",
  creditCards = "creditCards",
  documents = "documents",
  groceries = "groceries",
  notes = "notes",
  souvenirs = "souvenirs",
  souvenirPictures = "souvenirPictures",
  tasks = "tasks",
}

export interface BoardDocument {
  id?: string;
  ref?: DocumentReference<BoardDocument>;
  name?: string;
  users?: string[];
  tags?: string[];
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
  tag?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
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
  tag?: string;
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
  tag?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface NoteDocument {
  id?: string;
  ref?: DocumentReference<NoteDocument>;
  name?: string;
  content?: string;
  date?: string;
  tag?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface SouvenirDocument {
  id?: string;
  ref?: DocumentReference<SouvenirDocument>;
  description?: string;
  date?: string;
  tag?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export enum SouvenirPictureMime {
  Png = "image/png",
  Jpeg = "image/jpeg",
}

export interface SouvenirPictureDocument {
  id?: string;
  ref?: DocumentReference<SouvenirPictureDocument>;
  mime?: SouvenirPictureMime;
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
  tag?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}
