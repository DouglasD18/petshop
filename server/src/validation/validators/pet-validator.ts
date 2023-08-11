import { Pet } from "../../domain/models";
import { InvalidParamError, MissingParamError } from "../../presentation/errors";
import { OwnerValidator, PetValidator, Validated } from "../protocols";
import { validatePetSchema } from '../schemas/pet-schema';

export class PetValidatorAdapter implements PetValidator {
  constructor(private ownerValidator: OwnerValidator) {}

  handle(data: Pet): Validated {
    const { owner } = data;

    const ownerResult = this.ownerValidator.handle(owner);
    if (!ownerResult.isValid) {
      return ownerResult;
    }

    const result = validatePetSchema(data);
    if (!result.success) {
      const { error: { errors } } = result;
      const firtError = errors[0];
      const secondError = errors[1];

      if (firtError.message.includes("is required")) {
        const { message, path } = firtError;
        const param = path[0] as string;

        return {
          isValid: result.success,
          error: new MissingParamError(param, message)
        }
      } else if (typeof secondError !== "undefined" && secondError.message.includes("is required")) {
        const { message, path } = secondError;
        const param = path[0] as string;

        return {
          isValid: result.success,
          error: new MissingParamError(param, message)
        }
      }
      const { message, path } = firtError;
      const param = path[0] as string;

      return {
        isValid: result.success,
        error: new InvalidParamError(param, message)
      }
    }

    return {
      isValid: true,
      error: new Error()
    }
  }
}
