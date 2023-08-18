import { Router, Express } from "express";

import createRouter from "../routes/create-pet/create-pet";

export default (app: Express): void => {
  const router = Router();
  app.use("/api/pet/", router);
  createRouter(router);
}
