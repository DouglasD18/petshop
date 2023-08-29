import { FindAllPetsMongoRepository } from "./find-all-pets";
import { MongoHelper } from "./find-all-pets-protocols";

const PET = {
  name: "any_dog_name",
  age: 3,
  kind: "dog",
  breed: "any_dog_breed",
  owner: {
    name: "any_owner_name",
    contact: "(99)99999-9999",
    address: "any_owner_address"
  }
}

const sut = new FindAllPetsMongoRepository();

describe("FindAllPetsMongoRepository", () => {
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

  it("Should return pets on success", async () => {
    const pets = await sut.handle();

    expect(pets).toBeTruthy();
  })

  it("Should return void if table is empty", async () => {
    const accountCollection = await MongoHelper.getCollection("pets");
    await accountCollection.deleteMany({});

    const pet = await sut.handle();
    

    expect(pet).toBeFalsy();
  })

  it("Should return pets with correct properties", async () => {
    const accountCollection = await MongoHelper.getCollection("pets");
    await accountCollection.insertOne(PET);
    
    const pets = await sut.handle();

    expect(pets).toEqual([{
      name: "any_dog_name",
      age: 3,
      kind: "dog",
      breed: "any_dog_breed",
      owner: {
        name: "any_owner_name",
        contact: "(99)99999-9999",
        address: "any_owner_address"
      }
    }]);
  })
})