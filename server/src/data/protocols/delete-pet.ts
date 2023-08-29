export interface DeletePetRepository {
  handle(id: string): Promise<void>;
}
