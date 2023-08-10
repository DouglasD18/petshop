import { ServerError } from "../errors";
import { HttpResponse } from "../protocols";

export const serverError = (): HttpResponse => ({
  statusCode: 500,
  body: new ServerError()
});

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error
});

export const created = (result: any): HttpResponse => ({
  statusCode: 201,
  body: result
});
