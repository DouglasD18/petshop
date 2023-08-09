import { Owner } from "./owner";

export enum Kind {
  CAT = 'cat',
  DOG = 'dog'
}

export interface Pet {
  name: string;
  age: number;
  kind: Kind;
  breed: string;
  owner: Owner;
}

export interface PetCreated extends Pet {
  id: string;
}
