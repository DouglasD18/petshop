import { Pet } from "../../domain/models";

export interface FindAllPetsRepository {
  handle(): Promise<Pet[] | void>;
}
