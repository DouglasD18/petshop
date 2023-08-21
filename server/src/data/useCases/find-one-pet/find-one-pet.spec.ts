import { FindOnePetAdapter } from "./find-one-pet";
import { FindOnePetRepository, Kind, Pet, PetCreated } from "./find-one-pet-protocols";

const NAME = "Chani";

const PET: Pet = {
  name: NAME,
  age: 3,
  kind: Kind.CAT,
  breed: "any_dog_breed",
  owner: {
    name: "any_owner_name",
    contact: "(99)99999-9999",
    address: "any_owner_address"
  }
}

interface SutTypes {
  sut: FindOnePetAdapter
  findOnePetRepository: FindOnePetRepository
}

const makeFindOnePetRepository = (): FindOnePetRepository => {
  class FindOnePetRepositoryStub implements FindOnePetRepository {
    handle(name: string): Promise<Pet> {
      return new Promise(resolve => resolve(PET));
    }
  }

  return new FindOnePetRepositoryStub();
}

const makeSut = (): SutTypes => {
  const findOnePetRepository = makeFindOnePetRepository();
  const sut = new FindOnePetAdapter(findOnePetRepository);

  return {
    sut,
    findOnePetRepository
  }
}

describe("FindOnePet Adapter", () => {
  it("Should call FindOnePetRepository with correct values", async  () => {
    const { sut, findOnePetRepository } = makeSut();

    const FindOnePetRepositorySpy = jest.spyOn(findOnePetRepository, "handle");
    await sut.handle(NAME);

    expect(FindOnePetRepositorySpy).toHaveBeenCalledWith(NAME);
  })

  it("Should throw if FindOnePetRepository throws", async  () => {
    const { sut, findOnePetRepository } = makeSut();

    jest.spyOn(findOnePetRepository, "handle").mockReturnValueOnce(
      new Promise((_r, reject) => reject(new Error()))
    );
    const promise = sut.handle(NAME);

    await expect(promise).rejects.toThrow()
  })

  it("Should throw if FindOnePetRepository throws", async  () => {
    const { sut, findOnePetRepository } = makeSut();

    jest.spyOn(findOnePetRepository, "handle").mockReturnValueOnce(
      new Promise(resolve => resolve())
    );
    const result = await sut.handle(NAME);

    expect(result).toBeUndefined();
  })

  it("Should return the correct value on success", async () => {
    const { sut } = makeSut();

    const result = await sut.handle(NAME);

    expect(result).toEqual(PET);
  })
});