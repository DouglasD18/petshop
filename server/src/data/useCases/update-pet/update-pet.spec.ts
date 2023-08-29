import { UpdatePetAdapter } from "./update-pet";
import { FindOnePetRepository, Kind, NotFoundError, Pet, PetCreated, UpdatePayload, UpdatePetRepository } from "./update-pet-protocols";

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

const updatePayload: UpdatePayload = {
  name: "Killua",
  pet: PET
}

interface SutTypes {
  sut: UpdatePetAdapter,
  updatePetRepository: UpdatePetRepository,
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

const makeUpdatePetRepositoryStub = (): UpdatePetRepository => {
  class UpdatePetRepositoryStub implements UpdatePetRepository {
    handle(data: PetCreated): Promise<void> {
      return new Promise(resolve => resolve());
    }
    
  }

  return new UpdatePetRepositoryStub();
}

const makeSut = (): SutTypes => {
  const findOnePetRepository = makeFindOnePetRepository();
  const updatePetRepository = makeUpdatePetRepositoryStub();
  const sut = new UpdatePetAdapter(updatePetRepository, findOnePetRepository);

  return {
    sut,
    updatePetRepository,
    findOnePetRepository
  }
}

describe("UpdatePet Adapter", () => {
  it("Should call FindOnePetRepository with correct values", async  () => {
    const { sut, findOnePetRepository } = makeSut();

    const FindOnePetRepositorySpy = jest.spyOn(findOnePetRepository, "handle");
    await sut.handle(updatePayload);

    expect(FindOnePetRepositorySpy).toHaveBeenCalledWith(NAME);
  });

  it("Should throw if FindOnePetRepository return false", async () => {
    const { sut, findOnePetRepository } = makeSut();

    jest.spyOn(findOnePetRepository, "handle").mockReturnValue(new Promise(resolve => resolve()));
    const promise = sut.handle(updatePayload);

    await expect(promise).rejects.toThrow();
  });

  it("Should throw if FindOnePetRepository throws", async  () => {
    const { sut, findOnePetRepository } = makeSut();

    jest.spyOn(findOnePetRepository, "handle").mockReturnValueOnce(
      new Promise((_r, reject) => reject(new Error()))
    );
    const promise = sut.handle(updatePayload);

    await expect(promise).rejects.toThrow();
  });

  it("Should call UpdatePetRepository with correect values", async () => {
    const { sut, updatePetRepository } = makeSut();

    const repositoryStub = jest.spyOn(updatePetRepository, "handle");
    await sut.handle(updatePayload);

    expect(repositoryStub).toHaveBeenCalledWith(PET_CREATED);
  });

  it("Should throw if UpdatePetRepository throws", async () => {
    const { sut, updatePetRepository } = makeSut();

    jest.spyOn(updatePetRepository, "handle").mockReturnValueOnce(
      new Promise((_r, reject) => reject(new Error()))
    );
    const promise = sut.handle(updatePayload);

    await expect(promise).rejects.toThrow()
  });

  it("Should return void if Pet is updated", async () => {
    const { sut } = makeSut();

    const response = await sut.handle(updatePayload);

    expect(response).toBeFalsy();
  })
});