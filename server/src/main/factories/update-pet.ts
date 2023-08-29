import { UpdatePetAdapter } from "../../data/useCases/update-pet/update-pet";
import { FindOnePetMongoRepository } from "../../infra/db/mongodb/repositories/find-one-pet/find-one-pet";
import { UpdatePetMongoRepository } from "../../infra/db/mongodb/repositories/update-pet/update-pet";
import { UpdatePetController } from "../../presentation/controllers/update-pet/update-pet";
import { OwnerValidatorAdapter } from "../../validation/validators/owner-validator/owner-validator";
import { PetValidatorAdapter } from "../../validation/validators/pet-validator/pet-validator";

export const makeUpdatePetController = (): UpdatePetController => {
  const updatePetRepository = new UpdatePetMongoRepository();
  const findOnePetRepository = new FindOnePetMongoRepository();
  const updatePet = new UpdatePetAdapter(updatePetRepository, findOnePetRepository);
  const ownerValidator = new OwnerValidatorAdapter();
  const petValidator = new PetValidatorAdapter(ownerValidator);
  return new UpdatePetController(updatePet, petValidator);
}
