import { OwnerValidator, Validated } from "../../protocols";
import { PetValidatorAdapter } from "./pet-validator";
import { Kind, Owner, Pet } from "../../../domain/models";
import { InvalidParamError, MissingParamError } from "../../../presentation/errors";

const missingParamMessage = (param: string): string =>
  (`Pet ${param} is required`);

const invalidParamMessage = (param: string, type: string): string =>
  (`Pet ${param} must be a ${type}`);

const lengthError = (param: string): string =>
  (`Pet ${param} must have length between 3 and 100`);

const OWNER: Owner = {
  name: "any_owner",
  contact: "(88)99999-9999",
  address: "any_beauty_address"
}

const PET: Pet = {
  name: "any_pet_name",
  age: 0,
  kind: Kind.CAT,
  breed: "any_pet_breed",
  owner: OWNER
}

const OWNER_VALIDATED: Validated = {
  isValid: true,
  error: new Error()
}

interface SutTypes {
  sut: PetValidatorAdapter
  ownerValidatorStub: OwnerValidator
}

const makeOwnerValidatorStub = (): OwnerValidator => {
  class OwnerValidatorStub implements OwnerValidator {
    handle(owner: Owner): Validated {
      return OWNER_VALIDATED;
    }
  }

  return new OwnerValidatorStub();
}

const makeSut = (): SutTypes => {
  const ownerValidatorStub = makeOwnerValidatorStub();
  const sut = new PetValidatorAdapter(ownerValidatorStub);

  return {
    sut,
    ownerValidatorStub
  }
}

describe("PetValidator Adapter", () => {
  it("Should retrun InvalidParamError if breed is is decimal", () => {
    const { sut } = makeSut();
    const pet: Pet = {
      name: PET.name,
      age: 2.5,
      kind: PET.kind,
      breed: PET.breed,
      owner: PET.owner
    }

    const result = sut.handle(pet);

    expect(result.isValid).toBe(false);
    expect(result.error).toEqual(new InvalidParamError("age", invalidParamMessage("age", "integer")));
  })

  it("Should retrun InvalidParamError if breed is negative", () => {
    const { sut } = makeSut();
    const pet: Pet = {
      name: PET.name,
      age: -2,
      kind: PET.kind,
      breed: PET.breed,
      owner: PET.owner
    }

    const result = sut.handle(pet);

    expect(result.isValid).toBe(false);
    expect(result.error).toEqual(new InvalidParamError("age", invalidParamMessage("age", "number positive")));
  })

  it("Should retrun InvalidParamError if breed is too large", () => {
    const { sut } = makeSut();
    const pet: Pet = {
      name: PET.name,
      age: 2,
      kind: PET.kind,
      breed: "kdjfefnwruvburhgwr devrds sfdbrbremfvjnvubeufvwe wrfgbuwrg5gurhvijdvjie8gfr dvnirhg8ewhgiOHIRGLNHEIRRITGHNGN CERBGUWRG7cgfbxbefyegfyfhbhcbebf gbruhgidhjvndbajvbjrbgusbdv",
      owner: PET.owner
    }

    const result = sut.handle(pet);

    expect(result.isValid).toBe(false);
    expect(result.error).toEqual(new InvalidParamError("breed", lengthError("breed")));
  })

  it("Should retrun InvalidParamError if name is too small", () => {
    const { sut } = makeSut();
    const pet: Pet = {
      name: "ow",
      age: 2,
      kind: PET.kind,
      breed: PET.breed,
      owner: PET.owner
    }

    const result = sut.handle(pet);

    expect(result.isValid).toBe(false);
    expect(result.error).toEqual(new InvalidParamError("name", lengthError("name")));
  })

  it("Should call OwnerValidator with the correct value", () => {
    const { sut, ownerValidatorStub } = makeSut();

    const ownerValidatorStubSpy = jest.spyOn(ownerValidatorStub, "handle");
    sut.handle(PET);

    expect(ownerValidatorStubSpy).toHaveBeenCalledWith(OWNER);
  })

  it("Should return false with OwnerValidator returns false too", () => {
    const { sut, ownerValidatorStub } = makeSut();

    const OWNER_RETURN: Validated = {
      isValid: false,
      error: new InvalidParamError("contact", "Owner contact must the correct format")
    }

    jest.spyOn(ownerValidatorStub, "handle").mockReturnValue(OWNER_RETURN);
    const result = sut.handle(PET);

    expect(result).toEqual(OWNER_RETURN);
  })

  it("Should return true if all parameters are right", () => {
    const { sut } = makeSut();

    const result = sut.handle(PET);

    expect(result.isValid).toBe(true);
  })
});