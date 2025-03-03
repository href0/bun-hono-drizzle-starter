import { deleteCookie, setCookie } from "hono/cookie";
import { ERROR_MESSAGES } from "../../utils/constants/error.constant";
import { BadRequestError, ConflictError } from "../../utils/errors/http.error";
import { cookieOptions, hashPassword } from "../../utils/helpers/common.helper";
import { generateJWT, TokenType } from "../../utils/helpers/jwt.helper";
import { JWTPayloadUser } from "../../utils/interfaces/jwt.interface";
import { userRepository } from "../user/user.repository";
import { userService } from "../user/user.service";
import { SelectUser } from "../user/user.type";
import { authRepository } from "./auth.repository";
import { ResponseSignInAuthSchema, SignUpAuthSchema } from "./auth.type";
import { db } from "../../config/db.config";

class AuthService {
  public async signUp(request: SignUpAuthSchema): Promise<SelectUser> {
    const check = await userRepository.findByEmail(request.email)
    if(check) throw new ConflictError(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS)
    request.password = await hashPassword(request.password)
    return authRepository.signUp(request)
  }

  public async signIn(email: string, password: string): Promise<{result: ResponseSignInAuthSchema, refreshToken: string}> {
    const user = await authRepository.signIn(email)
    if(!user) throw new BadRequestError(ERROR_MESSAGES.INVALID_EMAIL_OR_PASSWORD)
    
    const isPasswordMatch = await Bun.password.verify(password, user.password)
    if(!isPasswordMatch) throw new BadRequestError(ERROR_MESSAGES.INVALID_EMAIL_OR_PASSWORD)
  
    const payload: JWTPayloadUser = {
      sub: user.id,
      email: user.email,
      name: user.name,
    }
  
    const [ accessToken, refreshToken ] = await Promise.all([
      generateJWT(payload),
      generateJWT(payload, TokenType.REFRESH),
    ])
  
    const result : ResponseSignInAuthSchema = { 
      id : user.id,
      name : user.name,
      email : user.email,
      createdAt : user.createdAt,
      updatedAt : user.updatedAt,
      accessToken : accessToken 
    }
    await userService.updateRefreshToken(user.id, refreshToken)
    return { result, refreshToken }
  }

  public async signOut(email: string, refreshToken: string): Promise<void> {
    const checkRefreshToken = await authRepository.getRefreshToken(email, refreshToken)
    if(!checkRefreshToken) return

    await userService.updateRefreshToken(checkRefreshToken.id, null)
  } 
}

export const authService = new AuthService()