import { Pet } from "./pet";

export interface UpdatePayload {
  name: string,
  pet: Pet
}