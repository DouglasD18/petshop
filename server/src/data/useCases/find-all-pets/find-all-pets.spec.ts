import { FindAllPetsAdapter } from "./find-all-pets";
import { Pet, Kind, FindAllPetsRepository } from "./find-all-pets-protocols";

const PET: Pet = {
  name: "Chani",
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
  sut: FindAllPetsAdapter
  findAllPetsRepository: FindAllPetsRepository
}

const makeFindAllPetsRepository = (): FindAllPetsRepository => {
  class FindAllPetsRepositoryStub implements FindAllPetsRepository {
    handle(): Promise<void | Pet[]> {
      return new Promise(resolve => resolve([PET]));
    }
  }

  return new FindAllPetsRepositoryStub();
}

const makeSut = (): SutTypes => {
  const findAllPetsRepository = makeFindAllPetsRepository();
  const sut = new FindAllPetsAdapter(findAllPetsRepository);

  return {
    sut,
    findAllPetsRepository
  }
}

describe("FindAllPets Adapter", () => {
  it("Should call FindAllPetsRepository", async  () => {
    const { sut, findAllPetsRepository } = makeSut();

    const FindAllPetsRepositorySpy = jest.spyOn(findAllPetsRepository, "handle");
    await sut.handle();

    expect(FindAllPetsRepositorySpy).toHaveBeenCalled();
  })

  it("Should throw if FindAllPetsRepository throws", async  () => {
    const { sut, findAllPetsRepository } = makeSut();

    jest.spyOn(findAllPetsRepository, "handle").mockReturnValueOnce(
      new Promise((_r, reject) => reject(new Error()))
    );
    const promise = sut.handle();

    await expect(promise).rejects.toThrow()
  })

  it("Should return the correct value on success", async () => {
    const { sut } = makeSut();

    const result = await sut.handle();

    expect(result).toEqual([PET]);
  })
});