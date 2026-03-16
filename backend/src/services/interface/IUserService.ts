export interface IUserService {
  refreshToken(refreshToken?: string): Promise<{ token: string; refreshToken: string }>;
  getProfile(userId: string): Promise<any>;
  updateProfile(userId: string, updateData: any): Promise<any>;
}
