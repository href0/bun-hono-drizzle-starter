import { ERROR_MESSAGES } from "../../utils/constants/error.constant";
import { BadRequestError, ConflictError } from "../../utils/errors/http.error";
import { hashPassword } from "../../utils/helpers/common.helper";
import { generateJWT, TokenType } from "../../utils/helpers/jwt.helper";
import { JWTPayloadUser } from "../../utils/interfaces/jwt.interface";
import { UserService } from "../admin/user/user.service";
import { UserResponse } from "../admin/user/user.type";
import { AuthRepository } from "./auth.repository";
import { ResponseSignIn, SignUpDTO } from "./auth.type";

export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly userService: UserService,
  ) {}

  public async signUp(request: SignUpDTO): Promise<UserResponse> {
    const check = await this.authRepository.checkEmailExists(request.email)
    if(check) throw new ConflictError(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS)
    request.password = await hashPassword(request.password)
    return this.authRepository.signUp(request)
  }

  public async signIn(email: string, password: string): Promise<{result: ResponseSignIn, refreshToken: string}> {
    const user = await this.authRepository.signIn(email)
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
  
    const result : ResponseSignIn = { 
      id : user.id,
      name : user.name,
      email : user.email,
      createdAt : user.createdAt,
      updatedAt : user.updatedAt,
      accessToken : accessToken 
    }
    await this.userService.updateRefreshToken(user.id, refreshToken)
    return { result, refreshToken }
  }

  public async signOut(email: string, refreshToken: string): Promise<void> {
    const checkRefreshToken = await this.authRepository.getRefreshToken(email, refreshToken)
    if(!checkRefreshToken) return

    await this.userService.updateRefreshToken(checkRefreshToken.id, null)
  } 
}