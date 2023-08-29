import { DeletePetController } from "./delete-pet"
import { HttpRequest, DeletePet, MissingParamError, InvalidParamError, NotFoundError, ServerError } from "./delete-pet-protocols"

const PARAMS = {
  name: "Chani"
}

const HTTP_RESQUEST: HttpRequest = {
  params: PARAMS,
}

interface SutTypes {
  sut: DeletePetController
  deletePetStub: DeletePet
}

const makeDeletePetStub = (): DeletePet => {
  class DeletePetStub implements DeletePet {
    handle(name: string): Promise<void> {
      return new Promise(resolve => resolve());
    }
  }

  return new DeletePetStub();
}

const makeSut = (): SutTypes => {
  const deletePetStub = makeDeletePetStub();
  const sut = new DeletePetController(deletePetStub);

  return {
    sut,
    deletePetStub
  }
}

describe("DeletePet Controller", () => {
  it("Should return 400 if no name is provided", async () => {
    const { sut } = makeSut();
    const httpResquest: HttpRequest = {
      params: {},
    }

    const httpResponse = await sut.handle(httpResquest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("name", "Name is required!"));
  });

  it("Should return 400 if no name is not a string", async () => {
    const { sut } = makeSut();
    const httpResquest: HttpRequest = {
      params: {
        name: 5
      }
    }

    const httpResponse = await sut.handle(httpResquest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new InvalidParamError("name", "Name must be a string"));
  });


  it("Should call Delete with correct values", async () => {
    const { sut, deletePetStub } = makeSut();
    
    const deletePetSpy = jest.spyOn(deletePetStub, "handle");
    await sut.handle(HTTP_RESQUEST);

    const { name } = HTTP_RESQUEST.params;

    expect(deletePetSpy).toHaveBeenCalledWith(name);
  });

  it("Should return 404 if DeletePet returns NotFoundError", async () => {
    const { sut, deletePetStub } = makeSut();
    
    jest.spyOn(deletePetStub, "handle").mockImplementationOnce(() => {
      throw new NotFoundError("Pet");
    });
    const httpResponse = await sut.handle(HTTP_RESQUEST);

    expect(httpResponse.statusCode).toBe(404);
    expect(httpResponse.body).toEqual(new NotFoundError("Pet"));
  });


  it("Should return 500 if DeletePEt throws", async () => {
    const { sut, deletePetStub } = makeSut();
    
    jest.spyOn(deletePetStub, "handle").mockReturnValue(new Promise((_resolve, rejects) => rejects()));
    const httpResponse = await sut.handle(HTTP_RESQUEST);

    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  it("Should return 204 on success", async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle(HTTP_RESQUEST);

    expect(httpResponse.statusCode).toBe(204);
  });
});