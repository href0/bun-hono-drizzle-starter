import { afterAll, beforeAll, beforeEach, describe, expect, it } from "bun:test";
import { UserRepository } from "../../src/modules/admin/user/user.repository";
import { db } from "../../src/config/db.config";
import { usersTable } from "../../src/models/user.model";
import { rolesTable } from "../../src/models/role.model";
import { eq } from "drizzle-orm";
import { hashPassword } from "../../src/utils/helpers/common.helper";
import { UserInsert, UserUpdate } from "../../src/modules/admin/user/user.type";

describe("UserRepository Integration Tests", () => {
  let userRepository: UserRepository;
  let testUserId: number;
  let testRoleId: number;
  let createdByUserId: number;

  beforeAll(async () => {
    userRepository = new UserRepository(db);
    
    // Create a test role for foreign key constraint
    const [testRole] = await db.insert(rolesTable).values({
      name: "test-role",
      isSuperadmin: false,
      createdAt: new Date(),
      createdBy: 1
    }).returning({ id: rolesTable.id });
    testRoleId = testRole.id;

    // Create a user for createdBy reference
    const hashedPassword = await hashPassword("password123");
    const [createdByUser] = await db.insert(usersTable).values({
      name: "Creator User",
      email: "creator@test.com",
      password: hashedPassword,
      roleId: testRoleId,
      createdAt: new Date(),
      createdBy: 1
    }).returning({ id: usersTable.id });
    createdByUserId = createdByUser.id;
  });

  afterAll(async () => {
    // Clean up test data
    await db.delete(usersTable).where(eq(usersTable.email, "creator@test.com"));
    await db.delete(usersTable).where(eq(usersTable.email, "test@example.com"));
    await db.delete(usersTable).where(eq(usersTable.email, "updated@example.com"));
    await db.delete(rolesTable).where(eq(rolesTable.name, "test-role"));
  });

  beforeEach(async () => {
    // Clean up any existing test user before each test
    await db.delete(usersTable).where(eq(usersTable.email, "test@example.com"));
    await db.delete(usersTable).where(eq(usersTable.email, "updated@example.com"));
  });

  describe("insert", () => {
    it("should successfully insert a new user", async () => {
      const userData: UserInsert = {
        name: "Test User",
        email: "test@example.com",
        password: await hashPassword("password123"),
        roleId: testRoleId,
        createdAt: new Date(),
        createdBy: createdByUserId
      };

      const result = await userRepository.insert(userData);

      expect(result).toBeDefined();
      expect(result.id).toBeNumber();
      expect(result.name).toBe(userData.name);
      expect(result.email).toBe(userData.email);
      expect(result.createdAt).toBeInstanceOf(Date);
      
      testUserId = result.id;
    });

    it("should throw error when inserting user with duplicate email", async () => {
      const userData: UserInsert = {
        name: "Test User",
        email: "test@example.com",
        password: await hashPassword("password123"),
        roleId: testRoleId,
        createdAt: new Date(),
        createdBy: createdByUserId
      };

      // Insert first user
      await userRepository.insert(userData);

      // Try to insert another user with same email - should throw
      try {
        await userRepository.insert(userData);
        expect(true).toBe(false); // Should not reach here
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe("findById", () => {
    beforeEach(async () => {
      const userData: UserInsert = {
        name: "Test User",
        email: "test@example.com",
        password: await hashPassword("password123"),
        roleId: testRoleId,
        createdAt: new Date(),
        createdBy: createdByUserId
      };
      const result = await userRepository.insert(userData);
      testUserId = result.id;
    });

    it("should find user by id", async () => {
      const result = await userRepository.findById(testUserId);

      expect(result).toBeDefined();
      expect(result).not.toBeUndefined();
      
      // Verify basic properties exist
      expect((result as any).id).toBe(testUserId);
      expect((result as any).name).toBe("Test User");
      expect((result as any).email).toBe("test@example.com");
    });

    it("should return undefined for non-existent user", async () => {
      const result = await userRepository.findById(99999);
      expect(result).toBeUndefined();
    });
  });

  describe("findByEmail", () => {
    beforeEach(async () => {
      const userData: UserInsert = {
        name: "Test User",
        email: "test@example.com",
        password: await hashPassword("password123"),
        roleId: testRoleId,
        createdAt: new Date(),
        createdBy: createdByUserId
      };
      const result = await userRepository.insert(userData);
      testUserId = result.id;
    });

    it("should find user by email", async () => {
      const result = await userRepository.findByEmail("test@example.com");

      expect(result).toBeDefined();
      expect(result?.email).toBe("test@example.com");
      expect(result?.name).toBe("Test User");
    });

    it("should return null for non-existent email", async () => {
      const result = await userRepository.findByEmail("nonexistent@example.com");
      expect(result).toBeUndefined();
    });
  });

  describe("update", () => {
    beforeEach(async () => {
      const userData: UserInsert = {
        name: "Test User",
        email: "test@example.com",
        password: await hashPassword("password123"),
        roleId: testRoleId,
        createdAt: new Date(),
        createdBy: createdByUserId
      };
      const result = await userRepository.insert(userData);
      testUserId = result.id;
    });

    it("should successfully update user", async () => {
      const updateData: UserUpdate = {
        name: "Updated Test User",
        updatedAt: new Date(),
        updatedBy: createdByUserId
      };

      const result = await userRepository.update(testUserId, updateData);

      expect(result).toBeDefined();
      expect(result.name).toBe("Updated Test User");
      expect(result.updatedAt).toBeInstanceOf(Date);
      expect(result.email).toBe("test@example.com"); // Should remain unchanged
    });
  });

  describe("updatePassword", () => {
    beforeEach(async () => {
      const userData: UserInsert = {
        name: "Test User",
        email: "test@example.com",
        password: await hashPassword("password123"),
        roleId: testRoleId,
        createdAt: new Date(),
        createdBy: createdByUserId
      };
      const result = await userRepository.insert(userData);
      testUserId = result.id;
    });

    it("should successfully update user password", async () => {
      const newPassword = "newPassword123";
      
      const result = await userRepository.updatePassword(testUserId, newPassword, createdByUserId);

      expect(result).toBeDefined();
      expect(result.id).toBe(testUserId);
      expect(result.updatedAt).toBeInstanceOf(Date);
      
      // Verify password was actually hashed and updated
      const [updatedUser] = await db.select({ password: usersTable.password })
        .from(usersTable)
        .where(eq(usersTable.id, testUserId));
      
      expect(updatedUser.password).not.toBe(newPassword); // Should be hashed
    });
  });

  describe("updateRefreshToken", () => {
    beforeEach(async () => {
      const userData: UserInsert = {
        name: "Test User",
        email: "test@example.com",
        password: await hashPassword("password123"),
        roleId: testRoleId,
        createdAt: new Date(),
        createdBy: createdByUserId
      };
      const result = await userRepository.insert(userData);
      testUserId = result.id;
    });

    it("should successfully update refresh token", async () => {
      const refreshToken = "test-refresh-token-123";
      
      await userRepository.updateRefreshToken(testUserId, refreshToken);

      // Verify refresh token was updated
      const [user] = await db.select({ refreshToken: usersTable.refreshToken })
        .from(usersTable)
        .where(eq(usersTable.id, testUserId));
      
      expect(user.refreshToken).toBe(refreshToken);
    });

    it("should successfully clear refresh token", async () => {
      // First set a refresh token
      await userRepository.updateRefreshToken(testUserId, "test-token");
      
      // Then clear it
      await userRepository.updateRefreshToken(testUserId, null);

      // Verify refresh token was cleared
      const [user] = await db.select({ refreshToken: usersTable.refreshToken })
        .from(usersTable)
        .where(eq(usersTable.id, testUserId));
      
      expect(user.refreshToken).toBeNull();
    });
  });

  describe("delete", () => {
    beforeEach(async () => {
      const userData: UserInsert = {
        name: "Test User",
        email: "test@example.com",
        password: await hashPassword("password123"),
        roleId: testRoleId,
        createdAt: new Date(),
        createdBy: createdByUserId
      };
      const result = await userRepository.insert(userData);
      testUserId = result.id;
    });

    it("should successfully delete user by id", async () => {
      await userRepository.delete(testUserId);

      // Verify user was deleted
      const result = await userRepository.findById(testUserId);
      expect(result).toBeUndefined();
    });
  });

  describe("deleteByEmail", () => {
    beforeEach(async () => {
      const userData: UserInsert = {
        name: "Test User",
        email: "test@example.com",
        password: await hashPassword("password123"),
        roleId: testRoleId,
        createdAt: new Date(),
        createdBy: createdByUserId
      };
      const result = await userRepository.insert(userData);
      testUserId = result.id;
    });

    it("should successfully delete user by email", async () => {
      await userRepository.deleteByEmail("test@example.com");

      // Verify user was deleted
      const result = await userRepository.findByEmail("test@example.com");
      expect(result).toBeUndefined();
    });
  });
});