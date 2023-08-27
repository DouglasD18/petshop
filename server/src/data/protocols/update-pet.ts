import { UpdatePayload } from "../../domain/models";

export interface UpdatePetRepository {
  handle(data: UpdatePayload): Promise<boolean>;
}
