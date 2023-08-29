import { Kind, Pet, PetCreated } from "../../../domain/models";
import { DeletePetAdapter } from "./delete-pet";
import { DeletePetRepository, FindOnePetRepository } from "./delete-pet-protocols";

const NAME = "Killua";

const PET: Pet = {
  name: "Killua",
  age: 2,
  kind: Kind.CAT,
  breed: "Zodiac",
  owner: {
    name: "Gon Freecs",
    contact: "(88)88888-8888",
    address: "Ilha da baleia"
  }
}

const PET_CREATED: PetCreated = {
  ...PET,
  id: "any_id"
}

interface SutTypes {
  sut: DeletePetAdapter,
  deletePetRepository: DeletePetRepository,
  findOnePetRepository: FindOnePetRepository
}

const makeFindOnePetRepository = (): FindOnePetRepository => {
  class FindOnePetRepositoryStub implements FindOnePetRepository {
    handle(name: string): Promise<PetCreated> {
      return new Promise(resolve => resolve(PET_CREATED));
    }
  }

  return new FindOnePetRepositoryStub();
}

const makeDeletePetRepositoryStub = (): DeletePetRepository => {
  class DeletePetRepositoryStub implements DeletePetRepository {
    handle(id: string): Promise<void> {
      return new Promise(resolve => resolve());
    }
    
  }

  return new DeletePetRepositoryStub();
}

const makeSut = (): SutTypes => {
  const findOnePetRepository = makeFindOnePetRepository();
  const deletePetRepository = makeDeletePetRepositoryStub();
  const sut = new DeletePetAdapter(deletePetRepository, findOnePetRepository);

  return {
    sut,
    deletePetRepository,
    findOnePetRepository
  }
}

describe("DeletePet Adapter", () => {
  it("Should call FindOnePetRepository with correct values", async  () => {
    const { sut, findOnePetRepository } = makeSut();

    const FindOnePetRepositorySpy = jest.spyOn(findOnePetRepository, "handle");
    await sut.handle(NAME);

    expect(FindOnePetRepositorySpy).toHaveBeenCalledWith(NAME);
  });

  it("Should throw if FindOnePetRepository return false", async () => {
    const { sut, findOnePetRepository } = makeSut();

    jest.spyOn(findOnePetRepository, "handle").mockReturnValue(new Promise(resolve => resolve()));
    const promise = sut.handle(NAME);

    await expect(promise).rejects.toThrow();
  });

  it("Should throw if FindOnePetRepository throws", async  () => {
    const { sut, findOnePetRepository } = makeSut();

    jest.spyOn(findOnePetRepository, "handle").mockReturnValueOnce(
      new Promise((_r, reject) => reject(new Error()))
    );
    const promise = sut.handle(NAME);

    await expect(promise).rejects.toThrow();
  });

  it("Should call DeletePetRepository with correect values", async () => {
    const { sut, deletePetRepository } = makeSut();

    const repositoryStub = jest.spyOn(deletePetRepository, "handle");
    await sut.handle(NAME);

    expect(repositoryStub).toHaveBeenCalledWith("any_id");
  });

  it("Should throw if DeletePetRepository throws", async () => {
    const { sut, deletePetRepository } = makeSut();

    jest.spyOn(deletePetRepository, "handle").mockReturnValueOnce(
      new Promise((_r, reject) => reject(new Error()))
    );
    const promise = sut.handle(NAME);

    await expect(promise).rejects.toThrow()
  });

  it("Should return void if Pet is Deleted", async () => {
    const { sut } = makeSut();

    const response = await sut.handle(NAME);

    expect(response).toBeFalsy();
  })
});