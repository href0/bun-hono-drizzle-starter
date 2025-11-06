import { afterAll, beforeAll, beforeEach, describe, expect, it } from "bun:test";
import { OpenAPIHono } from "@hono/zod-openapi";
import authHandler from "../../src/modules/auth/auth.handler";
import { db } from "../../src/config/db.config";
import { usersTable } from "../../src/models/user.model";
import { rolesTable } from "../../src/models/role.model";
import { eq } from "drizzle-orm";
import { hashPassword } from "../../src/utils/helpers/common.helper";
import { errorHandler } from "../../src/middlewares/error.middleware";

describe("Auth Routes E2E Tests", () => {
  let app: OpenAPIHono;
  let testRoleId: number;

  beforeAll(async () => {
    // Setup test app
    app = new OpenAPIHono();
    
    // Add error handling
    app.onError(errorHandler);
    
    // Add auth routes
    app.route('/auth', authHandler);

    // Create test role
    const [testRole] = await db.insert(rolesTable).values({
      name: "test-auth-role-e2e",
      isSuperadmin: false,
      createdAt: new Date(),
      createdBy: 1
    }).returning({ id: rolesTable.id });
    testRoleId = testRole.id;
  });

  afterAll(async () => {
    // Clean up test data
    await db.delete(usersTable).where(eq(usersTable.email, "signup@test.com"));
    await db.delete(usersTable).where(eq(usersTable.email, "signin@test.com"));
    await db.delete(usersTable).where(eq(usersTable.email, "signout@test.com"));
    await db.delete(rolesTable).where(eq(rolesTable.name, "test-auth-role-e2e"));
  });

  beforeEach(async () => {
    // Clean up test users before each test
    await db.delete(usersTable).where(eq(usersTable.email, "signup@test.com"));
    await db.delete(usersTable).where(eq(usersTable.email, "signin@test.com"));
    await db.delete(usersTable).where(eq(usersTable.email, "signout@test.com"));
  });

  describe("POST /auth/signup", () => {
    it("should create a new user successfully", async () => {
      // Arrange
      const signUpData = {
        email: "signup@test.com",
        name: "SignUp User",
        password: "password123"
      };

      const req = new Request('http://localhost/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(signUpData)
      });

      // Act
      const response = await app.request(req);
      
      // Assert
      expect(response.status).toBe(200);
      
      const result = await response.json();
      expect(result.message).toBeDefined();
      expect(result.data).toBeDefined();
      expect(result.data.email).toBe(signUpData.email);
      expect(result.data.name).toBe(signUpData.name);
      expect(result.data.id).toBeNumber();
    });

    it("should return 409 when email already exists", async () => {
      // Arrange - Create user first
      const signUpData = {
        email: "signup@test.com",
        name: "SignUp User",
        password: "password123"
      };

      // Create first user
      const firstReq = new Request('http://localhost/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(signUpData)
      });
      await app.request(firstReq);

      // Try to create another user with same email
      const secondReq = new Request('http://localhost/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(signUpData)
      });

      // Act
      const response = await app.request(secondReq);

      // Assert
      expect(response.status).toBe(409);
      const result = await response.json();
      expect(result.message).toBeDefined();
      expect(result.errors).toBeDefined();
    });

    it("should return 422 for invalid signup data", async () => {
      // Arrange
      const invalidSignUpData = {
        email: "invalid-email",
        name: "A", // Too short
        password: "123" // Too short
      };

      const req = new Request('http://localhost/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(invalidSignUpData)
      });

      // Act
      const response = await app.request(req);

      // Assert
      expect(response.status).toBe(422);
      const result = await response.json();
      expect(result.message).toBeDefined();
      expect(result.errors).toBeDefined();
    });
  });

  describe("POST /auth/signin", () => {
    beforeEach(async () => {
      // Create test user for signin tests
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

    it("should sign in user successfully", async () => {
      // Arrange
      const signInData = {
        email: "signin@test.com",
        password: "password123"
      };

      const req = new Request('http://localhost/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(signInData)
      });

      // Act
      const response = await app.request(req);

      // Assert
      expect(response.status).toBe(200);
      
      const result = await response.json();
      expect(result.message).toBeDefined();
      expect(result.data).toBeDefined();
      expect(result.data.email).toBe(signInData.email);
      expect(result.data.accessToken).toBeDefined();
      expect(result.data.id).toBeNumber();

      // Check refresh token cookie
      const setCookieHeader = response.headers.get('Set-Cookie');
      expect(setCookieHeader).toBeDefined();
      expect(setCookieHeader).toContain('refreshToken=');
    });

    it("should return 400 for invalid email", async () => {
      // Arrange
      const signInData = {
        email: "notfound@test.com",
        password: "password123"
      };

      const req = new Request('http://localhost/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(signInData)
      });

      // Act
      const response = await app.request(req);

      // Assert
      expect(response.status).toBe(400);
      const result = await response.json();
      expect(result.message).toBeDefined();
      expect(result.errors).toBeDefined();
    });

    it("should return 400 for invalid password", async () => {
      // Arrange
      const signInData = {
        email: "signin@test.com",
        password: "wrongpassword"
      };

      const req = new Request('http://localhost/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(signInData)
      });

      // Act
      const response = await app.request(req);

      // Assert
      expect(response.status).toBe(400);
      const result = await response.json();
      expect(result.message).toBeDefined();
      expect(result.errors).toBeDefined();
    });

    it("should return 422 for invalid signin data", async () => {
      // Arrange
      const invalidSignInData = {
        email: "invalid-email",
        password: "123" // Too short
      };

      const req = new Request('http://localhost/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(invalidSignInData)
      });

      // Act
      const response = await app.request(req);

      // Assert
      expect(response.status).toBe(422);
      const result = await response.json();
      expect(result.message).toBeDefined();
      expect(result.errors).toBeDefined();
    });
  });

  describe("POST /auth/refresh-token", () => {
    let refreshToken: string;

    beforeEach(async () => {
      // Create test user and sign in to get refresh token
      const hashedPassword = await hashPassword("password123");
      await db.insert(usersTable).values({
        email: "signin@test.com",
        name: "SignIn User",
        password: hashedPassword,
        roleId: testRoleId,
        createdAt: new Date(),
        createdBy: 1
      });

      // Sign in to get refresh token
      const signInReq = new Request('http://localhost/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: "signin@test.com",
          password: "password123"
        })
      });

      const signInResponse = await app.request(signInReq);
      const setCookieHeader = signInResponse.headers.get('Set-Cookie');
      if (setCookieHeader) {
        const tokenMatch = setCookieHeader.match(/refreshToken=([^;]+)/);
        if (tokenMatch) {
          refreshToken = tokenMatch[1];
        }
      }
    });

    it("should refresh token successfully", async () => {
      // Arrange
      const req = new Request('http://localhost/auth/refresh-token', {
        method: 'POST',
        headers: {
          'Cookie': `refreshToken=${refreshToken}`
        }
      });

      // Act
      const response = await app.request(req);

      // Assert
      expect(response.status).toBe(200);
      
      const result = await response.json();
      expect(result.message).toBeDefined();
      expect(result.data).toBeDefined();
      expect(result.data.accessToken).toBeDefined();
      expect(result.data.id).toBeNumber();
    });

    it("should return 401 when no refresh token provided", async () => {
      // Arrange
      const req = new Request('http://localhost/auth/refresh-token', {
        method: 'POST'
      });

      // Act
      const response = await app.request(req);

      // Assert
      expect(response.status).toBe(401);
      const result = await response.json();
      expect(result.message).toBeDefined();
      expect(result.errors).toBeDefined();
    });
  });

  describe("POST /auth/signout", () => {
    it("should sign out successfully", async () => {
      // Arrange
      const req = new Request('http://localhost/auth/signout', {
        method: 'POST'
      });

      // Act
      const response = await app.request(req);

      // Assert
      expect(response.status).toBe(200);
      
      const result = await response.json();
      expect(result.message).toBeDefined();

      // Check that refresh token cookie is cleared
      const setCookieHeader = response.headers.get('Set-Cookie');
      if (setCookieHeader) {
        expect(setCookieHeader).toContain('refreshToken=;');
      }
    });
  });
});
