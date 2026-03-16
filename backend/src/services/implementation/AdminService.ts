import bcrypt from 'bcryptjs';
import { IAdminService } from '../interface/IAdminService';
import { IAdminRepository } from '../../repositories/interface/IAdminRepository';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../../utils/jwt.utils';

export class AdminService implements IAdminService {
  constructor(private _adminRepository: IAdminRepository) {}

  async login(email: string, password: string): Promise<{ admin: any; accessToken: string; refreshToken: string }> {
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

    const { password: _, ...adminWithoutPassword } = admin.toObject();

    return { admin: adminWithoutPassword, accessToken, refreshToken };
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
}
