import { FindAllPetsController } from "../../presentation/controllers/find-all-pets/find-all-pets"
import { FindAllPetsAdapter } from '../../data/useCases/find-all-pets/find-all-pets';
import { FindAllPetsMongoRepository } from '../../infra/db/mongodb/repositories/find-all-pets/find-all-pets';


export const makeFindAllPetsController = (): FindAllPetsController => {
  const findAllPetsRepository = new FindAllPetsMongoRepository();
  const findAllPets = new FindAllPetsAdapter(findAllPetsRepository);
  return new FindAllPetsController(findAllPets);
}