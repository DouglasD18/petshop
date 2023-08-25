import { FindAllPets, FindAllPetsRepository, Pet } from "./find-all-pets-protocols";

export class FindAllPetsAdapter implements FindAllPets {
  constructor(private findAllPetsRepository: FindAllPetsRepository) {}

  async handle(): Promise<void | Pet[]> {
    const pets = await this.findAllPetsRepository.handle();

    return pets;
  }
  
}