export interface IUserRepository {
  findById(id: string): Promise<any>;
}
