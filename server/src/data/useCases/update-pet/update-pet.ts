import { UpdatePet, UpdatePetRepository, UpdatePayload, NotFoundError } from "./update-pet-protocols";

export class UpdatePetAdapter implements UpdatePet {
  constructor(private updatePetRepository: UpdatePetRepository) {}

  async handle(data: UpdatePayload): Promise<void> {
    const result = await this.updatePetRepository.handle(data);

    if (!result) {
      throw new NotFoundError("Pet");
    }
  }
  
}
