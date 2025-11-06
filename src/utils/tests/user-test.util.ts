
// import { userService } from "../../modules/admin/user/user.instance";
// import { UserInsert, UpdateUserDTO, UserResponse, UserUpdate, CreateUserDTO } from "../../modules/admin/user/user.type";

// export const mockUser: UserInsert = {
//   name: "Test User",
//   email: "test@example.com",
//   password: "password",
//   createdAt: new Date(),
//   createdBy: 1
// };

// export class UserTestUtil {
//   private static _id: number | null = null

//   public static async create(): Promise<UserResponse> {
//     const user = await userService.create(this.getMockCreateUser(), 1);
//     this.setId(user.id)
//     return user
//   }

//   public static async update(): Promise<UserResponse> {
//     return userService.update(this._id!, this.getMockUpdateUser(), 1)
//   }

//   public static async remove(id: number | null = null): Promise<void> {
//     if(!this._id && !id) return
//     await userService.remove(id || this._id!)
//     this.clearId()
//   }

//   public static getMockCreateUser(): CreateUserDTO {
//     return  {
//       name: "Test User",
//       email: "test@example.com",
//       password: "password",
//     }
//   }

//   public static getMockUpdateUser(): UpdateUserDTO {
//     return  {
//       name: "Test User Update"
//     }
//   }

//   private static setId(id: number): void {
//     this._id = id
//   }

//   public static getId(): number | null {
//     return this._id
//   }

//   private static clearId(): void {
//     if(this._id !== null){
//       this._id = null
//     }
//   }
// }