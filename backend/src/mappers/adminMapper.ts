import { AdminDTO } from '../dtos/admin.dto';
import { AdminDocument } from '../models/adminModel';

export const toAdminDTO = (a: AdminDocument): AdminDTO => {
  return {
    _id: a._id.toString(),
    email: a.email,
  };
};
