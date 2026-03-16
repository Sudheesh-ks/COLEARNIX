import express from 'express';
import { adminController } from '../dependencyHandlers/admin.dependencies';

const adminRouter = express.Router();

adminRouter.post('/login', adminController.login.bind(adminController));
adminRouter.post('/logout', adminController.logout.bind(adminController));
adminRouter.post('/refresh-token', adminController.refreshToken.bind(adminController));

export default adminRouter;
