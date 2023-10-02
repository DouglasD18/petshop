export enum Kind {
  CAT = 'cat',
  DOG = 'dog'
}

export interface Owner {
  name: string;
  contact: string;
  address: string;
}

export interface Pet {
  name: string;
  age: number;
  kind: Kind;
  breed: string;
  owner: Owner;
}
