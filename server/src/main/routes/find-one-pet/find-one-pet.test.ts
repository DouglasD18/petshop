import request from 'supertest';
import app from '../../config/app';

import { Kind, Pet } from '../../../domain/models';
import { MongoHelper } from '../../../infra/db/mongodb/helpers/mongo-helper';

const name = "any_pet_name";
const age = 3;
const breed = "any_cat_breed";
const ownerName = "any_owner_name";
const contact = "(88)99999-9999";
const address = "any_address";
const owner = {
  name: ownerName,
  contact,
  address
}

const PET: Pet = {
  name,
  age,
  kind: Kind.CAT,
  breed,
  owner
}

describe("FindOnePet Route", () => {
  beforeAll(async () => {
    await MongoHelper.connect();
    const accountCollection = await MongoHelper.getCollection("pets");
    await accountCollection.insertOne(PET);
  })

  afterAll(async () => {
    const accountCollection = await MongoHelper.getCollection("pets");
    await accountCollection.deleteMany({});
    await MongoHelper.disconnect();
  })
  
  it("Should return 404 if Pet is not found", async () => {
    await request(app)
      .get('/api/pet/Chani')
      .expect(404)
  })

  it("Should return 200 on success", async () => {
    await request(app)
      .get('/api/pet/any_pet_name')
      .expect(200)
  })
})