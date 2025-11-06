import { describe, expect, it, beforeEach, mock } from "bun:test";
import { AuthService } from "./auth.service";
import { AuthRepository } from "./auth.repository";
import { UserService } from "../admin/user/user.service";
import { ConflictError, BadRequestError } from "../../utils/errors/http.error";
import { ERROR_MESSAGES } from "../../utils/constants/error.constant";
import { createAuthService } from "./auth.instance";

// Mock the hash password function
const mockHashPassword = mock(() => Promise.resolve("hashedPassword123"));
mock.module("../../utils/helpers/common.helper", () => ({
  hashPassword: mockHashPassword
}));

// Mock the JWT helper
const mockGenerateJWT = mock(() => Promise.resolve("mock-jwt-token"));
mock.module("../../utils/helpers/jwt.helper", () => ({
  generateJWT: mockGenerateJWT,
  TokenType: { ACCESS: "access", REFRESH: "refresh" }
}));

describe("AuthService", () => {
  let authService: AuthService;
  let mockAuthRepository: Partial<AuthRepository>;
  let mockUserService: Partial<UserService>;

  beforeEach(() => {
    // Create mock repositories
    mockAuthRepository = {
      checkEmailExists: mock(),
      signUp: mock(),
      signIn: mock(),
      getRefreshToken: mock()
    };

    mockUserService = {
      updateRefreshToken: mock()
    };

    // Create service instance using createAuthService
    authService = createAuthService(mockAuthRepository as AuthRepository);
    // Override userService dependency
    (authService as any).userService = mockUserService;

    // Reset all mocks
    mockHashPassword.mockClear();
    mockGenerateJWT.mockClear();
    Object.values(mockAuthRepository).forEach(mockFn => {
      if (typeof mockFn === 'function' && 'mockClear' in mockFn) {
        (mockFn as any).mockClear();
      }
    });
    Object.values(mockUserService).forEach(mockFn => {
      if (typeof mockFn === 'function' && 'mockClear' in mockFn) {
        (mockFn as any).mockClear();
      }
    });
  });

  describe("signUp", () => {
    it("should create a new user successfully", async () => {
      // Arrange
      const mockSignUpData = {
        email: "test@example.com",
        name: "Test User",
        password: "password123"
      };

      const mockUserResponse = {
        id: 1,
        email: "test@example.com",
        name: "Test User",
        createdAt: new Date(),
        updatedAt: new Date(),
        role: {
          id: 1,
          name: "User",
          isSuperadmin: false
        },
        createdByUser: {
          id: 1,
          name: "System"
        }
      };

      (mockAuthRepository.checkEmailExists as any).mockResolvedValue(false);
      (mockAuthRepository.signUp as any).mockResolvedValue(mockUserResponse);

      // Act
      const result = await authService.signUp(mockSignUpData);

      // Assert
      expect(mockAuthRepository.checkEmailExists).toHaveBeenCalledWith(mockSignUpData.email);
      // Note: hashPassword is called but with mutated object, so we just check it was called
      expect(mockHashPassword).toHaveBeenCalled();
      expect(mockAuthRepository.signUp).toHaveBeenCalled();
      expect(result).toEqual(mockUserResponse);
    });

    it("should throw ConflictError when email already exists", async () => {
      // Arrange
      const mockSignUpData = {
        email: "test@example.com",
        name: "Test User",
        password: "password123"
      };

      (mockAuthRepository.checkEmailExists as any).mockResolvedValue(true);

      // Act & Assert
      await expect(authService.signUp(mockSignUpData))
        .rejects.toThrow(new ConflictError(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS));
      
      expect(mockAuthRepository.checkEmailExists).toHaveBeenCalledWith(mockSignUpData.email);
      expect(mockAuthRepository.signUp).not.toHaveBeenCalled();
    });
  });

  describe("signIn", () => {
    it("should sign in user successfully", async () => {
      // Arrange
      const email = "test@example.com";
      const password = "password123";
      const mockUser = {
        id: 1,
        email: "test@example.com",
        name: "Test User",
        password: await Bun.password.hash("password123"), // Use real hash for this test
        roleId: 1,
        refreshToken: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 1,
        updatedBy: null
      };

      (mockAuthRepository.signIn as any).mockResolvedValue(mockUser);
      mockGenerateJWT.mockResolvedValueOnce("access-token");
      mockGenerateJWT.mockResolvedValueOnce("refresh-token");
      (mockUserService.updateRefreshToken as any).mockResolvedValue(undefined);

      // Act
      const result = await authService.signIn(email, password);

      // Assert
      expect(mockAuthRepository.signIn).toHaveBeenCalledWith(email);
      expect(mockGenerateJWT).toHaveBeenCalledTimes(2);
      expect(mockUserService.updateRefreshToken).toHaveBeenCalledWith(mockUser.id, "refresh-token");
      
      expect(result.result).toMatchObject({
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
        accessToken: "access-token"
      });
      expect(result.refreshToken).toBe("refresh-token");
    });

    it("should throw BadRequestError when user not found", async () => {
      // Arrange
      const email = "notfound@example.com";
      const password = "password123";
      (mockAuthRepository.signIn as any).mockResolvedValue(null);

      // Act & Assert
      await expect(authService.signIn(email, password))
        .rejects.toThrow(new BadRequestError(ERROR_MESSAGES.INVALID_EMAIL_OR_PASSWORD));
      
      expect(mockAuthRepository.signIn).toHaveBeenCalledWith(email);
    });

    it("should throw BadRequestError when password is invalid", async () => {
      // Arrange
      const email = "test@example.com";
      const password = "wrongpassword";
      const mockUser = {
        id: 1,
        email: "test@example.com",
        name: "Test User",
        password: await Bun.password.hash("password123"), // Different password
        roleId: 1,
        refreshToken: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 1,
        updatedBy: null
      };

      (mockAuthRepository.signIn as any).mockResolvedValue(mockUser);

      // Act & Assert
      await expect(authService.signIn(email, password))
        .rejects.toThrow(new BadRequestError(ERROR_MESSAGES.INVALID_EMAIL_OR_PASSWORD));
      
      expect(mockAuthRepository.signIn).toHaveBeenCalledWith(email);
    });
  });

  describe("signOut", () => {
    it("should sign out user successfully", async () => {
      // Arrange
      const email = "test@example.com";
      const refreshToken = "valid-refresh-token";
      const mockRefreshTokenData = { id: 1, refreshToken: "valid-refresh-token" };
      (mockAuthRepository.getRefreshToken as any).mockResolvedValue(mockRefreshTokenData);
      (mockUserService.updateRefreshToken as any).mockResolvedValue(undefined);

      // Act
      await authService.signOut(email, refreshToken);

      // Assert
      expect(mockAuthRepository.getRefreshToken).toHaveBeenCalledWith(email, refreshToken);
      expect(mockUserService.updateRefreshToken).toHaveBeenCalledWith(mockRefreshTokenData.id, null);
    });

    it("should return early when refresh token is invalid", async () => {
      // Arrange
      const email = "test@example.com";
      const refreshToken = "invalid-refresh-token";
      (mockAuthRepository.getRefreshToken as any).mockResolvedValue(null);

      // Act
      await authService.signOut(email, refreshToken);

      // Assert
      expect(mockAuthRepository.getRefreshToken).toHaveBeenCalledWith(email, refreshToken);
      expect(mockUserService.updateRefreshToken).not.toHaveBeenCalled();
    });
  });
});
