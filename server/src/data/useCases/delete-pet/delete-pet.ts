import { DeletePet, DeletePetRepository, FindOnePetRepository, NotFoundError } from "./delete-pet-protocols";

export class DeletePetAdapter implements DeletePet {
  constructor(
    private deletePetRepository: DeletePetRepository,
    private findOnePetRepository: FindOnePetRepository
  ) {}

  async handle(name: string): Promise<void> {
    const pet = await this.findOnePetRepository.handle(name);
    
    if (!pet) {
      throw new NotFoundError("Pet");
    }

    const id = pet.id;
    await this.deletePetRepository.handle(id)
  }
}