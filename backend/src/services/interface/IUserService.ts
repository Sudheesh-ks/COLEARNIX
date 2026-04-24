import { UserDTO } from "../../dtos/user.dto";

export interface IUserService {
  refreshToken(refreshToken?: string): Promise<{ token: string; refreshToken: string }>;
  getProfile(userId: string): Promise<UserDTO>;
  updateProfile(userId: string, updateData: any): Promise<UserDTO>;
}
