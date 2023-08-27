import { Pet, Kind } from "../../../domain/models"
import { UpdatePetController } from "./update-pet"
import { HttpRequest, Validated, UpdatePet, PetValidator, MissingParamError, InvalidParamError, NotFoundError, ServerError } from "./update-pet-protocols"
import { UpdatePayload } from '../../../domain/models';

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

const PARAMS = {
  name: PET.name
}

const BODY = {
  pet: PET
}

const HTTP_RESQUEST: HttpRequest = {
  params: PARAMS,
  body: BODY
}

const VALIDATED: Validated = {
  isValid: true,
  error: new Error()
}

interface SutTypes {
  sut: UpdatePetController
  updatePetStub: UpdatePet
  petValidatorStub: PetValidator
}

const makeUpdatePetStub = (): UpdatePet => {
  class UpdatePetStub implements UpdatePet {
    handle(data: UpdatePayload): Promise<void> {
      return new Promise(resolve => resolve());
    }
  }

  return new UpdatePetStub();
}

const makePetValidatorStub = (): PetValidator => {
  class PetValidatorStub implements PetValidator {
    handle(pet: Pet): Validated {
      return(VALIDATED);
    }
  }

  return new PetValidatorStub();
}

const makeSut = (): SutTypes => {
  const petValidatorStub = makePetValidatorStub();
  const updatePetStub = makeUpdatePetStub();
  const sut = new UpdatePetController(updatePetStub, petValidatorStub);

  return {
    sut,
    updatePetStub,
    petValidatorStub
  }
}

describe("UpdatePet Controller", () => {
  it("Should return 400 if no name is provided", async () => {
    const { sut } = makeSut();
    const httpResquest: HttpRequest = {
      params: {},
      body: BODY
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
      },
      body: BODY
    }

    const httpResponse = await sut.handle(httpResquest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new InvalidParamError("name", "Name must be a string"));
  });

  it("Should call PetValidator with correct values", async () => {
    const { sut, petValidatorStub } = makeSut();

    const petValidatorSpy = jest.spyOn(petValidatorStub, "handle");
    await sut.handle(HTTP_RESQUEST);

    expect(petValidatorSpy).toHaveBeenCalledWith(PET);
  });

  it('Should return 400 if any param is no provided', async () => {
    const { sut, petValidatorStub } = makeSut();

    const validated: Validated = {
      isValid: false,
      error: new MissingParamError("name", "Owner name is required")
    }

    jest.spyOn(petValidatorStub, "handle").mockReturnValue(validated);
    const httpResponse = await sut.handle(HTTP_RESQUEST);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('name', "Owner name is required"));
  });

  it('Should return 400 if any param is invalid', async () => {
    const { sut, petValidatorStub } = makeSut();

    const validated: Validated = {
      isValid: false,
      error: new InvalidParamError("age", "'age' must be a number")
    }

    jest.spyOn(petValidatorStub, "handle").mockReturnValue(validated);
    const httpResponse = await sut.handle(HTTP_RESQUEST);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new InvalidParamError("age", "'age' must be a number"));
  });


  it("Should call update with correct values", async () => {
    const { sut, updatePetStub } = makeSut();
    
    const updatePetSpy = jest.spyOn(updatePetStub, "handle");
    await sut.handle(HTTP_RESQUEST);

    const { name } = HTTP_RESQUEST.params;
    const { pet } = HTTP_RESQUEST.body;
    const updatePayload = { name, pet }

    expect(updatePetSpy).toHaveBeenCalledWith(updatePayload);
  });

  it("Should return 404 if Update returns NotFoundError", async () => {
    const { sut, updatePetStub } = makeSut();
    
    jest.spyOn(updatePetStub, "handle").mockImplementationOnce(() => {
      throw new NotFoundError("Pet");
    });
    const httpResponse = await sut.handle(HTTP_RESQUEST);

    expect(httpResponse.statusCode).toBe(404);
    expect(httpResponse.body).toEqual(new NotFoundError("Pet"));
  });


  it("Should return 500 if Update throws", async () => {
    const { sut, updatePetStub } = makeSut();
    
    jest.spyOn(updatePetStub, "handle").mockReturnValue(new Promise((_resolve, rejects) => rejects()));
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