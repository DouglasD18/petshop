import { Controller, UpdatePet, PetValidator, HttpRequest, HttpResponse, badRequest, MissingParamError, InvalidParamError, noContent, notFound, serverError } from "./update-pet-protocols";

export class UpdatePetController implements Controller {
  constructor(
    private updatePet: UpdatePet,
    private petValidator: PetValidator
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const { name } = httpRequest.params;
    const { pet } = httpRequest.body;
    
    if (!name) {
      return badRequest(new MissingParamError("name", "Name is required!"));
    } else if (typeof name !== "string") {
      return badRequest(new InvalidParamError("name", "Name must be a string"));
    }

    const validation = this.petValidator.handle(pet);

    if (!validation.isValid) {
      return badRequest(validation.error!);
    }
    
    try {
      const updatePayload = { name, pet };
      await this.updatePet.handle(updatePayload);

      return noContent();
    } catch (e) {
      if (e instanceof Error && e.name === "NotFoundError") {
        return notFound("Pet");
      }

      return serverError();
    }
  }
  
}
