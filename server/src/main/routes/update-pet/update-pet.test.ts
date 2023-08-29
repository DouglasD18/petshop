import request from 'supertest';
import app from '../../config/app';

import { Kind, Pet } from '../../../domain/models';
import { MongoHelper } from '../../../infra/db/mongodb/helpers/mongo-helper';

const name = "Killua";
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

describe("UpdatePet Route", () => {
  beforeAll(async () => {
    await MongoHelper.connect();
    const petsCollection = await MongoHelper.getCollection("pets");
    await petsCollection.insertOne(PET);
  })

  afterAll(async () => {
    const petsCollection = await MongoHelper.getCollection("pets");
    await petsCollection.deleteMany({});
    await MongoHelper.disconnect();
  })

  it("Should return 400 if name is missing", async () => {
    const pet = { age, kind, breed, owner };

    const response = await request(app)
      .put('/api/pet/Killua')
      .send({ pet });

    expect(response.statusCode).toBe(400);
  })

  it("Should return 400 if age is missing", async () => {
    const pet = { name, kind, breed, owner };

    const response = await request(app)
      .put('/api/pet/Killua')
      .send({ pet });

    expect(response.statusCode).toBe(400);
  })

  it("Should return 400 if kind is missing", async () => {
    const pet = { age, name, breed, owner };

    const response = await request(app)
      .put('/api/pet/Killua')
      .send({ pet });

    expect(response.statusCode).toBe(400);
  })

  it("Should return 400 if breed is missing", async () => {
    const pet = { age, kind, name, owner };

    const response = await request(app)
      .put('/api/pet/Killua')
      .send({ pet });

    expect(response.statusCode).toBe(400);
  })

  it("Should return 400 if owner is missing", async () => {
    const pet = { age, kind, breed, name };

    const response = await request(app)
      .put('/api/pet/Killua')
      .send({ pet });
      
    expect(response.statusCode).toBe(400);
  })

  it("Should return 400 if owner's name is missing", async () => {
    const pet = { age, kind, breed, name, owner: { contact, address } };

    const response = await request(app)
      .put('/api/pet/Killua')
      .send({ pet });
      
    expect(response.statusCode).toBe(400);
  })

  it("Should return 400 if owner's contact is missing", async () => {
    const pet = { age, kind, breed, name, owner: { name: ownerName, address } };

    const response = await request(app)
      .put('/api/pet/Killua')
      .send({ pet });
      
    expect(response.statusCode).toBe(400);
  })

  it("Should return 400 if owner's address is missing", async () => {
    const pet = { age, kind, breed, name, owner: { contact, name: ownerName } };

    const response = await request(app)
      .put('/api/pet/Killua')
      .send({ pet });

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({ name: "MissingParamError" });
  })
  
  it("Should return 404 if Pet is not found", async () => {
    const response = await request(app)
      .put('/api/pet/Chani')
      .send({ pet: PET })

    expect(response.statusCode).toBe(404);
  })

  it("Should return 200 on success", async () => {
    const response = await request(app)
      .put('/api/pet/Killua')
      .send({ pet: PET })

    expect(response.statusCode).toBe(204);
  })
})