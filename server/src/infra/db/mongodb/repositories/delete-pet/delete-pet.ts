import { ObjectId } from "mongodb";
import { DeletePetRepository, MongoHelper } from "./delete-pet-protocols";

export class DeletePetMongoRepository implements DeletePetRepository {
  async handle(id: string): Promise<void> {
    const petsCollection = await MongoHelper.getCollection("pets");
    await petsCollection.deleteOne({ _id: new ObjectId(id) });
  }
}
