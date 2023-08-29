import { Router } from "express";
import { expressAdapter } from "../../adapter/express-adapter";
import { makeDeletePetController } from "../../factories";

export default (router: Router): void => {
  router.delete("/:name", expressAdapter(makeDeletePetController()));
}
