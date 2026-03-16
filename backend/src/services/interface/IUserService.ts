export interface IUserService {
  refreshToken(refreshToken?: string): Promise<{ token: string; refreshToken: string }>;
}
