export interface IUserRepository {
  findById(id: string): Promise<any>;
  updateById(id: string, data: any): Promise<any>;
}
