import { Pet, PetCreated } from "../../domain/models";

export interface CreatePetRepository {
  handle(pet: Pet): Promise<PetCreated>;
}