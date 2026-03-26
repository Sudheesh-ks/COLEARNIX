export interface IAdminController {
  login(req: Request, res: Response): Promise<void>;
  logout(req: Request, res: Response): Promise<void>;
  refreshToken(req: Request, res: Response): Promise<void>;
  getUsers(req: Request, res: Response): Promise<void>;
  toggleBlockUser(req: Request, res: Response): Promise<void>;
}
