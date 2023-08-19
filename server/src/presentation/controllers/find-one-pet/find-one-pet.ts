import { Controller, FindOnePet, HttpRequest, HttpResponse, InvalidParamError, MissingParamError, badRequest, notFound, ok, serverError } from "./find-one-pet-protocols";

export class FindOnePetController implements Controller {

  constructor(private findOnePet: FindOnePet) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const { name } = httpRequest.body;

    if (!name) {
      return badRequest(new MissingParamError("name", "Name is required!"));
    } else if (typeof name !== "string") {
      return badRequest(new InvalidParamError("name", "Name must be a string"));
    }

    try {
      const pet = await this.findOnePet.handle(name);

      if (!pet) {
        return notFound("Pet");
      }

      return ok(pet);
    } catch (error) {
      return serverError();
    }
  }
  
}