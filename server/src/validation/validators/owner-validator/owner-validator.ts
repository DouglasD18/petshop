import { validateOwnerSchema } from "../../schemas/owner-schema";
import { InvalidParamError, MissingParamError, Owner, OwnerValidator, Validated } from "./owner-validator-protocols";

export class OwnerValidatorAdapter implements OwnerValidator {

  handle(data: Owner): Validated {
    const result = validateOwnerSchema(data);

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
      isValid: result.success,
      error: new Error()
    }
  }

}
