import { Pet } from "../models";

export interface UpdatePet {
  handle(name: string, pet: Pet): Promise<void>
}
