import { Controller, DeletePet, HttpRequest, HttpResponse, badRequest, MissingParamError, InvalidParamError, noContent, notFound, serverError } from "./delete-pet-protocols";

export class DeletePetController implements Controller {
  constructor(private deletePet: DeletePet) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const { name } = httpRequest.params;
    
    if (!name) {
      return badRequest(new MissingParamError("name", "Name is required!"));
    } else if (typeof name !== "string") {
      return badRequest(new InvalidParamError("name", "Name must be a string"));
    }

    try {
      await this.deletePet.handle(name);

      return noContent();
    } catch (e) {
      if (e instanceof Error && e.name === "NotFoundError") {
        return notFound("Pet");
      }

      return serverError();
    }
  }
  
}