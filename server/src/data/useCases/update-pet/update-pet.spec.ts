import { UpdatePetAdapter } from "./update-pet";
import { Kind, NotFoundError, UpdatePayload, UpdatePetRepository } from "./update-pet-protocols";

const updatePayload: UpdatePayload = {
  name: "Killua",
  pet: {
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
}

interface SutTypes {
  sut: UpdatePetAdapter,
  updatePetRepository: UpdatePetRepository
}

const makeUpdatePetRepositoryStub = (): UpdatePetRepository => {
  class UpdatePetRepositoryStub implements UpdatePetRepository {
    handle(data: UpdatePayload): Promise<boolean> {
      return new Promise(resolve => resolve(true));
    }
    
  }

  return new UpdatePetRepositoryStub();
}

const makeSut = (): SutTypes => {
  const updatePetRepository = makeUpdatePetRepositoryStub();
  const sut = new UpdatePetAdapter(updatePetRepository);

  return {
    sut,
    updatePetRepository
  }
}

describe("UpdatePet Adapter", () => {
  it("Should call UpdatePetRepository with correect values", async () => {
    const { sut, updatePetRepository } = makeSut();

    const repositoryStub = jest.spyOn(updatePetRepository, "handle");
    await sut.handle(updatePayload);

    expect(repositoryStub).toHaveBeenCalledWith(updatePayload);
  });

  /*
  it("Should throw if UpdatePetRepository return false", async () => {
    const { sut, updatePetRepository } = makeSut();

    jest.spyOn(updatePetRepository, "handle").mockReturnValue(new Promise(resolve => resolve(false)));
    const response = await sut.handle(updatePayload);

    expect(response).toThrowError(new NotFoundError("Pet"));
  });
  */

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