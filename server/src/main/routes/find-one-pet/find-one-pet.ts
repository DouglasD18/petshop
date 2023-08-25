import { Router } from "express";
import { expressAdapter } from "../../adapter/express-adapter";
import { makeFindOnePetController } from "../../factories";

export default (router: Router): void => {
  router.get("/:name", expressAdapter(makeFindOnePetController()));
}
