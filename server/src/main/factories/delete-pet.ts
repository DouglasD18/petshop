import { DeletePetAdapter } from "../../data/useCases/delete-pet/delete-pet";
import { DeletePetMongoRepository } from "../../infra/db/mongodb/repositories/delete-pet/delete-pet";
import { FindOnePetMongoRepository } from "../../infra/db/mongodb/repositories/find-one-pet/find-one-pet";
import { DeletePetController } from "../../presentation/controllers/delete-pet/delete-pet";

export const makeDeletePetController = (): DeletePetController => {
  const deletePetRepository = new DeletePetMongoRepository();
  const findOnePetRepository = new FindOnePetMongoRepository();
  const deletePet = new DeletePetAdapter(deletePetRepository, findOnePetRepository);
  return new DeletePetController(deletePet);
}
