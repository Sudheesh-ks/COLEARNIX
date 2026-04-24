import { IUserService } from '../interface/IUserService';
import { IUserRepository } from '../../repositories/interface/IUserRepository';
import { verifyRefreshToken, generateAccessToken, generateRefreshToken } from '../../utils/jwt.utils';
import { UserDTO } from '../../dtos/user.dto';
import { toUserDTO } from '../../mappers/userMapper';

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

  async getProfile(userId: string): Promise<UserDTO> {
    const user = await this._userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return toUserDTO(user);
  }

  async updateProfile(userId: string, updateData: any): Promise<UserDTO> {
    const user = await this._userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const { name, gender, dob, image } = updateData;

    if (!name || !gender || !dob) {
      throw new Error('Name, gender, and date of birth are required');
    }

    const trimmedName = name.trim().replace(/\s+/g, ' ');
    if (trimmedName.length < 3) {
      throw new Error('Name must be at least 3 characters long');
    }
    if (trimmedName.length > 50) {
      throw new Error('Name cannot exceed 50 characters');
    }

    const birthDate = new Date(dob);
    const today = new Date();
    if (birthDate > today) {
      throw new Error('Date of birth cannot be in the future');
    }

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age < 5) {
      throw new Error('You must be at least 5 years old');
    }

    const allowedUpdates = {
      name: trimmedName,
      gender,
      dob,
      ...(image && { image })
    };

    const updatedUser = await this._userRepository.updateById(userId, allowedUpdates);
    if (!updatedUser) {
      throw new Error('User not found');
    }
    return toUserDTO(updatedUser);
  }
}
