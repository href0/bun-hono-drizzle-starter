// process.env.NODE_ENV = 'test';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "bun:test";
import { OpenAPIHono } from "@hono/zod-openapi";
import userHandler from "../../src/modules/admin/user/user.handler";
import { db } from "../../src/config/db.config";
import { usersTable } from "../../src/models/user.model";
import { rolesTable } from "../../src/models/role.model";
import { eq } from "drizzle-orm";
import { hashPassword } from "../../src/utils/helpers/common.helper";
import { authMiddleware } from "../../src/middlewares/auth.middleware";
import { generateJWT, TokenType } from "../../src/utils/helpers/jwt.helper";
import { errorHandler } from "../../src/middlewares/error.middleware";

describe("User Routes E2E Tests -", () => {
  let accessToken: string;
  let testUserId: number;
  let testRoleId: number;
  let adminUserId: number;
  let app: OpenAPIHono;

  beforeAll(async () => {
    // Setup test app with middleware
    app = new OpenAPIHono();
    
    // Add error handling first
    app.onError(errorHandler);
    
    // Add auth middleware
    app.use('/users/*', authMiddleware);
    app.route('/users', userHandler);

    // Create test role
    const [testRole] = await db.insert(rolesTable).values({
      name: "test-admin-role",
      isSuperadmin: true,
      createdAt: new Date(),
      createdBy: 1
    }).returning({ id: rolesTable.id });
    testRoleId = testRole.id;

    // Create admin user for authentication
    const hashedPassword = await hashPassword("password123");
    const [adminUser] = await db.insert(usersTable).values({
      name: "Admin User",
      email: "admin@test.com",
      password: hashedPassword,
      roleId: testRoleId,
      createdAt: new Date(),
      createdBy: 1
    }).returning({ id: usersTable.id });
    adminUserId = adminUser.id;

    // Generate access token for authenticated requests
    accessToken = await generateJWT({ sub: adminUserId, name: "Admin User", email: "admin@test.com" }, TokenType.ACCESS);
  });

  afterAll(async () => {
    // Clean up test data
    await db.delete(usersTable).where(eq(usersTable.email, "admin@test.com"));
    await db.delete(usersTable).where(eq(usersTable.email, "newuser@test.com"));
    await db.delete(rolesTable).where(eq(rolesTable.name, "test-admin-role"));
  });

  beforeEach(async () => {
    // Clean up test user before each test
    await db.delete(usersTable).where(eq(usersTable.email, "newuser@test.com"));
  });

  describe("POST /users", () => {
    it("should create a new user successfully", async () => {
      const userData = {
        name: "New Test User",
        email: "newuser@test.com",
        password: "password123",
        roleId: testRoleId
      };

      const req = new Request('http://localhost/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(userData)
      });

      const response = await app.request(req);
      
      expect(response.status).toBe(201);
      
      const result = await response.json();
      expect(result.message).toBeDefined();
      expect(result.data).toBeDefined();
      expect(result.data.name).toBe(userData.name);
      expect(result.data.email).toBe(userData.email);
      expect(result.data.id).toBeNumber();
      
      testUserId = result.data.id;
    });

    it("should return 409 when creating user with existing email", async () => {
      const userData = {
        name: "New Test User",
        email: "newuser@test.com",
        password: "password123",
        roleId: testRoleId
      };

      // Create first user
      const firstReq = new Request('http://localhost/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(userData)
      });
      await app.request(firstReq);

      // Try to create another user with same email
      const secondReq = new Request('http://localhost/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(userData)
      });
      const response = await app.request(secondReq);

      expect(response.status).toBe(409);
      
      const result = await response.json();
      expect(result.message).toBeDefined();
      expect(result.errors).toBeDefined();
    });

    it("should return 422 for invalid user data", async () => {
      const invalidUserData = {
        name: "A", // Too short name
        email: "invalid-email", // Invalid email format
        password: "123", // Too short password
      };

      const req = new Request('http://localhost/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(invalidUserData)
      });

      const response = await app.request(req);

      expect(response.status).toBe(422);
      
      const result = await response.json();
      expect(result.message).toBeDefined();
      expect(result.errors).toBeDefined();
    });

    it("should return 401 without authorization header", async () => {
      const userData = {
        name: "New Test User",
        email: "newuser@test.com",
        password: "password123",
        roleId: testRoleId
      };

      const req = new Request('http://localhost/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      const response = await app.request(req);

      expect(response.status).toBe(401);
      
      const result = await response.json();
      expect(result.message).toBeDefined();
      expect(result.errors).toBeDefined();
    });
  });

  describe("GET /users", () => {
    beforeEach(async () => {
      // Create test user for get operations
      const userData = {
        name: "Test Get User",
        email: "newuser@test.com",
        password: "password123",
        roleId: testRoleId
      };

      const req = new Request('http://localhost/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(userData)
      });
      
      const response = await app.request(req);
      const result = await response.json();
      testUserId = result.data.id;
    });

    it("should get all users with pagination", async () => {
      const req = new Request('http://localhost/users?page=1&pageSize=10', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      const response = await app.request(req);

      expect(response.status).toBe(200);
      
      const result = await response.json();
      expect(result.message).toBeDefined();
      expect(result.data).toBeArray();
      expect(result.meta.pagination).toBeDefined();
      expect(result.meta.pagination.currentPage).toBe(1);
      expect(result.meta.pagination.pageSize).toBe(10);
    });

    it("should filter users by email", async () => {
      const req = new Request('http://localhost/users?page=1&pageSize=10&email=newuser@test.com', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      const response = await app.request(req);

      expect(response.status).toBe(200);
      
      const result = await response.json();
      expect(result.message).toBeDefined();
      expect(result.data).toBeArray();
    });
  });

  describe("GET /users/:id", () => {
    beforeEach(async () => {
      // Create test user
      const userData = {
        name: "Test Get User",
        email: "newuser@test.com",
        password: "password123",
        roleId: testRoleId
      };

      const req = new Request('http://localhost/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(userData)
      });
      
      const response = await app.request(req);
      const result = await response.json();
      testUserId = result.data.id;
    });

    it("should get user by id", async () => {
      const req = new Request(`http://localhost/users/${testUserId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      const response = await app.request(req);

      expect(response.status).toBe(200);
      
      const result = await response.json();
      expect(result.message).toBeDefined();
      expect(result.data.id).toBe(testUserId);
      expect(result.data.name).toBe("Test Get User");
      expect(result.data.email).toBe("newuser@test.com");
    });

    it("should return 404 for non-existent user", async () => {
      const req = new Request('http://localhost/users/99999', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      const response = await app.request(req);

      expect(response.status).toBe(404);
      
      const result = await response.json();
      expect(result.message).toBeDefined();
      expect(result.errors).toBeDefined();
    });
  });

  describe("PUT /users/:id", () => {
    beforeEach(async () => {
      // Create test user
      const userData = {
        name: "Test Update User",
        email: "newuser@test.com",
        password: "password123",
        roleId: testRoleId
      };

      const req = new Request('http://localhost/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(userData)
      });
      
      const response = await app.request(req);
      const result = await response.json();
      testUserId = result.data.id;
    });

    it("should update user successfully", async () => {
      const updateData = {
        name: "Updated Test User"
      };

      const req = new Request(`http://localhost/users/${testUserId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(updateData)
      });

      const response = await app.request(req);

      expect(response.status).toBe(200);
      
      const result = await response.json();
      expect(result.message).toBeDefined();
      expect(result.data.name).toBe("Updated Test User");
      expect(result.data.email).toBe("newuser@test.com"); // Should remain unchanged
    });

    it("should return 404 when updating non-existent user", async () => {
      const updateData = {
        name: "Updated Name"
      };

      const req = new Request('http://localhost/users/99999', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(updateData)
      });

      const response = await app.request(req);

      expect(response.status).toBe(404);
      
      const result = await response.json();
      expect(result.message).toBeDefined();
      expect(result.errors).toBeDefined();
    });

    it("should return 422 for invalid update data", async () => {
      const invalidUpdateData = {
        name: "A" // Too short name
      };

      const req = new Request(`http://localhost/users/${testUserId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(invalidUpdateData)
      });

      const response = await app.request(req);

      expect(response.status).toBe(422);
      
      const result = await response.json();
      expect(result.message).toBeDefined();
      expect(result.errors).toBeDefined();
    });
  });

  describe("PATCH /users/:id/password", () => {
    beforeEach(async () => {
      // Create test user
      const userData = {
        name: "Test Password User",
        email: "newuser@test.com",
        password: "password123",
        roleId: testRoleId
      };

      const req = new Request('http://localhost/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(userData)
      });
      
      const response = await app.request(req);
      const result = await response.json();
      testUserId = result.data.id;
    });

    it("should update user password successfully", async () => {
      const passwordData = {
        password: "newPassword123"
      };

      const req = new Request(`http://localhost/users/${testUserId}/password`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(passwordData)
      });

      const response = await app.request(req);

      expect(response.status).toBe(200);
      
      const result = await response.json();
      expect(result.message).toBeDefined();
      expect(result.data.id).toBe(testUserId);
    });

    it("should return 404 when updating password for non-existent user", async () => {
      const passwordData = {
        password: "newPassword123"
      };

      const req = new Request('http://localhost/users/99999/password', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(passwordData)
      });

      const response = await app.request(req);

      expect(response.status).toBe(404);
      
      const result = await response.json();
      expect(result.message).toBeDefined();
      expect(result.errors).toBeDefined();
    });

    it("should return 422 for invalid password", async () => {
      const invalidPasswordData = {
        password: "123" // Too short password
      };

      const req = new Request(`http://localhost/users/${testUserId}/password`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(invalidPasswordData)
      });

      const response = await app.request(req);

      expect(response.status).toBe(422);
      
      const result = await response.json();
      expect(result.message).toBeDefined();
      expect(result.errors).toBeDefined();
    });
  });

  describe("DELETE /users/:id", () => {
    beforeEach(async () => {
      // Create test user
      const userData = {
        name: "Test Delete User",
        email: "newuser@test.com",
        password: "password123",
        roleId: testRoleId
      };

      const req = new Request('http://localhost/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(userData)
      });
      
      const response = await app.request(req);
      const result = await response.json();
      testUserId = result.data.id;
    });

    it("should delete user successfully", async () => {
      const req = new Request(`http://localhost/users/${testUserId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      const response = await app.request(req);

      expect(response.status).toBe(200);
      
      const result = await response.json();
      expect(result.message).toBeDefined();

      // Verify user was deleted
      const getReq = new Request(`http://localhost/users/${testUserId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      
      const getResponse = await app.request(getReq);
      expect(getResponse.status).toBe(404);
    });

    it("should return success even when deleting non-existent user", async () => {
      const req = new Request('http://localhost/users/99999', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      const response = await app.request(req);

      expect(response.status).toBe(200);
      
      const result = await response.json();
      expect(result.message).toBeDefined();
    });
  });
});