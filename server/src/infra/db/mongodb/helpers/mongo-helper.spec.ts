import { MongoHelper as sut } from "./mongo-helper"

describe("MongoHelper", () => {
  beforeAll(async () => {
    await sut.connect();
  })

  afterAll(async () => {
    await sut.disconnect();
  })

  it("Should reconnect if mongodb down", async () => {
    let petCollection = await sut.getCollection("pets");
    expect(petCollection).toBeTruthy();
    await sut.disconnect();
    petCollection = await sut.getCollection("pets");
    expect(petCollection).toBeTruthy();
  })
})