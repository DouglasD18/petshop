import { CreatePet } from "../../../domain/useCases/create-pet";
import { PetValidator } from "../../../validation/protocols";
import { badRequest, created, serverError } from "../../helpers/http-helper";
import { Controller, HttpRequest, HttpResponse } from "../../protocols";

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

      const petCreated = await this.createPet.handle(pet);
      return created(petCreated);
    } catch (error) {
      return serverError(error);
    }
  }

}
