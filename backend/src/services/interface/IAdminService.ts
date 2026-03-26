export interface IAdminService {
  login(email: string, password: string): Promise<{ admin: any; accessToken: string; refreshToken: string }>;
  refreshToken(refreshToken?: string): Promise<{ token: string; refreshToken: string }>;
  getUsers(page: number, limit: number): Promise<{ users: any[]; total: number }>;
  toggleBlockUser(userId: string): Promise<any>;
}
