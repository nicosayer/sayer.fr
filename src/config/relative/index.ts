import { DateType } from "config/date";

export interface IFirebaseSubRelative {
  relative: { id: string };
  type: number;
}

export interface IFirebaseRelative {
  firstName: string;
  lastName: string;
  gender: number;
  parents: IFirebaseSubRelative[];
  siblings: IFirebaseSubRelative[];
  spouses: IFirebaseSubRelative[];
  children: IFirebaseSubRelative[];
  birthDate: DateType;
  deathDate: DateType;
}

export enum RelativeType {
  blood,
  married,
  divorced,
  adopted,
  half,
}

export enum GenderType {
  male,
  female,
}

export interface ISubRelative {
  id: string;
  type: keyof typeof RelativeType;
}

export type IRelative = {
  id: string;
  firstName: string;
  lastName: string;
  gender: keyof typeof GenderType;
  parents: ISubRelative[];
  siblings: ISubRelative[];
  spouses: ISubRelative[];
  children: ISubRelative[];
  birthYear: number | null;
  deathYear: number | null;
};

export interface ISearchableRelative {
  id: string;
  name: string;
}
