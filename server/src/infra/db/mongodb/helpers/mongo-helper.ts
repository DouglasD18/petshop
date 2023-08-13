import { Collection, MongoClient } from "mongodb";
import env from "../../../../main/config/env";

export const MongoHelper = {
  client: null as unknown as MongoClient,

  async connect(): Promise<void> {
    this.client = await MongoClient.connect(env.mongo_uri)
  },

  async disconnect(): Promise<void> {
    await this.client.close();
  },

  async getCollection(name: string): Promise<Collection> {
    if (this.client === null) {
      await this.connect();
    }
    return this.client.db().collection(name);
  }
}
