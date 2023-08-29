import { FindOnePetRepository, Pet, MongoHelper, PetCreated } from "./find-one-pet-protocols";

export class FindOnePetMongoRepository implements FindOnePetRepository {
  async handle(name: string): Promise<void | PetCreated> {
    const petsCollection = await MongoHelper.getCollection("pets");
    const pet = await petsCollection.findOne({ name });
    
    if (pet !== null) {
      const id = pet._id.toString();
      pet.id = id;
      return pet as unknown as PetCreated;
    }

    return;
  }
}
