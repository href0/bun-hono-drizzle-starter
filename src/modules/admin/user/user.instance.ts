
import { UserRepository } from "./user.repository";
import { UserService } from "./user.service";

export const createUserService = (userRepo?: UserRepository) => new UserService(userRepo ?? new UserRepository());
export const userService = createUserService();