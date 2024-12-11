# Project Structure

```
├── drizzle/
│   └── meta/
│       ├── 0000_far_grandmaster.sql
│       ├── 0001_calm_abomination.sql
│       └── 0002_shiny_proudstar.sql
├── src/
│   ├── api/
│   │   ├── auth/
│   │   └── user/
│   │       ├── user.handler.ts
│   │       ├── user.query.ts
│   │       ├── user.schema.ts
│   │       ├── user.service.ts
│   │       ├── user.type.ts
│   │       └── index.ts
│   ├── config/
│   │   ├── app.config.ts
│   │   └── db.config.ts
│   ├── models/
│   │   └── user.model.ts
│   ├── seeders/
│   │   └── user.seeder.ts
│   ├── utils/
│   │   ├── constants/
│   │       ├── app.constant.ts
│   │       ├── error.constant.ts
│   │   ├── errors/
│   │       ├── base.error.ts
│   │       ├── http.error.ts
│   │       ├── response.error.ts
│   │       ├── response.error.ts
│   │   └── helpers/
│   │       ├── common.helper.ts
│   │       ├── date.helper.ts
│   │       ├── open-api-response.helper.ts
│   │       ├── pagination.helper.ts
│   │       └── response.helper.ts
│   ├── interfaces/
│   ├── middlewares/
│   │   ├── error.middleware.ts
│   │   └── logger.middleware.ts
│   ├── schemas/
│   │   └── common.schema.ts
│   └── types/
│       └── index.ts
├── .env
├── .gitignore
├── bun.lockb
├── drizzle.config.ts
├── package.json
└── README.md
```

## Struktur Utils

### 1. Constants (`utils/constants/`)
Menyimpan nilai-nilai konstan yang digunakan di seluruh aplikasi:
```typescript
// app.constants.ts
export const APP_NAME = 'MyApp';
export const API_VERSION = 'v1';
export const DEFAULT_LIMIT = 10;

// error.constants.ts
export const ERROR_MESSAGES = {
  NOT_FOUND: 'Resource not found',
  UNAUTHORIZED: 'Unauthorized access',
  VALIDATION_ERROR: 'Validation failed'
};

// regex.constants.ts
export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
};
```

### 2. Helpers (`utils/helpers/`)
Fungsi-fungsi utilitas yang reusable:
```typescript
// date.helper.ts
export const formatDate = (date: Date): string => {
  // implementation
};

// string.helper.ts
export const slugify = (str: string): string => {
  // implementation
};

// file.helper.ts
export const getFileExtension = (filename: string): string => {
  // implementation
};
```

### 3. Middlewares (`utils/middlewares/`)
Middleware yang digunakan di seluruh aplikasi:
```typescript
// error.middleware.ts
export const errorHandler = async (error: Error, c: Context) => {
  // implementation
};

// auth.middleware.ts
export const authenticate = async (c: Context, next: Next) => {
  // implementation
};
```

### 4. Interfaces (`utils/interfaces/`)
Shared interfaces yang digunakan di banyak tempat:
```typescript
// response.interface.ts
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// request.interface.ts
export interface PaginationQuery {
  page?: number;
  limit?: number;
  sort?: string;
}
```

### 5. Types (`utils/types/`)
Custom types dan type guards:
```typescript
// common.types.ts
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;

export type RequestQuery = {
  [key: string]: string | string[] | undefined;
};
```

### 6. Errors (`utils/errors/`)
Custom error handlers:
```typescript
// base.error.ts
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public status: string,
    message: string
  ) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
  }
}

// http.error.ts
export class HttpError extends AppError {
  constructor(statusCode: number, message: string) {
    super(statusCode, 'HTTP Error', message);
  }
}
```

## Keuntungan Struktur Utils

1. **Better Organization**
   - File-file utilitas terorganisir dengan baik
   - Mudah menemukan fungsi yang dibutuhkan
   - Pemisahan concern yang jelas

2. **Reusability**
   - Fungsi-fungsi utility bisa digunakan di mana saja
   - Mengurangi duplikasi kode
   - Maintenance lebih mudah

3. **Scalability**
   - Mudah menambahkan utility baru
   - Struktur yang jelas untuk pengembangan
   - Modular dan terorganisir

4. **Type Safety**
   - Types dan interfaces terpusat
   - Konsistensi dalam penggunaan types
   - Better TypeScript support