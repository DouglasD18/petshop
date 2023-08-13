import { CreatePetRepository, Pet, PetCreated, MongoHelper } from "./create-pet-protocols";

export class CreatePetMongoRepository implements CreatePetRepository {

  async handle(pet: Pet): Promise<PetCreated> {
    const petsCollection = await MongoHelper.getCollection("pets");

    const { insertedId } = await petsCollection.insertOne(pet);

    const petCreated = { id: insertedId.toString(), ...pet };
    return petCreated;
  }

}