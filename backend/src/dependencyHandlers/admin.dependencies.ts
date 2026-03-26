import { AdminRepository } from '../repositories/implementation/AdminRepository';
import { AdminService } from '../services/implementation/AdminService';
import { AdminController } from '../controllers/implementation/AdminController';
import { UserRepository } from '../repositories/implementation/UserRepository';

const adminRepository = new AdminRepository();
const userRepository = new UserRepository();
const adminService = new AdminService(adminRepository, userRepository);

export const adminController = new AdminController(adminService);
