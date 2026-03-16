import { IUserRepository } from '../interface/IUserRepository';
import userModel from '../../models/userModel';

export class UserRepository implements IUserRepository {
  async findById(id: string): Promise<any> {
    return await userModel.findById(id);
  }
}
