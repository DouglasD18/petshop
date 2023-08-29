import { UpdatePetMongoRepository } from "./update-pet";
import { Kind, MongoHelper } from "./update-pet-protocols";

const pet = {
  name: "any_dog_name",
  age: 3,
  kind: Kind.DOG,
  breed: "any_dog_breed",
  owner: {
    name: "any_owner_name",
    contact: "(99)99999-9999",
    address: "any_owner_address"
  }
}

const sut = new UpdatePetMongoRepository();

describe("UpdatePetMongoRepository", () => {
  beforeAll(async () => {
    await MongoHelper.connect();
  })

  afterAll(async () => {
    const accountCollection = await MongoHelper.getCollection("pets");
    await accountCollection.deleteMany({});
    await MongoHelper.disconnect();
  })

  beforeEach(async () => {
    const accountCollection = await MongoHelper.getCollection("pets")
    await accountCollection.deleteMany({})
  })

  it("Should return true on success", async () => {
    const accountCollection = await MongoHelper.getCollection("pets");
    const { insertedId } = (await accountCollection.insertOne(pet));
    const response = await sut.handle({ id: insertedId.toString(), ...pet });

    expect(response).toBe(true);
  })

  it("Should return false if pet is not found", async () => {
    const accountCollection = await MongoHelper.getCollection("pets");
    await accountCollection.insertOne(pet);

    const response = await sut.handle({ id: "123456789012345678901234", ...pet });

    expect(response).toBe(false);
  })
});