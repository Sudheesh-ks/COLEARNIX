import { IUserService } from '../interface/IUserService';
import { IUserRepository } from '../../repositories/interface/IUserRepository';
import { verifyRefreshToken, generateAccessToken, generateRefreshToken } from '../../utils/jwt.utils';

export class UserService implements IUserService {
  constructor(private _userRepository: IUserRepository) {}

  async refreshToken(refreshToken?: string): Promise<{ token: string; refreshToken: string }> {
    if (!refreshToken) {
      throw new Error('Refresh token missing');
    }

    let decoded: any;
    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch (error) {
      throw new Error('Invalid or expired refresh token');
    }

    const user = await this._userRepository.findById(decoded.id);

    if (!user) {
      throw new Error('User not found');
    }

    if (user.isBlocked) {
      throw new Error('User is blocked by admin');
    }

    const newAccessToken = generateAccessToken(user._id.toString(), user.email, 'user');
    const newRefreshToken = generateRefreshToken(user._id.toString());

    return { token: newAccessToken, refreshToken: newRefreshToken };
  }
}
