import { FindOnePet, FindOnePetRepository, Pet } from "./find-one-pet-protocols";

export class FindOnePetAdapter implements FindOnePet {
  constructor(private findOnePetRepository: FindOnePetRepository) {}

  async handle(name: string): Promise<void | Pet> {
    const pet = await this.findOnePetRepository.handle(name);
    return pet;
  }
}
