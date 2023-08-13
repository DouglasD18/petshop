import { Owner, Pet, Kind, PetCreated } from "../../../domain/models"
import { MissingParamError, InvalidParamError } from "../../errors";
import { CreatePetController } from "./create-pet";
import { CreatePet, PetValidator, Validated, serverError } from "./create-pet-protocols"

const OWNER: Owner = {
  name: "any_owner_name",
  contact: "any_contact",
  address: "any_address"
}

const PET: Pet = {
  name: "any_pet_name",
  age: 2,
  kind: Kind.CAT,
  breed: "any_cat_breed",
  owner: OWNER
}

const PET_CREATED: PetCreated = {
  id: "any_id",
  ...PET
}

const VALIDATED: Validated = {
  isValid: true,
  error: new Error()
}

interface SutTypes {
  sut: CreatePetController
  createPetStub: CreatePet
  petValidatorStub: PetValidator
}

const makeCreatePetStub = (): CreatePet => {
  class CreatePetStub implements CreatePet {
    handle(data: Pet): Promise<PetCreated> {
      return new Promise(resolve => resolve(PET_CREATED));
    }
  }

  return new CreatePetStub();
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
  const createPetStub = makeCreatePetStub();
  const sut = new CreatePetController(createPetStub, petValidatorStub);

  return {
    sut,
    createPetStub,
    petValidatorStub
  }
}

describe('CreatePet Controller', () => {
  it("Should call PetValidator with correct values", async () => {
    const { sut, petValidatorStub } = makeSut();
    const httpRequest = {
      body: PET
    }

    const petValidatorSpy = jest.spyOn(petValidatorStub, "handle");
    await sut.handle(httpRequest);

    expect(petValidatorSpy).toHaveBeenCalledWith(PET);
  });

  it('Should return 400 if any param is no provided', async () => {
    const { sut, petValidatorStub } = makeSut();
    const httpRequest = {
      body: PET
    }

    const validated: Validated = {
      isValid: false,
      error: new MissingParamError("name", "Owner name is required")
    }

    jest.spyOn(petValidatorStub, "handle").mockReturnValue(validated);
    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('name', "Owner name is required"));
  });

  it('Should return 400 if any param is invalid', async () => {
    const { sut, petValidatorStub } = makeSut();
    const httpRequest = {
      body: PET
    }

    const validated: Validated = {
      isValid: false,
      error: new InvalidParamError("age", "'age' must be a number")
    }

    jest.spyOn(petValidatorStub, "handle").mockReturnValue(validated);
    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new InvalidParamError("age", "'age' must be a number"));
  });

  it("Should call CreatePet with correct values", async () => {
    const { sut, createPetStub } = makeSut();
    const httpRequest = {
      body: PET
    }

    const createPetSpy = jest.spyOn(createPetStub, "handle");
    await sut.handle(httpRequest);

    expect(createPetSpy).toHaveBeenCalledWith(PET);
  });

  it('Should return 500 if any dependencie throws', async () => {
    const { sut, petValidatorStub } = makeSut();
    const httpRequest = {
      body: PET
    }
    
    jest.spyOn(petValidatorStub, "handle").mockImplementationOnce(() => {
      throw new Error();
    })
    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(serverError());
  });

  it('Should return 201 if valid values is provided.', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: PET
    }
    
    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(201);
    expect(httpResponse.body).toEqual(PET_CREATED.id);
  });
});
