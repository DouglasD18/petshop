import { z } from "zod";
import { Kind, Pet } from "../../domain/models";

const lengthError = (param: string): string => (`Pet ${param} must have length between 3 and 100`);

const PetSchema = z.object({
  name: z.string({
    required_error: "Pet name is required",
    invalid_type_error: "Pet name must be a string",
  }).min(3, lengthError("name")).max(100, lengthError("name")),
  age: z.number({
    required_error: "Pet age is required",
    invalid_type_error: "Pet age must be a number",
  }).int("Pet age must be a integer").nonnegative("Pet age must be a number positive"),
  breed: z.string({
    required_error: "Pet breed is required",
    invalid_type_error: "Pet breed must be a string",
  }).min(3, lengthError("breed")).max(100, lengthError("breed")),
  kind: z.nativeEnum(Kind).describe("Pet kind must be cat or dog")
});

export const validatePetSchema = (data: Pet) => PetSchema.safeParse(data);
