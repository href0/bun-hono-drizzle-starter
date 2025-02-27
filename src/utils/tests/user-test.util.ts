import { userService } from "../../modules/user/user.service";
import { InsertUser, SelectUser, UpdateUser } from "../../modules/user/user.type";

export const mockUser: InsertUser = {
  email: "test@example.com",
  name: "Test User",
  password: "password",
};

export class UserTestUtil {
  private static _id: number | null = null

  public static async create(): Promise<SelectUser> {
    const user = await userService.create(this.getMockUser());
    this.setId(user.id)
    return user
  }

  public static async update(): Promise<SelectUser> {
    return userService.update(this._id!, this.getMockUpdateUser())
  }

  public static async remove(id: number | null = null): Promise<void> {
    if(!this._id && !id) return
    await userService.remove(id || this._id!)
    this.clearId()
  }

  public static getMockUser(): InsertUser {
    return  {
      email: "test@example.com",
      name: "Test User",
      password: "password",
    }
  }

  public static getMockUpdateUser(): UpdateUser {
    return  {
      name: "Test User update",
    }
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