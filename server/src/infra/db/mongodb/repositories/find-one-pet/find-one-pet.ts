import { FindOnePetRepository, Pet, MongoHelper } from "./find-one-pet-protocols";

export class FindOnePetMongoRepository implements FindOnePetRepository {
  async handle(name: string): Promise<void | Pet> {
    const petsCollection = await MongoHelper.getCollection("pets");
    const pet = await petsCollection.findOne({ name });
    
    if (typeof pet !== "undefined") {
      return pet as unknown as Pet;
    }

    return;
  }
}
