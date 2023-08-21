import { Pet } from "../../domain/models";

export interface FindOnePetRepository {
  handle(name: string): Promise<Pet | void>;
}
