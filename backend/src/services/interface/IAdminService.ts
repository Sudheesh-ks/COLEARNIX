import { AdminDTO } from "../../dtos/admin.dto";
import { UserDTO } from "../../dtos/user.dto";

export interface IAdminService {
  login(email: string, password: string): Promise<{ admin: AdminDTO; accessToken: string; refreshToken: string }>;
  refreshToken(refreshToken?: string): Promise<{ token: string; refreshToken: string }>;
  getUsers(page: number, limit: number): Promise<{ users: UserDTO[]; total: number }>;
  toggleBlockUser(userId: string): Promise<UserDTO>;
}
