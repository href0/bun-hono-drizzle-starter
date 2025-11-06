# User Service Tests

## Overview
Unit tests untuk `UserService` menggunakan Bun test runner dengan mock dependencies.

## Structure
```
user.service.spec.ts
├── Mock Setup
│   ├── Mock Repository (UserRepository)
│   ├── Mock hashPassword function
│   └── Mock dynamicQueryWithPagination function
├── Test Suites
│   ├── create() - User creation with validation
│   ├── getAll() - Paginated user listing with filters
│   ├── getById() - User retrieval by ID
│   ├── getByEmail() - User retrieval by email
│   ├── update() - User update by ID
│   ├── updateByEmail() - User update by email
│   ├── updatePassword() - Password update
│   ├── updateRefreshToken() - Refresh token management
│   ├── remove() - User deletion by ID
│   └── removeByEmail() - User deletion by email
```

## Running Tests

### Run specific test file:
```bash
bun test src/modules/admin/user/user.service.spec.ts
```

### Run all tests:
```bash
bun test
```

### Run with coverage:
```bash
bun test --coverage
```

## Mock Strategy

### Repository Mocking
- All repository methods are mocked using `mock()` function from Bun
- Each test scenario configures specific mock behaviors
- Return values match expected service contracts

### External Dependencies
- `hashPassword` function is mocked using `mock.module()`
- `dynamicQueryWithPagination` helper is mocked for pagination tests

### Data Mocking
```typescript
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
```

## Test Coverage

### Positive Cases ✅
- Successful CRUD operations
- Proper data transformation
- Correct method calls to repository
- Expected return values

### Error Cases ✅
- Email already exists (ConflictError)
- User not found scenarios (NotFoundError)
- Validation of error messages
- Repository method call verification

### Edge Cases ✅
- Empty filter queries
- Null refresh token updates
- Password updates with validation

## Key Testing Patterns

1. **Arrange-Act-Assert (AAA)** pattern
2. **Mock isolation** - Each test has isolated mock state
3. **Error verification** - Testing both success and failure paths
4. **Call verification** - Ensuring correct method calls with expected parameters
5. **Return value validation** - Verifying service output matches expectations

## Bun-Specific Features Used

- `mock()` function for creating mocks
- `mock.module()` for module mocking
- `beforeEach()` for test setup
- `expect().toHaveBeenCalledWith()` for call verification
- `expect().rejects.toThrow()` for async error testing