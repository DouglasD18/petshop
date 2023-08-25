import { Pet } from "../models";

export interface FindAllPets {
  handle(): Promise<Pet[] | void>;
}
