import { PetValidator, OwnerValidator, Pet, Validated, MissingParamError, InvalidParamError } from "./pet-validator-protocols";

export class PetValidatorAdapter implements PetValidator {
  constructor(private ownerValidator: OwnerValidator) {}

  handle(data: Pet): Validated {
    const name = data.name.trim();
    const breed = data.breed.trim();
    const kind = data.kind.trim();
    const { owner, age } = data;

    if (name.length === 0) {
      return {
        isValid: false,
        error: new MissingParamError("name", "Pet name is required")
      }
    } if (breed.length === 0) {
      return {
        isValid: false,
        error: new MissingParamError("breed", "Pet breed is required")
      }
    } if (kind.length === 0) {
      return {
        isValid: false,
        error: new MissingParamError("kind", "Pet kind is required")
      }
    } if (!owner) {
      return {
        isValid: false,
        error: new MissingParamError("owner", "Pet owner is required")
      }
    } 

    const ownerResult = this.ownerValidator.handle(owner);
    if (!ownerResult.isValid) {
      return ownerResult;
    }

    if (name.length < 3 || name.length > 100) {
      return {
        isValid: false,
        error: new InvalidParamError("name", "Pet name must have length between 3 and 100")
      }
    } if (breed.length < 3 || breed.length > 100) {
      return {
        isValid: false,
        error: new InvalidParamError("breed", "Pet breed must have length between 3 and 100")
      }
    } if (kind !== "cat" && kind !== "dog") {
      return {
        isValid: false,
        error: new InvalidParamError("kind", "Pet kind must be cat or dog")
      }
    } if (age < 0) {
      return {
        isValid: false,
        error: new InvalidParamError("age", "Pet age must be a positive number")
      }
    } if (!Number.isInteger(age)) {
      return {
        isValid: false,
        error: new InvalidParamError("age", "Pet age must be a integer number")
      }
    }

    return {
      isValid: true
    }
  }
}
