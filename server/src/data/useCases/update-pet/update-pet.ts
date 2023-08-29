import { UpdatePet, UpdatePetRepository, UpdatePayload, NotFoundError, FindOnePetRepository } from "./update-pet-protocols";

export class UpdatePetAdapter implements UpdatePet {
  constructor(
    private updatePetRepository: UpdatePetRepository,
    private findOnePetRepository: FindOnePetRepository
  ) {}

  async handle(data: UpdatePayload): Promise<void> {
    const pet = await this.findOnePetRepository.handle(data.name);
    
    if (!pet) {
      throw new NotFoundError("Pet");
    }

    const id = pet.id;
    await this.updatePetRepository.handle({ id, ...data.pet })
  }
  
}
