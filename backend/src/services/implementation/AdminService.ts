import bcrypt from 'bcryptjs';
import { IAdminService } from '../interface/IAdminService';
import { IAdminRepository } from '../../repositories/interface/IAdminRepository';
import { IUserRepository } from '../../repositories/interface/IUserRepository';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../../utils/jwt.utils';
import { AdminDTO } from '../../dtos/admin.dto';
import { UserDTO } from '../../dtos/user.dto';
import { toAdminDTO } from '../../mappers/adminMapper';
import { toUserDTO } from '../../mappers/userMapper';

export class AdminService implements IAdminService {
  constructor(
    private _adminRepository: IAdminRepository,
    private _userRepository: IUserRepository
  ) {}

  async login(email: string, password: string): Promise<{ admin: AdminDTO; accessToken: string; refreshToken: string }> {
    const admin = await this._adminRepository.findByEmail(email);

    if (!admin) {
      throw new Error('Admin not found');
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    const accessToken = generateAccessToken(admin._id.toString(), admin.email, 'admin');
    const refreshToken = generateRefreshToken(admin._id.toString());

    return { admin: toAdminDTO(admin), accessToken, refreshToken };
  }

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

    const admin = await this._adminRepository.findById(decoded.id);

    if (!admin) {
      throw new Error('Admin not found');
    }

    const newAccessToken = generateAccessToken(admin._id.toString(), admin.email, 'admin');
    const newRefreshToken = generateRefreshToken(admin._id.toString());

    return { token: newAccessToken, refreshToken: newRefreshToken };
  }

  async getUsers(page: number, limit: number): Promise<{ users: UserDTO[]; total: number }> {
    const skip = (page - 1) * limit;
    const users = await this._userRepository.findAll(skip, limit);
    const total = await this._userRepository.countDocuments();
    return { users: users.map(u => toUserDTO(u)), total };
  }

  async toggleBlockUser(userId: string): Promise<UserDTO> {
    const user = await this._userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    const updatedUser = await this._userRepository.updateById(userId, { isBlocked: !user.isBlocked });
    if (!updatedUser) {
      throw new Error('User not found');
    }
    return toUserDTO(updatedUser);
  }
}
