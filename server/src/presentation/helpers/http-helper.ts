import { NotFoundError, ServerError } from "../errors";
import { HttpResponse } from "../protocols";

export const serverError = (): HttpResponse => ({
  statusCode: 500,
  body: new ServerError()
});

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error
});

export const notFound = (entity: any): HttpResponse => ({
  statusCode: 404,
  body: new NotFoundError(entity)
});

export const noContent = (): HttpResponse => ({
  statusCode: 204,
  body: []
});

export const created = (result: any): HttpResponse => ({
  statusCode: 201,
  body: result
});

export const ok = (result: any): HttpResponse => ({
  statusCode: 200,
  body: result
})
