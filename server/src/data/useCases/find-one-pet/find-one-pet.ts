import { FindOnePet, FindOnePetRepository, PetCreated } from "./find-one-pet-protocols";

export class FindOnePetAdapter implements FindOnePet {
  constructor(private findOnePetRepository: FindOnePetRepository) {}

  async handle(name: string): Promise<void | PetCreated> {
    const pet = await this.findOnePetRepository.handle(name);
    return pet;
  }
}
