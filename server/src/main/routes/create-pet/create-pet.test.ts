import request from 'supertest';
import app from '../../config/app';

import { Kind, Pet } from '../../../domain/models';
import { MongoHelper } from '../../../infra/db/mongodb/helpers/mongo-helper';

const name = "any_pet_name";
const age = 3;
const kind = "cat";
const breed = "any_cat_breed";
const ownerName = "any_owner_name";
const contact = "(88)99999-9999";
const address = "any_address_good_address";
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

describe("CreatePet Route", () => {
  beforeAll(async () => {
    await MongoHelper.connect();
  })

  afterAll(async () => {
    const accountCollection = await MongoHelper.getCollection("pets");
    await accountCollection.deleteMany({});
    await MongoHelper.disconnect();
  })

  beforeEach(async () => {
    const accountCollection = await MongoHelper.getCollection("pets");
    await accountCollection.deleteMany({});
  })
  
  it("Should return 400 if name is missing", async () => {
    const response = await request(app)
      .post('/api/pet/')
      .send({ age, kind, breed, owner });

    expect(response.statusCode).toBe(400);
  })

  it("Should return 400 if age is missing", async () => {
    const response = await request(app)
      .post('/api/pet/')
      .send({ name, kind, breed, owner });

    expect(response.statusCode).toBe(400);
  })

  it("Should return 400 if kind is missing", async () => {
    const response = await request(app)
      .post('/api/pet/')
      .send({ age, name, breed, owner });

    expect(response.statusCode).toBe(400);
  })

  it("Should return 400 if breed is missing", async () => {
    const response = await request(app)
      .post('/api/pet/')
      .send({ age, kind, name, owner });

    expect(response.statusCode).toBe(400);
  })

  it("Should return 400 if owner is missing", async () => {
    const response = await request(app)
      .post('/api/pet/')
      .send({ age, kind, breed, name });
      
    expect(response.statusCode).toBe(400);
  })

  it("Should return 400 if owner's name is missing", async () => {
    const response = await request(app)
      .post('/api/pet/')
      .send({ age, kind, breed, name, owner: { contact, address } });
      
    expect(response.statusCode).toBe(400);
  })

  it("Should return 400 if owner's contact is missing", async () => {
    const response = await request(app)
      .post('/api/pet/')
      .send({ age, kind, breed, name, owner: { name: ownerName, address } });
      
    expect(response.statusCode).toBe(400);
  })

  it("Should return 400 if owner's address is missing", async () => {
    const response = await request(app)
      .post('/api/pet/')
      .send({ age, kind, breed, name, owner: { contact, name: ownerName } });

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({ name: "MissingParamError" });
  })

  it("Should return the pet id on success", async () => {
    const response = await request(app)
      .post('/api/pet/')
      .send(PET);
      
    expect(response.statusCode).toBe(201);
  }) 
})