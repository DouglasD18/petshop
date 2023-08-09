import { Owner } from "../../domain/models";
import { Validated } from "./validated";

export interface OwnerValidator {
  handle(owner: Owner): Validated;
}
