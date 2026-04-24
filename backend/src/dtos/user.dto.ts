export interface UserDTO {
  _id: string;
  name: string;
  email: string;
  image?: string;
  gender?: string;
  dob?: string;
  isBlocked: boolean;
}
