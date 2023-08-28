import { PetCreated } from "../../domain/models";

export interface FindOnePetRepository {
  handle(name: string): Promise<PetCreated | void>;
}
