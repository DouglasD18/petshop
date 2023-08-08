import { HttpResponse } from "../protocols"

export const created = (result: any): HttpResponse => {
  return {
    statusCode: 201,
    body: result
  }
}
