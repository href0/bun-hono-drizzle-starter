import { describe, expect, it, beforeAll, afterAll } from "bun:test";
import { ConflictError, NotFoundError } from "../../utils/errors/http.error";
import { mockUser } from "../../utils/tests/user-test.util";
import { MenuTestUtil } from "../../utils/tests/menu-test.util";
import { SelectMenu } from "./menu.type";
import { menuService } from "./menu.service";
import { userService } from "../user/user.service";

// const test = new MenuTestUtil()
let mock = MenuTestUtil.getMock() 
let menu: SelectMenu | null = null

describe("MenuService", () => {
  beforeAll(async () => {
    await userService.removeByEmail(mockUser.email)
    await menuService.removeByName(MenuTestUtil.getMock().name)
  });

  afterAll(async() => {
    await MenuTestUtil.remove()
  })

  describe("create", () => {
    it("should create a new menu", async () => {
      menu = await MenuTestUtil.create()
      expect(menu.name).toEqual(mock.name);
    });

    it("should error menu already exists", async () => {         
      expect(MenuTestUtil.create())
      .rejects.toThrow(ConflictError);
    });
  });

  describe("findAll", () => {
    it("should found menus with pagination", async () => {
      const { rows, pagination } = await menuService.findAll({ page: 1, pageSize: 10 });
      expect(pagination.currentPage).toEqual(1);
      expect(pagination.hasPreviousPage).toEqual(false);
      expect(Array.isArray(rows)).toBe(true);

      rows.forEach(row => {
        expect(row).toHaveProperty('id');
        expect(row).toHaveProperty('name');
      });
    });
  });

  describe("findOne", () => {
    it("should found a created menu", async () => {
      const check = await menuService.findOne(menu?.id!);
      expect(check.name).toEqual(mock.name);
    });
  });

  describe("update", () => {
    it("should update created menu", async () => {   
      const updated = await MenuTestUtil.update()
      expect(updated.name).toEqual(MenuTestUtil.getMockUpdate().name);
    });
  });

  describe("remove", () => {
    it("should delete test menu", async () => {
      const remove = await MenuTestUtil.remove();
      expect(remove).toEqual(undefined);
    });

    it("should error not found menu", async () => {
      expect(menuService.findOne(Number(menu?.id!)))
      .rejects.toThrow(NotFoundError);
    });
  });
  
})