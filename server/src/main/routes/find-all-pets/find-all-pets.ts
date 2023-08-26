import { Router } from "express";
import { expressAdapter } from "../../adapter/express-adapter";
import { makeFindAllPetsController } from "../../factories/find-all-pets";

export default (router: Router): void => {
  router.get("/", expressAdapter(makeFindAllPetsController()));
}
