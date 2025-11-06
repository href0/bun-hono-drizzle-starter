import { afterAll, beforeAll, beforeEach, describe, expect, it } from "bun:test";
import { AuthRepository } from "../../src/modules/auth/auth.repository";
import { db } from "../../src/config/db.config";
import { usersTable } from "../../src/models/user.model";
import { rolesTable } from "../../src/models/role.model";
import { eq } from "drizzle-orm";
import { hashPassword } from "../../src/utils/helpers/common.helper";

describe("AuthRepository Integration Tests", () => {
  let authRepository: AuthRepository;
  let testRoleId: number;

  beforeAll(async () => {
    authRepository = new AuthRepository();
    
    // Create test role
    const [testRole] = await db.insert(rolesTable).values({
      name: "test-auth-role",
      isSuperadmin: false,
      createdAt: new Date(),
      createdBy: 1
    }).returning({ id: rolesTable.id });
    testRoleId = testRole.id;
  });

  afterAll(async () => {
    // Clean up test data
    await db.delete(usersTable).where(eq(usersTable.email, "test@example.com"));
    await db.delete(usersTable).where(eq(usersTable.email, "signin@test.com"));
    await db.delete(rolesTable).where(eq(rolesTable.name, "test-auth-role"));
  });

  beforeEach(async () => {
    // Clean up test users before each test
    await db.delete(usersTable).where(eq(usersTable.email, "test@example.com"));
    await db.delete(usersTable).where(eq(usersTable.email, "signin@test.com"));
  });

  describe("signUp", () => {
    it("should successfully create a new user", async () => {
      // Arrange
      const signUpData = {
        email: "test@example.com",
        name: "Test User",
        password: await hashPassword("password123")
      };

      // Act
      const result = await authRepository.signUp(signUpData);

      // Assert
      expect(result).toBeDefined();
      expect(result.id).toBeNumber();
      expect(result.email).toBe(signUpData.email);
      expect(result.name).toBe(signUpData.name);
      expect(result.createdAt).toBeInstanceOf(Date);
    });
  });

  describe("signIn", () => {
    beforeEach(async () => {
      // Create test user for sign in tests
      const hashedPassword = await hashPassword("password123");
      await db.insert(usersTable).values({
        email: "signin@test.com",
        name: "SignIn User",
        password: hashedPassword,
        roleId: testRoleId,
        createdAt: new Date(),
        createdBy: 1
      });
    });

    it("should find user by email for sign in", async () => {
      // Act
      const result = await authRepository.signIn("signin@test.com");

      // Assert
      expect(result).toBeDefined();
      expect(result!.email).toBe("signin@test.com");
      expect(result!.name).toBe("SignIn User");
      expect(result!.password).toBeDefined();
    });

    it("should return undefined for non-existent email", async () => {
      // Act
      const result = await authRepository.signIn("notfound@test.com");

      // Assert
      expect(result).toBeUndefined();
    });
  });

  describe("checkEmailExists", () => {
    beforeEach(async () => {
      // Create test user
      const hashedPassword = await hashPassword("password123");
      await db.insert(usersTable).values({
        email: "test@example.com",
        name: "Test User",
        password: hashedPassword,
        roleId: testRoleId,
        createdAt: new Date(),
        createdBy: 1
      });
    });

    it("should return true when email exists", async () => {
      // Act
      const result = await authRepository.checkEmailExists("test@example.com");

      // Assert
      expect(result).toBe(true);
    });

    it("should return false when email does not exist", async () => {
      // Act
      const result = await authRepository.checkEmailExists("notfound@test.com");

      // Assert
      expect(result).toBe(false);
    });
  });

  describe("getRefreshToken", () => {
    beforeEach(async () => {
      // Create test user with refresh token
      const hashedPassword = await hashPassword("password123");
      await db.insert(usersTable).values({
        email: "test@example.com",
        name: "Test User",
        password: hashedPassword,
        roleId: testRoleId,
        refreshToken: "valid-refresh-token",
        createdAt: new Date(),
        createdBy: 1
      });
    });

    it("should return user data when email and refresh token match", async () => {
      // Act
      const result = await authRepository.getRefreshToken("test@example.com", "valid-refresh-token");

      // Assert
      expect(result).toBeDefined();
      expect(result!.id).toBeNumber();
      expect(result!.refreshToken).toBe("valid-refresh-token");
    });

    it("should return undefined when email does not match", async () => {
      // Act
      const result = await authRepository.getRefreshToken("wrong@test.com", "valid-refresh-token");

      // Assert
      expect(result).toBeUndefined();
    });

    it("should return undefined when refresh token does not match", async () => {
      // Act
      const result = await authRepository.getRefreshToken("test@example.com", "invalid-refresh-token");

      // Assert
      expect(result).toBeUndefined();
    });

    it("should return undefined when user has no refresh token", async () => {
      // Arrange - Update user to have null refresh token
      await db.update(usersTable)
        .set({ refreshToken: null })
        .where(eq(usersTable.email, "test@example.com"));

      // Act
      const result = await authRepository.getRefreshToken("test@example.com", "any-token");

      // Assert
      expect(result).toBeUndefined();
    });
  });
});
