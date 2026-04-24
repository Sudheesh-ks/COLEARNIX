import express from 'express';
import dotenv from "dotenv";
import passport from 'passport';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.utils';
import { userController } from '../dependencyHandlers/user.dependencies';
dotenv.config();

const authRouter = express.Router();

authRouter.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
  })
);

authRouter.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login',
    session: false,
  }),
  (req, res) => {
    const user = req.user as any;
    if (user.isBlocked) {
      return res.redirect(`${process.env.GOOGLE_REDIRECT_URL}?error=blocked`);
    }

    const accessToken = generateAccessToken(user._id, user.email, 'user');
    const refreshToken = generateRefreshToken(user._id);

    res.cookie('refreshToken_user', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      path: '/',
      maxAge: Number(process.env.REFRESH_TOKEN_MAX_AGE), // 7 days
    });

    // Redirect to the frontend with token
    res.redirect(`${process.env.GOOGLE_REDIRECT_URL}?token=${accessToken}`);
  }
);

authRouter.post('/refresh-token', userController.refreshToken.bind(userController));
authRouter.post('/logout', userController.logout.bind(userController));

export default authRouter;