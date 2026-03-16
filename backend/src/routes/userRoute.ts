import express from 'express';
import { userController } from '../dependencyHandlers/user.dependencies';
import authRole from '../middlewares/authMiddleware';

const userRouter = express.Router();

userRouter.use(authRole(['user']));

userRouter.get('/profile', userController.getProfile.bind(userController));
userRouter.put('/profile', userController.updateProfile.bind(userController));

export default userRouter;
