import express from 'express';
import { adminController } from '../dependencyHandlers/admin.dependencies';
import authRole from '../middlewares/authMiddleware';

const adminRouter = express.Router();

adminRouter.post('/login', adminController.login.bind(adminController));
adminRouter.post('/logout', adminController.logout.bind(adminController));
adminRouter.post('/refresh-token', adminController.refreshToken.bind(adminController));

// User Management
adminRouter.get('/users', authRole(['admin']), adminController.getUsers.bind(adminController));
adminRouter.patch('/users/:userId/block', authRole(['admin']), adminController.toggleBlockUser.bind(adminController));

export default adminRouter;
