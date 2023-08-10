import { OwnerValidatorAdapter } from "./owner-validator"
import { InvalidParamError, MissingParamError } from "./owner-validator-protocols";

const sut = new OwnerValidatorAdapter();

const NAME_LENGTH_ERROR = "Owner name must have length between 3 and 100";
const ADDRESS_LENGTH_ERROR = "Owner length must have length between 12 and 250"

describe("OwnerValidator Adapter", () => {
  it("Should return a MissingParamError if name is no provided", () => {
    const validated = sut.handle({ contact: "(11)99999-9999", address: "any_address", name: "" });

    expect(validated.isValid).toBe(false);
    expect(validated.error).toEqual(new MissingParamError("name", "Owner name is required"));
  });

  it("Should return a MissingParamError if contact is no provided", () => {
    const validated = sut.handle({ contact: "", address: "any_address", name: "owner" });

    expect(validated.isValid).toBe(false);
    expect(validated.error).toEqual(new MissingParamError("contact", "Owner contact is required"));
  });

  it("Should return a MissingParamError if address is no provided", () => {
    const validated = sut.handle({ contact: "(11)99999-9999", address: "", name: "owner" });

    expect(validated.isValid).toBe(false);
    expect(validated.error).toEqual(new MissingParamError("address", "Owner address is required"));
  });

  it("Should return a InvalidParamError if name is invalid", () => {
    const validated = sut.handle({ contact: "(11)99999-9999", address: "any_address_", name: "ow" });

    expect(validated.isValid).toBe(false);
    expect(validated.error).toEqual(new InvalidParamError("name", NAME_LENGTH_ERROR));
  });

  it("Should return a InvalidParamError if contact is invalid", () => {
    const validated = sut.handle({ contact: "(11)9999-9999", address: "any_address_", name: "owner" });

    expect(validated.isValid).toBe(false);
    expect(validated.error).toEqual(new InvalidParamError("contact", "Owner contact must the correct format"));
  });

  it("Should return a InvalidParamError if address is invalid", () => {
    const validated = sut.handle({ contact: "(11)99999-9999", address: "any_address", name: "owner" });

    expect(validated.isValid).toBe(false);
    expect(validated.error).toEqual(new InvalidParamError("address", ADDRESS_LENGTH_ERROR));
  });
})