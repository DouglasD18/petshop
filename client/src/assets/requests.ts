import axios from "axios";
import type { Pet } from "./interfaces";

const URL = "http://localhost:3001/api/pet/";

export async function createPet(pet: Pet) {
  try {
    const response = await axios.post(URL, pet);

    return response.data;
  } catch (error) {
    console.log(error);
  }
}

export async function readPets() {
  try {
    return await axios.get(URL);
  } catch (error) {
    console.log(error);
  }
}

export async function readPet(name: string) {
  try {
    const response = await axios.get(URL + name);

    return response.data;
  } catch (error) {
    console.log(error);
  }
}

export async function updatePet(name: string, pet: Pet) {
  try {
    const response = await axios.put(URL + name, pet);

    return response.status;
  } catch (error) {
    console.log(error);
  }
}

export async function deletePet(name: string) {
  try {
    const response = await axios.delete(URL + name);

    return response.status;
  } catch (error) {
    console.log(error);
  }
}
