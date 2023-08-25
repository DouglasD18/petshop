import { CreatePet, CreatePetRepository, Pet, PetCreated } from "./create-pet-protocols";

export class CreatePetAdapter implements CreatePet  {

  constructor(private createPetRepository: CreatePetRepository) {}

  async handle(data: Pet): Promise<PetCreated> {
    const { name, age, breed, owner, kind } = data;
    
    const petCreated = await this.createPetRepository.handle({ name, age, breed, kind, owner });

    return petCreated;
  }

}