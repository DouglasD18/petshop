import { UpdatePayload } from "../models";

export interface UpdatePet {
  handle(data: UpdatePayload): Promise<void>
}
