import { UserRepository } from '../repositories/implementation/UserRepository';
import { UserService } from '../services/implementation/UserService';
import { UserController } from '../controllers/implementation/UserController';

const userRepository = new UserRepository();
const userService = new UserService(userRepository);

export const userController = new UserController(userService);
