import { menuService } from "../../modules/menu/menu.service";
import { InsertMenu, SelectMenu, UpdateMenu } from "../../modules/menu/menu.type";
import { UserTestUtil } from "./user-test.util";

export class MenuTestUtil {
  private static _id: number | null = null
  private static _userId: number | null = null

  public static async create(): Promise<SelectMenu> {
    const user = await UserTestUtil.create()
    this.setUserId(user.id)
    const result = await menuService.create(this.getMock());
    this.setId(result.id)
    return result
  }

  public static async update(): Promise<SelectMenu> {
    return menuService.update(this._id!, this.getMockUpdate())
  }

  public static async remove(id: number | null = null): Promise<void> {
    if(this._id || id) {
      await menuService.remove(id || this._id!)
      this.clearId()
    }
    await UserTestUtil.remove()
  }

  public static getMock(): InsertMenu {
    return {
      name: "Test Menu",
      icon: "menu",
      isActive: true,
      url: "#",
      createdBy: this._userId!,
    }
  }

  public static getMockUpdate(): UpdateMenu {
    return  {
      name: "Test Menu Updated",
      icon: "menu",
      isActive: true,
      url: "Menu",
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