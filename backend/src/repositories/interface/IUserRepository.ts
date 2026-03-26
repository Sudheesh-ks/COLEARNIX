export interface IUserRepository {
  findById(id: string): Promise<any>;
  updateById(id: string, data: any): Promise<any>;
  findAll(skip: number, limit: number): Promise<any[]>;
  countDocuments(): Promise<number>;
}
