import { AdminDocument } from '../../models/adminModel';

export interface IAdminRepository {
  findByEmail(email: string): Promise<AdminDocument | null>;
  findById(id: string): Promise<AdminDocument | null>;
}
