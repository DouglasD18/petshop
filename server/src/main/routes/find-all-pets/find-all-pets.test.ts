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

describe("FindAllPets Route", () => {
  beforeAll(async () => {
    await MongoHelper.connect();
  })

  afterAll(async () => {
    const petsCollection = await MongoHelper.getCollection("pets");
    await petsCollection.deleteMany({});
    await MongoHelper.disconnect();
  })

  it("Should return 200 on success", async () => {
    await request(app)
      .get('/api/pet/')
      .expect(200)
  })

  it("Should return 500 if database is not connected", async () => {
    await MongoHelper.disconnect();

    const response = await request(app)
      .get('/api/pet')

    await MongoHelper.connect();

    expect(response.statusCode).toBe(500);
  })

  it("Should return void if database is empty", async () => {
    const response = await request(app)
      .get('/api/pet')

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeFalsy();
  })

  it("Should return all pets", async () => {
    const petsCollection = await MongoHelper.getCollection("pets");
    await petsCollection.insertOne(PET);

    const response = await request(app)
      .get('/api/pet')
      
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([{
      name,
      age,
      kind: Kind.CAT,
      breed,
      owner
    }]);
  })
})