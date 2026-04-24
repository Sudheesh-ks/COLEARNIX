import { UserDTO } from '../dtos/user.dto';
import { userDocument } from '../models/userModel';

export const toUserDTO = (u: userDocument): UserDTO => {
  return {
    _id: u._id.toString(),
    name: u.name,
    email: u.email,
    image: u.image,
    gender: u.gender,
    dob: u.dob,
    isBlocked: u.isBlocked,
  };
};
