import { AdminRepository } from '../repositories/implementation/AdminRepository';
import { AdminService } from '../services/implementation/AdminService';
import { AdminController } from '../controllers/implementation/AdminController';

const adminRepository = new AdminRepository();
const adminService = new AdminService(adminRepository);

export const adminController = new AdminController(adminService);
