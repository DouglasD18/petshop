import { FindOnePetMongoRepository } from "./find-one-pet";
import { Pet, Kind, MongoHelper } from "./find-one-pet-protocols";

const NAME = "any_dog_name";

const PET: Pet = {
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

const sut = new FindOnePetMongoRepository();

describe("FindOnePetMongoRepository", () => {
  beforeAll(async () => {
    await MongoHelper.connect();
    const accountCollection = await MongoHelper.getCollection("pets");
    await accountCollection.insertOne(PET);
  })

  afterAll(async () => {
    const accountCollection = await MongoHelper.getCollection("pets");
    await accountCollection.deleteMany({});
    await MongoHelper.disconnect();
  })

  it("Should return an pet on success", async () => {
    const pet = await sut.handle(NAME);

    expect(pet).toBeTruthy();
  })

  it("Should return void if Pet is not found", async () => {
    const pet = await sut.handle("Chani");

    expect(pet).toBeNull();
  })

  it("Should return an pet with correct properties", async () => {
    const pet = await sut.handle(NAME);

    expect(pet).toEqual(PET);
  })
})