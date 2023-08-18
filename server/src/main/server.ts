import { MongoHelper } from "../infra/db/mongodb/helpers/mongo-helper";
import app from "./config/app";
import env from "./config/env";

MongoHelper.connect()
  .then(async () => {
    app.listen(env.port, async () => {
      console.log("Server is Running!");
    });
  })
  .catch(console.error);
