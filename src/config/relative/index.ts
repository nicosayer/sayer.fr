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

export interface IRelative {
  id: string;
  firstName: string;
  lastName: string;
  gender: keyof typeof GenderType;
  parents: ISubRelative[];
  siblings: ISubRelative[];
  spouses: ISubRelative[];
  children: ISubRelative[];
}

export interface ISearchableRelative {
  id: string;
  name: string;
}
