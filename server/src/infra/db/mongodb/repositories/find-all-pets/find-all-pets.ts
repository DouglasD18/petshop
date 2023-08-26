import { FindAllPetsRepository, Pet, MongoHelper } from "./find-all-pets-protocols";

export class FindAllPetsMongoRepository implements FindAllPetsRepository {

  async handle(): Promise<void | Pet[]> {
    const petsCollection = await MongoHelper.getCollection("pets");
    const pets = await petsCollection.find({},  { projection: { _id: 0, name: 1, age: 1, kind: 1, breed: 1, owner: 1 } }).toArray();

    if (!pets[0]) return;

    return pets as unknown as Pet[];
  }
  
}