import { Controller, CreatePet, HttpRequest, HttpResponse, PetValidator, badRequest, created, serverError } from "./create-pet-protocols";

export class CreatePetController implements Controller {
  constructor(
    private readonly createPet: CreatePet,
    private readonly petValidator: PetValidator
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const pet = httpRequest.body;

      const validation = this.petValidator.handle(pet);

      if (!validation.isValid) {
        return badRequest(validation.error);
      }

      const { id } = await this.createPet.handle(pet);
      return created(id);
    } catch (error) {
      return serverError();
    }
  }

}
