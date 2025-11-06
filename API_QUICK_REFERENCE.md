# API Quick Reference

## Base URL: `http://localhost:8888`

## 🔐 Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/signup` | Register new user | ❌ |
| POST | `/api/auth/signin` | User login | ❌ |
| POST | `/api/auth/refresh-token` | Refresh access token | 🍪 Cookie |
| POST | `/api/auth/signout` | User logout | ✅ Bearer |

## 👥 User Management

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/admin/user` | Get all users (paginated) | ✅ Bearer + Admin |
| GET | `/api/admin/user/{id}` | Get user by ID | ✅ Bearer + Admin |
| POST | `/api/admin/user` | Create new user | ✅ Bearer + Admin |
| PUT | `/api/admin/user/{id}` | Update user | ✅ Bearer + Admin |
| PATCH | `/api/admin/user/{id}/password` | Update user password | ✅ Bearer + Admin |
| DELETE | `/api/admin/user/{id}` | Delete user | ✅ Bearer + Admin |

## 📋 Request Examples

### Sign Up
```bash
curl -X POST http://localhost:8888/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@gmail.com",
    "name": "john doe",
    "password": "password123"
  }'
```

### Sign In
```bash
curl -X POST http://localhost:8888/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@gmail.com", 
    "password": "password123"
  }'
```

### Get All Users (with pagination)
```bash
curl -X GET "http://localhost:8888/api/admin/user?page=1&limit=10" \
  -H "Authorization: Bearer <access_token>"
```

### Create User
```bash
curl -X POST http://localhost:8888/api/admin/user \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@gmail.com",
    "name": "new user",
    "password": "password123",
    "roleId": 2
  }'
```

## 🔑 Authentication Flow

1. **Sign Up/Sign In** → Get `accessToken` + `refreshToken` (in cookie)
2. **API Calls** → Use `Authorization: Bearer <accessToken>`
3. **Token Refresh** → Use `refreshToken` cookie to get new `accessToken`
4. **Sign Out** → Invalidate tokens

## 📝 Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* response data */ },
  "pagination": { /* if paginated */ }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": [ /* validation errors if any */ ]
}
```

## ⚠️ Common Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict (e.g., email exists) |
| 422 | Validation Error |
| 500 | Server Error |

## 🛠️ Development

- **Swagger UI:** http://localhost:8888/swagger-doc
- **Test:** `bun test`
- **Dev Server:** `bun dev`