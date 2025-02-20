import { describe, expect, it, beforeAll } from "bun:test";
import { userService } from "./user.service";
import { ConflictError, NotFoundError } from "../../utils/errors/http.error";
import { InsertUser, SelectUser, UpdateUser, UserQuerySchema } from "./user.type";

const mockUser: InsertUser = {
  email: "test@example.com",
  name: "Test User",
  password: "password123",
};

let user: SelectUser | null = null 

describe("UserService", () => {
  beforeAll(async () => {
    try {
      const existingUser = await userService.findOneByEmail(mockUser.email);
      if (existingUser)   await userService.remove(existingUser.id);
    } catch (error) {
      if (!(error instanceof NotFoundError)) {
        console.log('Error in beforeAll', error);
        process.exit(1);
      }
    }
  });

  describe("create", () => {
    it("should create a new user", async () => {
      user = await userService.create(mockUser);
      expect(user.email).toEqual(mockUser.email);
      expect(user.name).toEqual(mockUser.name);
    });

    it("should error already exists", async () => {         
      expect(userService.create(mockUser))
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
      const updateUser = await userService.update(Number(user?.id), {
        email: mockUser.email,
        name: "Updated User",
      })
      expect(updateUser.name).toEqual("Updated User");
    });

  });

  describe("updatePassword", () => {
    it("should update password created user", async () => {   
      const updateUser = await userService.updatePassword(Number(user?.id), "newpassword123");
      expect(updateUser.name).toEqual("Updated User");
    });
  });

  describe("remove", () => {
    it("should delete test user", async () => {
      const remove = await userService.remove(Number(user?.id));
      expect(remove).toEqual(undefined);
    });

    it("should error not found user", async () => {
      expect(userService.findOne(Number(user?.id)))
      .rejects.toThrow(NotFoundError);
    });
  });
});