import { Kind, Pet } from "../../../domain/models";
import { FindOnePetController } from "./find-one-pet";
import { FindOnePet, HttpRequest, InvalidParamError, MissingParamError, NotFoundError } from "./find-one-pet-protocols";
import { ServerError } from '../../errors/server-error';

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

const HTTP_RESQUEST: HttpRequest = {
  body: {
    name: PET.name
  }
}

interface SutTypes {
  sut: FindOnePetController,
  findOnePetStub: FindOnePet
}

const makeFindOnePet = (): FindOnePet => {
  class FindOnePetStub implements FindOnePet {
    handle(name: string): Promise<void | Pet> {
      return new Promise(resolve => resolve(PET));
    }
  }

  return new FindOnePetStub();
}

const makeSut = (): SutTypes => {
  const findOnePetStub = makeFindOnePet();
  const sut = new FindOnePetController(findOnePetStub);

  return {
    sut,
    findOnePetStub
  }
}

describe("FindOnePet Controller", () => {
  it("Should return 400 if no name is provided", async () => {
      const { sut } = makeSut();
    const httpResquest = {
      body: {
        id: "adhuhiwenno"
      }
    }

    const httpResponse = await sut.handle(httpResquest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("name", "Name is required!"));
  });

  it("Should return 400 if name is not a string", async () => {
    const { sut } = makeSut();
    const httpResquest = {
      body: {
        name: 53
      }
    }

    const httpResponse = await sut.handle(httpResquest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new InvalidParamError("name", "Name must be a string"));
  });

  it("Should call FindOne with name", async () => {
    const { sut, findOnePetStub } = makeSut();
    
    const findOnePetSpy = jest.spyOn(findOnePetStub, "handle");
    await sut.handle(HTTP_RESQUEST);

    const { body } = HTTP_RESQUEST;

    expect(findOnePetSpy).toHaveBeenCalledWith(body.name);
  });

  it("Should return 404 if FindOne returns void", async () => {
    const { sut, findOnePetStub } = makeSut();
    
    jest.spyOn(findOnePetStub, "handle").mockReturnValue(new Promise(resolve => resolve()));
    const httpResponse = await sut.handle(HTTP_RESQUEST);

    expect(httpResponse.statusCode).toBe(404);
    expect(httpResponse.body).toEqual(new NotFoundError("Pet"));
  });

  it("Should return 500 if FindOne throws", async () => {
    const { sut, findOnePetStub } = makeSut();
    
    jest.spyOn(findOnePetStub, "handle").mockReturnValue(new Promise((_resolve, rejects) => rejects()));
    const httpResponse = await sut.handle(HTTP_RESQUEST);

    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  it("Should return 200 on success", async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle(HTTP_RESQUEST);

    expect(httpResponse.statusCode).toBe(200);
    expect(httpResponse.body).toEqual(PET);
  });
});