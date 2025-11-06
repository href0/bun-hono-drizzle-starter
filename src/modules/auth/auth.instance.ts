import { userService } from "../admin/user/user.instance";
import { AuthRepository } from "./auth.repository";
import { AuthService } from "./auth.service";

export const createAuthService = (authRepo?: AuthRepository) => new AuthService(authRepo ?? new AuthRepository(), userService);
export const authService = createAuthService();