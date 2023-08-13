import { CreatePetAdapter } from "./create-pet";
import { CreatePetRepository, Kind, Pet, PetCreated } from "./create-pet-protocols";
import { Owner } from '../../../domain/models/owner';

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

const PET_CREATED: PetCreated = {
  id: "any_id",
  name: PET.name,
  age: PET.age,
  kind: PET.kind,
  breed: PET.breed,
  owner: PET.owner
}

interface SutTypes {
  sut: CreatePetAdapter
  createPetRepository: CreatePetRepository
}

const makeCreatePetRepository = (): CreatePetRepository => {
  class CreatePetRepositoryStub implements CreatePetRepository {
    handle(pet: Pet): Promise<PetCreated> {
      return new Promise(resolve => resolve(PET_CREATED));
    }
  }

  return new CreatePetRepositoryStub();
}

const makeSut = (): SutTypes => {
  const createPetRepository = makeCreatePetRepository();
  const sut = new CreatePetAdapter(createPetRepository);

  return {
    sut,
    createPetRepository
  }
}

describe("CreatePet Adapter", () => {
  it("Should call CreatePetRepository with correct values", async  () => {
    const { sut, createPetRepository } = makeSut();

    const createPetRepositorySpy = jest.spyOn(createPetRepository, "handle");
    await sut.handle(PET);

    expect(createPetRepositorySpy).toHaveBeenCalledWith(PET);
  })

  it("Should throw if CreatePetRepository throws", async  () => {
    const { sut, createPetRepository } = makeSut();

    jest.spyOn(createPetRepository, "handle").mockReturnValueOnce(
      new Promise((_r, reject) => reject(new Error()))
    );
    const promise = sut.handle(PET);

    await expect(promise).rejects.toThrow()
  })

  it("Should return the correct value on success", async () => {
    const { sut } = makeSut();

    const result = await sut.handle(PET);

    expect(result).toEqual(PET_CREATED);
  })
});