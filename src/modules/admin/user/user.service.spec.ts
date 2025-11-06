import { describe, expect, it, beforeEach, mock } from "bun:test";
import { UserService } from "./user.service";
import { UserRepository } from "./user.repository";
import { ConflictError, NotFoundError } from "../../../utils/errors/http.error";
import { CreateUserDTO, UpdateUserDTO, UserQuery, UserResponse, UserInsert } from "./user.type";
import { PaginatedResult } from "../../../utils/helpers/pagination.helper";
import { ERROR_MESSAGES } from "../../../utils/constants/error.constant";

// Create mock function for hashPassword
const mockHashPassword = mock(() => Promise.resolve("hashedPassword123"));

// Mock the pagination helper function
const mockDynamicQueryWithPagination = mock();

// Mock modules
mock.module("../../../utils/helpers/common.helper", () => ({
  hashPassword: mockHashPassword
}));

mock.module("../../../utils/helpers/pagination.helper", () => ({
  dynamicQueryWithPagination: mockDynamicQueryWithPagination
}));

describe("UserService", () => {
  let userService: UserService;
  let mockUserRepository: Partial<UserRepository>;

  // Mock data
  const mockCreateUserDTO: CreateUserDTO = {
    email: "test@example.com",
    name: "Test User",
    password: "password123",
    roleId: 1
  };

  const mockUserResponse: UserResponse = {
    id: 1,
    email: "test@example.com",
    name: "Test User",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    role: {
      id: 1,
      name: "Admin",
      isSuperadmin: false
    },
    createdByUser: {
      id: 1,
      name: "System Admin"
    }
  };

  const mockUpdateUserDTO: UpdateUserDTO = {
    name: "Updated User",
    email: "updated@example.com"
  };

  const mockUserQuery: UserQuery = {
    page: 1,
    pageSize: 10,
    email: "test@example.com",
    name: "Test"
  };

  const mockPaginatedResult: PaginatedResult<UserResponse> = {
    rows: [mockUserResponse],
    pagination: {
      currentPage: 1,
      pageSize: 10,
      totalCount: 1,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false
    }
  };

  beforeEach(() => {
    // Create mock repository with all methods
    mockUserRepository = {
      insert: mock(),
      findById: mock(),
      findByEmail: mock(),
      update: mock(),
      updateByEmail: mock(),
      updatePassword: mock(),
      updateRefreshToken: mock(),
      delete: mock(),
      deleteByEmail: mock()
    };

    // Create service instance with mocked repository
    userService = new UserService(mockUserRepository as UserRepository);

    // Reset all mocks
    mockHashPassword.mockClear();
    mockDynamicQueryWithPagination.mockClear();
    Object.values(mockUserRepository).forEach(mockFn => {
      if (typeof mockFn === 'function' && 'mockClear' in mockFn) {
        (mockFn as any).mockClear();
      }
    });
  });

  describe("create", () => {
    it("should create a new user successfully", async () => {
      // Arrange
      const hashedPassword = "hashedPassword123";
      const createdBy = 1;
      
      (mockUserRepository.findByEmail as any).mockResolvedValue(null);
      mockHashPassword.mockResolvedValue(hashedPassword);
      (mockUserRepository.insert as any).mockResolvedValue(mockUserResponse);

      // Act
      const result = await userService.create(mockCreateUserDTO, createdBy);

      // Assert
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(mockCreateUserDTO.email);
      expect(mockHashPassword).toHaveBeenCalledWith(mockCreateUserDTO.password);
      expect(mockUserRepository.insert).toHaveBeenCalledWith({
        ...mockCreateUserDTO,
        password: hashedPassword,
        createdAt: expect.any(Date),
        createdBy
      });
      expect(result).toEqual(mockUserResponse);
    });

    it("should throw ConflictError when email already exists", async () => {
      // Arrange
      const createdBy = 1;
      (mockUserRepository.findByEmail as any).mockResolvedValue(mockUserResponse);

      // Act & Assert
      await expect(userService.create(mockCreateUserDTO, createdBy))
        .rejects.toThrow(new ConflictError(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS));
      
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(mockCreateUserDTO.email);
      expect(mockUserRepository.insert).not.toHaveBeenCalled();
    });
  });

  describe("getAll", () => {
    it("should return paginated users with filters", async () => {
      // Arrange
      mockDynamicQueryWithPagination.mockResolvedValue(mockPaginatedResult);

      // Act
      const result = await userService.getAll(mockUserQuery);

      // Assert
      expect(mockDynamicQueryWithPagination).toHaveBeenCalledWith(
        expect.anything(), // usersTable
        expect.objectContaining({
          page: mockUserQuery.page,
          pageSize: mockUserQuery.pageSize,
          orderByColumn: expect.anything(),
          where: expect.anything(),
          select: expect.anything()
        })
      );
      expect(result).toEqual(mockPaginatedResult);
    });

    it("should return paginated users without filters", async () => {
      // Arrange
      const queryWithoutFilters: UserQuery = { page: 1, pageSize: 10 };
      mockDynamicQueryWithPagination.mockResolvedValue(mockPaginatedResult);

      // Act
      const result = await userService.getAll(queryWithoutFilters);

      // Assert
      expect(mockDynamicQueryWithPagination).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          page: 1,
          pageSize: 10,
          where: undefined
        })
      );
      expect(result).toEqual(mockPaginatedResult);
    });
  });

  describe("getById", () => {
    it("should return user when found", async () => {
      // Arrange
      const userId = 1;
      (mockUserRepository.findById as any).mockResolvedValue(mockUserResponse);

      // Act
      const result = await userService.getById(userId);

      // Assert
      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
      expect(result).toMatchObject({
        id: mockUserResponse.id,
        email: mockUserResponse.email,
        name: mockUserResponse.name
      });
    });

    it("should throw NotFoundError when user not found", async () => {
      // Arrange
      const userId = 999;
      (mockUserRepository.findById as any).mockResolvedValue(null);

      // Act & Assert
      await expect(userService.getById(userId))
        .rejects.toThrow(new NotFoundError('User Not Found'));
      
      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
    });
  });

  describe("getByEmail", () => {
    it("should return user when found by email", async () => {
      // Arrange
      const email = "test@example.com";
      (mockUserRepository.findByEmail as any).mockResolvedValue(mockUserResponse);

      // Act
      const result = await userService.getByEmail(email);

      // Assert
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(email);
      expect(result).toEqual(mockUserResponse);
    });

    it("should throw NotFoundError when user not found by email", async () => {
      // Arrange
      const email = "notfound@example.com";
      (mockUserRepository.findByEmail as any).mockResolvedValue(null);

      // Act & Assert
      await expect(userService.getByEmail(email))
        .rejects.toThrow(new NotFoundError('User Not Found'));
      
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(email);
    });
  });

  describe("update", () => {
    it("should update user successfully", async () => {
      // Arrange
      const userId = 1;
      const updatedBy = 2;
      const updatedUser = { ...mockUserResponse, ...mockUpdateUserDTO };
      
      (mockUserRepository.findById as any).mockResolvedValue(mockUserResponse);
      (mockUserRepository.update as any).mockResolvedValue(updatedUser);

      // Act
      const result = await userService.update(userId, mockUpdateUserDTO, updatedBy);

      // Assert
      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
      expect(mockUserRepository.update).toHaveBeenCalledWith(userId, {
        ...mockUpdateUserDTO,
        updatedBy,
        updatedAt: expect.any(Date)
      });
      expect(result).toEqual(updatedUser);
    });

    it("should throw NotFoundError when user to update not found", async () => {
      // Arrange
      const userId = 999;
      const updatedBy = 2;
      (mockUserRepository.findById as any).mockResolvedValue(null);

      // Act & Assert
      await expect(userService.update(userId, mockUpdateUserDTO, updatedBy))
        .rejects.toThrow(new NotFoundError('User Not Found'));
      
      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
      expect(mockUserRepository.update).not.toHaveBeenCalled();
    });
  });

  describe("updateByEmail", () => {
    it("should update user by email successfully", async () => {
      // Arrange
      const email = "test@example.com";
      const updatedBy = 2;
      const updatedUser = { ...mockUserResponse, ...mockUpdateUserDTO };
      
      (mockUserRepository.findByEmail as any).mockResolvedValue(mockUserResponse);
      (mockUserRepository.updateByEmail as any).mockResolvedValue(updatedUser);

      // Act
      const result = await userService.updateByEmail(email, mockUpdateUserDTO, updatedBy);

      // Assert
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(email);
      expect(mockUserRepository.updateByEmail).toHaveBeenCalledWith(email, {
        ...mockUpdateUserDTO,
        updatedBy,
        updatedAt: expect.any(Date)
      });
      expect(result).toEqual(updatedUser);
    });

    it("should throw NotFoundError when user to update not found by email", async () => {
      // Arrange
      const email = "notfound@example.com";
      const updatedBy = 2;
      (mockUserRepository.findByEmail as any).mockResolvedValue(null);

      // Act & Assert
      await expect(userService.updateByEmail(email, mockUpdateUserDTO, updatedBy))
        .rejects.toThrow(new NotFoundError('User Not Found'));
      
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(email);
      expect(mockUserRepository.updateByEmail).not.toHaveBeenCalled();
    });
  });

  describe("updatePassword", () => {
    it("should update user password successfully", async () => {
      // Arrange
      const userId = 1;
      const newPassword = "newPassword123";
      const updatedBy = 2;
      const updatedUser = { ...mockUserResponse };
      
      (mockUserRepository.findById as any).mockResolvedValue(mockUserResponse);
      (mockUserRepository.updatePassword as any).mockResolvedValue(updatedUser);

      // Act
      const result = await userService.updatePassword(userId, newPassword, updatedBy);

      // Assert
      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
      expect(mockUserRepository.updatePassword).toHaveBeenCalledWith(userId, newPassword, updatedBy);
      expect(result).toEqual(updatedUser);
    });

    it("should throw NotFoundError when user not found for password update", async () => {
      // Arrange
      const userId = 999;
      const newPassword = "newPassword123";
      const updatedBy = 2;
      (mockUserRepository.findById as any).mockResolvedValue(null);

      // Act & Assert
      await expect(userService.updatePassword(userId, newPassword, updatedBy))
        .rejects.toThrow(new NotFoundError('User Not Found'));
      
      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
      expect(mockUserRepository.updatePassword).not.toHaveBeenCalled();
    });
  });

  describe("updateRefreshToken", () => {
    it("should update refresh token successfully", async () => {
      // Arrange
      const userId = 1;
      const refreshToken = "newRefreshToken";
      
      (mockUserRepository.findById as any).mockResolvedValue(mockUserResponse);
      (mockUserRepository.updateRefreshToken as any).mockResolvedValue(undefined);

      // Act
      await userService.updateRefreshToken(userId, refreshToken);

      // Assert
      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
      expect(mockUserRepository.updateRefreshToken).toHaveBeenCalledWith(userId, refreshToken);
    });

    it("should update refresh token to null", async () => {
      // Arrange
      const userId = 1;
      
      (mockUserRepository.findById as any).mockResolvedValue(mockUserResponse);
      (mockUserRepository.updateRefreshToken as any).mockResolvedValue(undefined);

      // Act
      await userService.updateRefreshToken(userId, null);

      // Assert
      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
      expect(mockUserRepository.updateRefreshToken).toHaveBeenCalledWith(userId, null);
    });

    it("should throw NotFoundError when user not found for refresh token update", async () => {
      // Arrange
      const userId = 999;
      const refreshToken = "newRefreshToken";
      (mockUserRepository.findById as any).mockResolvedValue(null);

      // Act & Assert
      await expect(userService.updateRefreshToken(userId, refreshToken))
        .rejects.toThrow(new NotFoundError('User Not Found'));
      
      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
      expect(mockUserRepository.updateRefreshToken).not.toHaveBeenCalled();
    });
  });

  describe("remove", () => {
    it("should remove user successfully", async () => {
      // Arrange
      const userId = 1;
      (mockUserRepository.delete as any).mockResolvedValue(undefined);

      // Act
      await userService.remove(userId);

      // Assert
      expect(mockUserRepository.delete).toHaveBeenCalledWith(userId);
    });
  });

  describe("removeByEmail", () => {
    it("should remove user by email successfully", async () => {
      // Arrange
      const email = "test@example.com";
      (mockUserRepository.deleteByEmail as any).mockResolvedValue(undefined);

      // Act
      await userService.removeByEmail(email);

      // Assert
      expect(mockUserRepository.deleteByEmail).toHaveBeenCalledWith(email);
    });
  });
});