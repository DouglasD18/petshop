import { Router } from "express";
import { expressAdapter } from "../../adapter/express-adapter";
import { makeCreatePetController } from "../../factories";

export default (router: Router): void => {
  router.post("/", expressAdapter(makeCreatePetController()));
}
