import { describe, expect, it, beforeAll, afterAll } from "bun:test";
import { userService } from "./user.service";
import { ConflictError, NotFoundError } from "../../utils/errors/http.error";
import { SelectUser, UserQuerySchema } from "./user.type";
import { UserTestUtil } from "../../utils/tests/user-test.util";

const mockUser = UserTestUtil.getMockUser()
let user: SelectUser | null = null 

describe("UserService", () => {
  beforeAll(async () => {
    await userService.removeByEmail(mockUser.email)
  });

  afterAll(async ()=>{
    await UserTestUtil.remove()
  })

  describe("create", () => {
    it("should create a new user", async () => {
      user = await UserTestUtil.create()
      expect(user.email).toEqual(mockUser.email);
      expect(user.name).toEqual(mockUser.name);
    });

    it("should error already exists", async () => {         
      expect(UserTestUtil.create())
      .rejects.toThrow(ConflictError);
    });
  });

  describe("findAll", () => {
    it("should found users with pagination", async () => {
      const { rows: users, pagination } = await userService.findAll({ page: 1, pageSize: 10 });
      expect(pagination.currentPage).toEqual(1);
      expect(pagination.hasPreviousPage).toEqual(false);
      expect(Array.isArray(users)).toBe(true);

      users.forEach(user => {
        expect(user).toHaveProperty('id');
        expect(user).toHaveProperty('name');
        expect(user).toHaveProperty('email');
      });
    });
  });

  describe("findOne", () => {
    it("should found a created user", async () => {
      const checkUser = await userService.findOne(user?.id!);
      expect(checkUser.email).toEqual(mockUser.email);
      expect(checkUser.name).toEqual(mockUser.name);
    });
  });

  describe("findOneByEmail", () => {
    it("should found a created user by email", async () => {
      const checkUser = await userService.findOneByEmail(user?.email!);
      expect(checkUser.email).toEqual(mockUser.email);
      expect(checkUser.name).toEqual(mockUser.name);
    });
  });

  describe("update", () => {
    it("should update created user", async () => {   
      const updateUser = await UserTestUtil.update()
      expect(updateUser.name).toEqual(UserTestUtil.getMockUpdateUser().name);
    });
  });

  describe("updatePassword", () => {
    it("should update password created user", async () => {   
      const updateUser = await userService.updatePassword(Number(user?.id), "newpassword123");
      expect(updateUser.id).toEqual(user?.id!);
    });
  });

  describe("remove", () => {
    it("should delete test user", async () => {
      const remove = await UserTestUtil.remove();
      expect(remove).toEqual(undefined);
    });

    it("should error not found user", async () => {
      expect(userService.findOne(Number(user?.id)))
      .rejects.toThrow(NotFoundError);
    });
  });
});