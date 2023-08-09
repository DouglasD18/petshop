import { Pet } from "../../domain/models";
import { Validated } from "./validated";

export interface PetValidator {
  handle(pet: Pet): Validated;
}
