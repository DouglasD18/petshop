import { Pet, PetCreated } from "../models";

export interface CreatePet {
  handle(data: Pet): Promise<PetCreated>;
}
