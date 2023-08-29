import { Kind } from "../../../../../domain/models";
import { DeletePetMongoRepository } from "./delete-pet";
import { MongoHelper } from "./delete-pet-protocols";

const PET = {
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

const sut = new DeletePetMongoRepository();

describe("DeletePetMongoRepository", () => {
  beforeAll(async () => {
    await MongoHelper.connect();
  })

  afterAll(async () => {
    await MongoHelper.disconnect();
  })

  beforeEach(async () => {
    const accountCollection = await MongoHelper.getCollection("pets");
    await accountCollection.insertOne(PET);
  })

  afterEach(async () => {
    const accountCollection = await MongoHelper.getCollection("pets");
    await accountCollection.deleteMany({})
  })

  it("Should delete the Pet", async () => {
    const accountCollection = await MongoHelper.getCollection("pets");
    const pet = await accountCollection.findOne({ name: PET.name });
    
    const id = pet !== null ? pet._id : "";
    
    await sut.handle(id.toString());

    const deleted = await accountCollection.findOne({ name: "any_dog_name" });
    expect(deleted).toBeFalsy();
  })

  it("Should delete existing pets", async () => {
    await sut.handle("123456789012345678901234");

    const accountCollection = await MongoHelper.getCollection("pets");
    const pet = await accountCollection.findOne({ name: "any_dog_name" });

    expect(pet).toBeTruthy;
  })
});