import { FindOnePetAdapter } from "../../data/useCases/find-one-pet/find-one-pet";
import { FindOnePetMongoRepository } from "../../infra/db/mongodb/repositories/find-one-pet/find-one-pet";
import { FindOnePetController } from "../../presentation/controllers/find-one-pet/find-one-pet";

export const makeFindOnePetController = (): FindOnePetController => {
  const FindOnePetRepository = new FindOnePetMongoRepository();
  const findOnePet = new FindOnePetAdapter(FindOnePetRepository);
  return new FindOnePetController(findOnePet);
}
