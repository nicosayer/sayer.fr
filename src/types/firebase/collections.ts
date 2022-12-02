export enum Collection {
  boards = "boards",
}

export interface BoardDocument {
  id?: string;
  name?: string;
  users?: string[];
}
