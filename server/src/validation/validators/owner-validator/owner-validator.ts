import { InvalidParamError, MissingParamError, Owner, OwnerValidator, Validated } from "./owner-validator-protocols";

const CONTACT_REGEX = /^(?:(?:\+|00)?(55)\s?)?(?:\(?([1-9][0-9])\)?\s?)(?:((?:9\d|[2-9])\d{4})\-?(\d{4}))$/;

export class OwnerValidatorAdapter implements OwnerValidator {

  handle(data: Owner): Validated {
    const name = data.name.trim();
    const contact = data.contact.trim();
    const address = data.address.trim();
    if (name.length === 0) {
      return {
        isValid: false,
        error: new MissingParamError("name", "Owner name is required")
      }
    } if (contact.length === 0) {
      return {
        isValid: false,
        error: new MissingParamError("contact", "Owner contact is required")
      }
    } if (address.length === 0) {
      return {
        isValid: false,
        error: new MissingParamError("address", "Owner address is required")
      }
    }

    if (name.length < 3 || name.length > 100) {
      return {
        isValid: false,
        error: new InvalidParamError("name", "Owner name must have length between 3 and 100")
      }
    } if (!CONTACT_REGEX.test(contact)) {
      return {
        isValid: false,
        error: new InvalidParamError("contact", "Owner contact must have the format (XX)XXXXX-XXXX")
      }
    } if (address.length < 12 || address.length > 250) {
      return {
        isValid: false,
        error: new InvalidParamError("address", "Owner address must have length between 12 and 250")
      }
    }

    return {
      isValid: true
    }
  }

}
