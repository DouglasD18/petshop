import { ObjectId } from "mongodb";
import { UpdatePetRepository, PetCreated, MongoHelper } from "./update-pet-protocols";

export class UpdatePetMongoRepository implements UpdatePetRepository {
  async handle(data: PetCreated): Promise<boolean> {
    const { id } = data;
    const { age, name, breed, kind, owner } = data;

    const petsCollection = await MongoHelper.getCollection("pets");
    const result = await petsCollection.findOneAndUpdate({ _id: new ObjectId(id) }, { $set: { age, name, breed, kind, owner }}, { upsert: true });
    
    if (!result.value) {
      return false;
    }
    
    return true;
  }
}