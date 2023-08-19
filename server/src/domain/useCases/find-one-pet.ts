import { Pet } from "../models";

export interface FindOnePet {
  handle(name: string): Promise<Pet | void>;
}
