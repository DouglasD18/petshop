import { Pet, Kind } from "../../../domain/models";
import { FindAllPetsController } from "./find-all-pets";
import { FindAllPets, HttpRequest } from "./find-all-pets-protocols";
import { ServerError } from '../../errors';

const HTTP_REQUEST: HttpRequest = {};

const PET: Pet = {
  name: "Chani",
  age: 2,
  kind: Kind.CAT,
  breed: "Vira-lata",
  owner: {
    name: "Douglinhas",
    contact: "(00)99999-9999",
    address: "Bem alí assim"
  }
}

interface SutTypes {
  sut: FindAllPetsController,
  findAllPetsStub: FindAllPets
}

const makeFindAllPets = (): FindAllPets => {
  class FindAllPetsStub implements FindAllPets {
    handle(): Promise<void | Pet[]> {
      return new Promise(resolve => resolve([PET]));
    }
  }

  return new FindAllPetsStub();
}

const makeSut = (): SutTypes => {
  const findAllPetsStub = makeFindAllPets();
  const sut = new FindAllPetsController(findAllPetsStub);

  return {
    sut,
    findAllPetsStub
  }
}

describe("FindAllPets Controller", () => {
  it("Should call FindAll", async () => {
    const { sut, findAllPetsStub} = makeSut();

    const findAllPetsSpy = jest.spyOn(findAllPetsStub, "handle");
    await sut.handle(HTTP_REQUEST);

    expect(findAllPetsSpy).toHaveBeenCalled();
  });

  it("Should throw if FindAll throws", async () => {
    const { sut, findAllPetsStub } = makeSut();

    jest.spyOn(findAllPetsStub, "handle").mockImplementationOnce(() => {
      throw new Error();
    })
    const response = await sut.handle(HTTP_REQUEST);

    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual(new ServerError());
  });

  it("Should return 200 on success", async () => {
    const { sut } = makeSut();

    const response = await sut.handle(HTTP_REQUEST);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([PET]);
  });
});