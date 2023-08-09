import { ServerError } from "../errors";
import { HttpResponse } from "../protocols";

export const serverError = (error: Error): HttpResponse => ({
  statusCode: 500,
  body: new ServerError(error.stack)
});

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error
});

export const created = (result: any): HttpResponse => ({
  statusCode: 201,
  body: result
});
