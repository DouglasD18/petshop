import { Router } from "express";
import { expressAdapter } from "../../adapter/express-adapter";
import { makeUpdatePetController } from "../../factories/update-pet";

export default (router: Router): void => {
  router.put("/:name", expressAdapter(makeUpdatePetController()));
}
