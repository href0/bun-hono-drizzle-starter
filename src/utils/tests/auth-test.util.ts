import { authService } from "../../modules/auth/auth.service";
import { ResponseSignInAuthSchema, SignInAuthSchema, SignUpAuthSchema } from "../../modules/auth/auth.type";
import { userService } from "../../modules/user/user.service";
import { SelectUser } from "../../modules/user/user.type";

export class AuthTestUtil {
  private static _id: number | null = null

  public static async signUp(): Promise<SelectUser> {
    const user = await authService.signUp(this.getMockSignUp());
    return user
  }

  public static async signIn(): Promise<ResponseSignInAuthSchema> {
    const { result } = await authService.signIn(this.getMockSignIn().email, this.getMockSignIn().password);
    this.setId(result.id)
    return result
  }

  public static getMockSignUp(): SignUpAuthSchema {
    return  {
      email: "auth-test@example.com",
      name: "Test Auth",
      password: "password",
    }
  }

  public static getMockSignIn(): SignInAuthSchema {
    return  {
      email: "auth-test@example.com",
      password: "password",
    }
  }

  public static async remove(id: number | null = null): Promise<void> {
    if(!this._id && !id) return
    await userService.remove(id || this._id!)
    this.clearId()
  }

  private static setId(id: number): void {
    this._id = id
  }

  public static getId(): number | null {
    return this._id
  }

  private static clearId(): void {
    if(this._id !== null){
      this._id = null
    }
  }
}