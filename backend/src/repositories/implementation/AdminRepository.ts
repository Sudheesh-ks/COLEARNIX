import { IAdminRepository } from '../interface/IAdminRepository';
import adminModel, { AdminDocument } from '../../models/adminModel';

export class AdminRepository implements IAdminRepository {
  async findByEmail(email: string): Promise<AdminDocument | null> {
    return await adminModel.findOne({ email });
  }

  async findById(id: string): Promise<AdminDocument | null> {
    return await adminModel.findById(id);
  }
}
