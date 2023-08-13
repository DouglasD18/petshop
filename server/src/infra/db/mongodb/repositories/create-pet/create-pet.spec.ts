import { CreatePetMongoRepository } from "./create-pet";
import { Kind, MongoHelper, Owner, Pet } from "./create-pet-protocols";

const OWNER: Owner = {
  name: "any_owner_name",
  contact: "(99)99999-9999",
  address: "any_owner_address"
}

const PET: Pet = {
  name: "any_dog_name",
  age: 3,
  kind: Kind.DOG,
  breed: "any_dog_breed",
  owner: OWNER
}

const sut = new CreatePetMongoRepository();

describe("CreatePetMongoRepository", () => {
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

  it("Should return an pet on success", async () => {
    const pet = await sut.handle(PET);

    expect(pet).toBeTruthy();
  })

  it("Should return an pet with correct properties", async () => {
    const pet = await sut.handle(PET);

    expect(pet.name).toBe(PET.name);
    expect(pet.age).toBe(PET.age)
    expect(pet.breed).toBe(PET.breed);
    expect(pet.kind).toBe(PET.kind);
    expect(pet.owner).toEqual(PET.owner);
  })

  it("Should return an pet with id", async () => {
    const pet = await sut.handle(PET);

    expect(pet.id).toBeTruthy();
  })
})