# API Specification - Bun Hono Drizzle Starter

## Base Information

- **Base URL:** `http://localhost:8888`
- **API Version:** `v1.0.0`
- **Content Type:** `application/json`
- **Documentation:** `http://localhost:8888/swagger-doc`

## Authentication

### Bearer Token
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <access_token>
```

## Authentication Endpoints

### 1. Sign Up

**POST** `/api/auth/signup`

Create a new user account.

**Request Body:**
```json
{
  "email": "john@gmail.com",
  "name": "john doe",
  "password": "password"
}
```

**Validation Rules:**
- `email`: Valid email format, required
- `name`: Minimum 5 characters, required
- `password`: Minimum 6 characters, required

**Success Response (201):**
```json
{
  "success": true,
  "message": "Sign up success",
  "data": {
    "id": 1,
    "email": "john@gmail.com",
    "name": "john doe",
    "createdAt": "2024-10-28T00:00:00.000Z",
    "updatedAt": "2024-10-28T00:00:00.000Z",
    "role": {
      "id": 2,
      "name": "editor",
      "isSuperadmin": false
    },
    "createdByUser": null
  }
}
```

**Error Responses:**
- **409 Conflict:** Email already exists
- **422 Unprocessable Entity:** Validation errors

---

### 2. Sign In

**POST** `/api/auth/signin`

Authenticate user and get access token.

**Request Body:**
```json
{
  "email": "john@gmail.com",
  "password": "password"
}
```

**Validation Rules:**
- `email`: Valid email format, required
- `password`: Minimum 6 characters, required

**Success Response (200):**
```json
{
  "success": true,
  "message": "Sign in success",
  "data": {
    "id": 1,
    "email": "john@gmail.com",
    "name": "john doe",
    "createdAt": "2024-10-28T00:00:00.000Z",
    "updatedAt": "2024-10-28T00:00:00.000Z",
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Response Headers:**
- `Set-Cookie`: `refreshToken=<refresh_token>; HttpOnly; Path=/; Max-Age=2592000`

**Error Responses:**
- **400 Bad Request:** Invalid email or password
- **422 Unprocessable Entity:** Validation errors

---

### 3. Refresh Token

**POST** `/api/auth/refresh-token`

Refresh access token using refresh token from cookies.

**Request Headers:**
- `Cookie`: `refreshToken=<refresh_token>`

**Success Response (200):**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "id": 1,
    "email": "john@gmail.com",
    "name": "john doe",
    "createdAt": "2024-10-28T00:00:00.000Z",
    "updatedAt": "2024-10-28T00:00:00.000Z",
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**
- **401 Unauthorized:** Invalid or expired refresh token

---

### 4. Sign Out

**POST** `/api/auth/signout`

Sign out user and invalidate refresh token.

**Request Headers:**
- `Authorization`: `Bearer <access_token>`
- `Cookie`: `refreshToken=<refresh_token>`

**Success Response (200):**
```json
{
  "success": true,
  "message": "Sign out successfully",
  "data": null
}
```

**Response Headers:**
- `Set-Cookie`: `refreshToken=; HttpOnly; Path=/; Max-Age=0` (clears cookie)

---

## User Management Endpoints

> **Note:** All user management endpoints require authentication and appropriate permissions.

### 1. Get All Users

**GET** `/api/admin/user`

Retrieve paginated list of users with optional filtering.

**Request Headers:**
- `Authorization`: `Bearer <access_token>`

**Query Parameters:**
```
?page=1&limit=10&email=john@gmail.com&name=john
```

**Parameters:**
- `page` (optional): Page number, default: 1
- `limit` (optional): Items per page, default: 10
- `email` (optional): Filter by email
- `name` (optional): Filter by name

**Success Response (200):**
```json
{
  "success": true,
  "message": "Get all user with pagination",
  "data": [
    {
      "id": 1,
      "email": "john@gmail.com",
      "name": "john doe",
      "createdAt": "2024-10-28T00:00:00.000Z",
      "updatedAt": "2024-10-28T00:00:00.000Z",
      "role": {
        "id": 2,
        "name": "editor",
        "isSuperadmin": false
      },
      "createdByUser": {
        "id": 1,
        "name": "admin user"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

### 2. Get User by ID

**GET** `/api/admin/user/{id}`

Retrieve detailed information about a specific user.

**Request Headers:**
- `Authorization`: `Bearer <access_token>`

**Path Parameters:**
- `id`: User ID (integer)

**Success Response (200):**
```json
{
  "success": true,
  "message": "Get User by ID",
  "data": {
    "id": 1,
    "email": "john@gmail.com",
    "name": "john doe",
    "createdAt": "2024-10-28T00:00:00.000Z",
    "updatedAt": "2024-10-28T00:00:00.000Z",
    "role": {
      "id": 2,
      "name": "editor",
      "isSuperadmin": false
    },
    "createdByUser": {
      "id": 1,
      "name": "admin user"
    },
    "permissions": []
  }
}
```

**Error Responses:**
- **404 Not Found:** User not found

---

### 3. Create User

**POST** `/api/admin/user`

Create a new user (admin only).

**Request Headers:**
- `Authorization`: `Bearer <access_token>`

**Request Body:**
```json
{
  "email": "newuser@gmail.com",
  "name": "new user",
  "password": "password123",
  "roleId": 2
}
```

**Validation Rules:**
- `email`: Valid email format, required
- `name`: Minimum 5 characters, required
- `password`: Minimum 6 characters, required
- `roleId`: Integer, optional (defaults to basic role)

**Success Response (201):**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": 2,
    "email": "newuser@gmail.com",
    "name": "new user",
    "createdAt": "2024-10-28T00:00:00.000Z",
    "updatedAt": "2024-10-28T00:00:00.000Z",
    "role": {
      "id": 2,
      "name": "editor",
      "isSuperadmin": false
    },
    "createdByUser": {
      "id": 1,
      "name": "admin user"
    }
  }
}
```

**Error Responses:**
- **409 Conflict:** Email already exists
- **422 Unprocessable Entity:** Validation errors

---

### 4. Update User

**PUT** `/api/admin/user/{id}`

Update user information.

**Request Headers:**
- `Authorization`: `Bearer <access_token>`

**Path Parameters:**
- `id`: User ID (integer)

**Request Body:**
```json
{
  "email": "updated@gmail.com",
  "name": "updated name"
}
```

**Validation Rules:**
- `email`: Valid email format, optional
- `name`: Minimum 5 characters, required

**Success Response (200):**
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "id": 2,
    "email": "updated@gmail.com",
    "name": "updated name",
    "createdAt": "2024-10-28T00:00:00.000Z",
    "updatedAt": "2024-10-28T00:00:00.000Z",
    "role": {
      "id": 2,
      "name": "editor",
      "isSuperadmin": false
    },
    "createdByUser": {
      "id": 1,
      "name": "admin user"
    }
  }
}
```

**Error Responses:**
- **404 Not Found:** User not found
- **409 Conflict:** Email already exists
- **422 Unprocessable Entity:** Validation errors

---

### 5. Update User Password

**PATCH** `/api/admin/user/{id}/password`

Update user password.

**Request Headers:**
- `Authorization`: `Bearer <access_token>`

**Path Parameters:**
- `id`: User ID (integer)

**Request Body:**
```json
{
  "password": "newpassword123"
}
```

**Validation Rules:**
- `password`: Minimum 6 characters, required

**Success Response (200):**
```json
{
  "success": true,
  "message": "User password updated successfully",
  "data": {
    "id": 2,
    "email": "user@gmail.com",
    "name": "user name",
    "createdAt": "2024-10-28T00:00:00.000Z",
    "updatedAt": "2024-10-28T00:00:00.000Z",
    "role": {
      "id": 2,
      "name": "editor",
      "isSuperadmin": false
    },
    "createdByUser": {
      "id": 1,
      "name": "admin user"
    }
  }
}
```

**Error Responses:**
- **404 Not Found:** User not found
- **422 Unprocessable Entity:** Validation errors

---

### 6. Delete User

**DELETE** `/api/admin/user/{id}`

Delete a user.

**Request Headers:**
- `Authorization`: `Bearer <access_token>`

**Path Parameters:**
- `id`: User ID (integer)

**Success Response (200):**
```json
{
  "success": true,
  "message": "User deleted successfully",
  "data": null
}
```

**Error Responses:**
- **404 Not Found:** User not found

---

## Error Response Format

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [] // Optional, for validation errors
}
```

### Common HTTP Status Codes

- **200 OK:** Successful GET, PUT, PATCH, DELETE
- **201 Created:** Successful POST
- **400 Bad Request:** Invalid request data
- **401 Unauthorized:** Missing or invalid authentication
- **403 Forbidden:** Insufficient permissions
- **404 Not Found:** Resource not found
- **409 Conflict:** Resource conflict (e.g., duplicate email)
- **422 Unprocessable Entity:** Validation errors
- **500 Internal Server Error:** Server error

## Security Features

### Password Security
- Passwords are hashed using Argon2
- Minimum 6 characters required

### JWT Tokens
- **Access Token:** 15 minutes expiry
- **Refresh Token:** 30 days expiry, stored in HttpOnly cookies

### CORS Configuration
- Allowed origins: `http://localhost:5173`, `http://localhost:3000`

### Rate Limiting
- Implemented for authentication endpoints

## Development

### Testing
- Run tests: `bun test`
- E2E tests available for all endpoints

### Environment Variables
Required environment variables:
- `DATABASE_URL`
- `ACCESS_TOKEN_SECRET_KEY`
- `REFRESH_TOKEN_SECRET_KEY`
- `PORT` (default: 8888)
- `NODE_ENV`

### Database
- PostgreSQL with Drizzle ORM
- Automatic migrations on startup