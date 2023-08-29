import { ObjectId } from "mongodb";
import { UpdatePetRepository, PetCreated, MongoHelper } from "./update-pet-protocols";

export class UpdatePetMongoRepository implements UpdatePetRepository {
  async handle(data: PetCreated): Promise<void> {
    const { id } = data;
    const { age, name, breed, kind, owner } = data;

    const petsCollection = await MongoHelper.getCollection("pets");
    await petsCollection.updateOne({ _id: new ObjectId(id) }, { $set: { age, name, breed, kind, owner }}, { upsert: false });
  }
}