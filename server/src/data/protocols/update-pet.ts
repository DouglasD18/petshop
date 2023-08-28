import { PetCreated } from "../../domain/models";

export interface UpdatePetRepository {
  handle(data: PetCreated): Promise<boolean>;
}
