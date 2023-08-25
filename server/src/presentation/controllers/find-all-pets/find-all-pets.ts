import { Controller, FindAllPets, HttpRequest, HttpResponse, ok, serverError } from "./find-all-pets-protocols";

export class FindAllPetsController implements Controller {

  constructor(private findAllPets: FindAllPets) {}

  async handle(_httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const pets = await this.findAllPets.handle();
      
      return ok(pets);
    } catch (error) {
      return serverError();
    }
  }
  
}
