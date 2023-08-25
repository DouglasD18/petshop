import { Router, Express } from "express";

import createRouter from "../routes/create-pet/create-pet";
import findOnePetRouter from "../routes/find-one-pet/find-one-pet";

export default (app: Express): void => {
  const router = Router();
  app.use("/api/pet", router);
  createRouter(router);
  findOnePetRouter(router);
}
