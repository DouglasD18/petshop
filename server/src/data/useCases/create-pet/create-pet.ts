import { CreatePet, CreatePetRepository, Pet, PetCreated } from "./create-pet-protocols";

export class CreatePetAdapter implements CreatePet  {

  constructor(private createPetRepository: CreatePetRepository) {}

  async handle(data: Pet): Promise<PetCreated> {
    const petCreated = await this.createPetRepository.handle(data);

    return petCreated;
  }

}