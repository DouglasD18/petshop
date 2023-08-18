import { CreatePetAdapter } from "../../data/useCases/create-pet/create-pet";
import { CreatePetMongoRepository } from "../../infra/db/mongodb/repositories/create-pet/create-pet";
import { CreatePetController } from "../../presentation/controllers/create-pet/create-pet";
import { OwnerValidatorAdapter } from "../../validation/validators/owner-validator/owner-validator";
import { PetValidatorAdapter } from "../../validation/validators/pet-validator/pet-validator";

export const makeCreatePetController = (): CreatePetController => {
  const createPetRepository = new CreatePetMongoRepository();
  const createPet = new CreatePetAdapter(createPetRepository);
  const ownerValidator = new OwnerValidatorAdapter();
  const petValidator = new PetValidatorAdapter(ownerValidator);
  return new CreatePetController(createPet, petValidator);
}
