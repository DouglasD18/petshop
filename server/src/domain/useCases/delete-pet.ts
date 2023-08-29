export interface DeletePet {
  handle(name: string): Promise<void>;
}