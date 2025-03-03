import { roleService } from "../../modules/role/role.service";
import { InsertRole, SelectRole, UpdateRole } from "../../modules/role/role.type";
import { UserTestUtil } from "./user-test.util";

export class RoleTestUtil {
  private static _id: number | null = null
  private static _userId: number | null = null

  public static async create(): Promise<SelectRole> {
    const user = await UserTestUtil.create()
    this.setUserId(user.id)
    const result = await roleService.create(this.getMock());
    this.setId(result.id)
    return result
  }

  public static async update(): Promise<SelectRole> {
    return roleService.update(this._id!, this.getMockUpdate())
  }

  public static async remove(id: number | null = null): Promise<void> {
    if(this._id || id) {
      await roleService.remove(id || this._id!)
      this.clearId()
    }
    await UserTestUtil.remove()
  }

  public static getMock(): InsertRole {
    return {
      name: "Test Role",
      createdBy: this._userId!,
      isSuperadmin: false
    }
  }

  public static getMockUpdate(): UpdateRole {
    return  {
      name: "Test Role Updated",
      updatedBy: this._userId!,
    }
  }

  public static getId(): number | null {
    return this._id
  }

  public static setId(id: number): void {
    this._id = id
  }

  public static setUserId(id: number): void {
    this._userId = id
  }

  private static clearId(): void {
    if(this._id !== null){
      this._id = null
    }
  }
}