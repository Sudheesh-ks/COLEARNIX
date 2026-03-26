import { IUserRepository } from '../interface/IUserRepository';
import userModel from '../../models/userModel';

export class UserRepository implements IUserRepository {
  async findById(id: string): Promise<any> {
    return await userModel.findById(id);
  }

  async updateById(id: string, data: any): Promise<any> {
    return await userModel.findByIdAndUpdate(id, { $set: data }, { new: true });
  }

  async findAll(skip: number, limit: number): Promise<any[]> {
    return await userModel.find().select('-password').skip(skip).limit(limit).exec();
  }

  async countDocuments(): Promise<number> {
    return await userModel.countDocuments().exec();
  }
}
