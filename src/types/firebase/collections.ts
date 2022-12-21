import { DocumentReference } from "firebase/firestore";

export enum Collection {
  boards = "boards",
  credentials = "credentials",
  creditCards = "creditCards",
  documents = "documents",
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
  ref?: DocumentReference<BoardDocument>;
  name?: string;
  url?: string;
  username?: string;
  password?: string;
  tag?: string;
}

export interface CreditCardDocument {
  id?: string;
  ref?: DocumentReference<BoardDocument>;
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
  ref?: DocumentReference<BoardDocument>;
  name?: string;
  mime?: Mime;
  tag?: string;
}
