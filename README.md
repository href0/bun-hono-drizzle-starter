# Bun Hono Drizzle Starter

A production-ready starter template to jumpstart your next API project. This template provides a solid foundation with pre-configured Bun, Hono, and Drizzle ORM setup, allowing you to focus on building your application logic rather than setting up the infrastructure.

## Why Use This Starter?

Save hours of initial setup time with a pre-configured project that includes:

- 🚀 Build with Bun + Hono + Drizzle
  - High-performance web framework
  - Type-safe database operations
  - Next-generation JavaScript runtime
- 📚 Ready-to-use OpenAPI/Swagger documentation
  - Instantly available at `/swagger-doc`
  - Interactive API testing interface
  - Automatic schema generation
  - API documentation auto-generation
- 🔄 Built-in query pagination system
  - Cursor-based pagination
  - Offset/limit pagination
  - Configurable page sizes
- 🛡️ Full TypeScript support for type safety
  - Strict type checking
  - Type inference
  - Interface definitions
- 🗃️ Database migration system with Drizzle ORM
  - Automated migration generation
  - Version control for schema
  - Type-safe schema definition
- 🔐 Pre-configured authentication structure
  - JWT authentication
  - Role-based access control
  - Middleware protection
- 🎯 Request validation using Zod
  - Input validation
  - Type inference
  - Custom validation rules
- 🌱 Flexible data seeding system
  - Configurable record generation
  - Support for large datasets
  - Example: `bun run db:seed:user 1000` for 1000 test users
  - Quick start with `bun run db:seed:user`
  - Custom data generation rules

## Project Structure

```
├── dist/
│   └── index.js
├── drizzle/
│   └── meta/
│       ├── 0000_far_grandmaster.sql
│       ├── 0001_calm_abomination.sql
│       └── 0002_shiny_proudstar.sql
├── logs/
│   └── info-2024-12-12.log
├── seeders/
│   └── user.seeder.ts
├── src/
│   ├── config/
│   │   ├── app.config.ts
│   │   └── db.config.ts
│   │   └── logger.config.ts
│   ├── middlewares/
│   │   ├── error.middleware.ts
│   │   └── http-logging.middleware.ts
│   ├── models/
│   │   └── user.model.ts
│   ├── modules/
│   │   ├── auth/
│   │   └── user/
│   │       ├── user.handler.ts
│   │       ├── user.repository.ts
│   │       ├── user.schema.ts
│   │       ├── user.service.ts
│   │       ├── user.type.ts
│   │   └── index.ts
│   ├── utils/
│   │   ├── constants/
│   │       ├── app.constant.ts
│   │       ├── error.constant.ts
│   │   ├── errors/
│   │       ├── base.error.ts
│   │       ├── http.error.ts
│   │       ├── response.error.ts
│   │   └── helpers/
│   │       ├── common.helper.ts
│   │       ├── date.helper.ts
│   │       ├── open-api-response.helper.ts
│   │       ├── pagination.helper.ts
│   │       └── response.helper.ts
│   │   └── interfaces/
│   │   └── schemas/
│   │       ├── common.schema.ts
│   │   └── types/
│   │       ├── error.type.ts
│   │       ├── http.type.ts
│   │       ├── response.type.ts
├── .env
├── .gitignore
├── .dockerignore
├── Dockerfile
├── docker-compose.yml
├── PROJECT_STRUCTURE.md
├── bun.lockb
├── drizzle.config.ts
├── package.json
└── README.md
└── tsconfig.json
```

## Directory Structure Overview

### `/dist`
Contains the compiled JavaScript file (index.js) ready for production deployment:
- Optimized production build
- Minimized bundle size
- Source maps for debugging

### `/drizzle/meta`
Contains SQL migration files for database schema management:
- Sequential migration files with descriptive names (e.g., 0000_far_grandmaster.sql)
- Tracks database schema evolution
- Auto-generated migration history
- Rollback support
- Migration timestamps

### `/logs`
Application logging directory:
- Daily log files (e.g., info-2024-12-12.log)
- Captures application events and errors
- Automatic log rotation
- Different log levels (INFO, ERROR, DEBUG)
- Structured logging format

### `/seeders`
Database seeding scripts:
- user.seeder.ts for generating test user data
- Supports bulk data generation
- Customizable seeding options
- Faker integration for realistic data
- Relationship handling

### `/src/modules`
API modules organized by feature:
- `auth/`: Authentication related features
  - JWT authentication implementation
  - Auth middleware and guards
  - Token management
  - Refresh token logic
  - Password hashing
  - Role-based access control
- `user/`: Complete user management module with:
  - `user.handler.ts`: Route handlers and endpoints
    - CRUD operations
    - Custom endpoints
    - Route middleware
  - `user.repository.ts`: Database operations and queries
    - Complex queries
    - Relationship handling
    - Transaction support
  - `user.schema.ts`: Request/response validation schemas
    - Input validation
    - Output transformation
    - Custom validators
  - `user.service.ts`: Business logic implementation
    - Business rules
    - Data processing
    - External service integration
  - `user.type.ts`: TypeScript type definitions
    - Interface definitions
    - Type guards
    - Utility types
  - `index.ts`: Module exports and route registration

### `/src/config`
Configuration files:
- `app.config.ts`: Application settings and environment variables
  - Environment configuration
  - App settings
  - Feature flags
- `db.config.ts`: Database connection and pool settings
  - Connection pool
  - Query timeout
  - SSL configuration
- `logger.config.ts`: Logging configuration and levels
  - Log formats
  - Log rotation
  - Log levels

### `/src/models`
Database models using Drizzle ORM:
- `user.model.ts`: User entity definition
  - Table schema
  - Relationships
  - Indexes
  - Constraints

### `/src/utils`
Utility modules:
- `constants/`: 
  - `app.constant.ts`: Application-wide constants
    - Default values
    - Configuration constants
    - Feature flags
  - `error.constant.ts`: Error messages and codes
    - Error codes
    - Error messages
    - HTTP status codes
- `errors/`:
  - `base.error.ts`: Base error class
    - Common error properties
    - Error serialization
  - `http.error.ts`: HTTP-specific errors
    - Status codes
    - Error responses
  - `response.error.ts`: API response errors
    - Response formatting
    - Error transformation
- `helpers/`:
  - `common.helper.ts`: Shared utility functions
    - String manipulation
    - Object helpers
    - Array utilities
  - `date.helper.ts`: Date manipulation utilities
    - Date formatting
    - Timezone handling
    - Date calculations
  - `open-api-response.helper.ts`: OpenAPI response formatters
    - Schema generation
    - Response examples
  - `pagination.helper.ts`: Pagination utilities
    - Cursor pagination
    - Offset pagination
    - Page size handling
  - `response.helper.ts`: API response formatters
    - Success responses
    - Error responses
    - Data transformation
- `interfaces/`: TypeScript interfaces
  - Common interfaces
  - Shared types
- `schemas/`:
  - `common.schema.ts`: Shared Zod validation schemas
    - Common validators
    - Reusable schemas
- `types/`:
  - `error.type.ts`: Error-related types
    - Error interfaces
    - Error codes
  - `http.type.ts`: HTTP-related types
    - Request types
    - Response types
  - `response.type.ts`: API response types
    - Success responses
    - Error responses

### `/src/middlewares`
Hono middleware functions:
- `error.middleware.ts`: Global error handling and formatting
  - Error catching
  - Error transformation
  - Response formatting
- `http-logging.middleware.ts`: HTTP request/response logging
  - Request logging
  - Response logging
  - Performance metrics

### Configuration Files
- `.env`: Environment variables configuration
  - Database credentials
  - API keys
  - Feature flags
  - Environment settings
- `.gitignore`: Git ignore patterns
  - Build artifacts
  - Dependencies
  - Environment files
- `.dockerignore`: Docker ignore patterns
  - Development files
  - Local configurations
- `Dockerfile`: Docker container configuration
  - Multi-stage builds
  - Production optimization
  - Security considerations
- `docker-compose.yml`: Multi-container Docker setup
  - Service definitions
  - Network configuration
  - Volume mappings
- `PROJECT_STRUCTURE.md`: Detailed project structure documentation
- `bun.lockb`: Bun package lock file
- `drizzle.config.ts`: Drizzle ORM configuration
  - Database connection
  - Migration settings
  - Schema configuration
- `package.json`: Project dependencies and scripts
- `tsconfig.json`: TypeScript compiler configuration
  - Compiler options
  - Module resolution
  - Type checking rules

## Getting Started

1. Clone this starter template:
```bash
git clone https://github.com/href0/bun-hono-drizzle-starter.git my-new-project
cd my-new-project
```

2. Install dependencies:
```bash
bun install
```

3. Configure your environment:
```bash
cp .env.example .env
# Edit .env with your settings
```

4. Initialize your database:
```bash
bun run db:migrate
```

5. Start development:
```bash
bun run dev
```

## Available Scripts

Start building your application with these ready-to-use scripts:

- `bun run dev` - Development server with hot reload
- `bun run build` - Production build
- `bun run start` - Production server
- `bun run db:generate` - Generate new migrations
- `bun run db:push` - Push schema changes
- `bun run db:migrate` - Run migrations
- `bun run db:seed:user` - Generate test data

### Database Seeder Usage

Quickly populate your database with test data:

```bash
# Generate default number of users (100)
bun run db:seed:user

# Generate specific number of users (e.g., 1,000)
bun run db:seed:user 1000

# Generate 1 million users
bun run db:seed:user 1000000

# Show help and usage information
bun run db:seed:user --help
```

## Building Your Application

This starter template provides a solid foundation - just add your business logic:

1. Create new modules in `src/modules/`
   - Follow the existing module structure (handler, repository, service, schema)
   - Organize related features together
   - Implement business logic in services
   - Keep handlers focused on request/response handling
   
2. Define your models in `src/models/`
   - Use Drizzle ORM for type-safe database operations
   - Follow the existing model patterns
   - Define relationships between models
   - Add indexes for optimization

3. Add routes in your module handlers
   - Implement new endpoints following the existing pattern
   - Utilize the pre-configured OpenAPI documentation
   - Add proper validation using Zod schemas
   - Implement error handling

4. Implement your business logic in services
   - Keep handlers thin, move logic to services
   - Use the repository pattern for database operations
   - Implement transaction handling
   - Add proper error handling

## Docker Support

This starter comes with Docker support out of the box:

1. Build the Docker image:
```bash
docker build -t my-api .
```

2. Run with Docker Compose:
```bash
docker-compose up -d
```

## Testing Support

The starter includes testing setup:

1. Run tests:
```bash
bun test
```

2. Run tests with coverage:
```bash
bun test:coverage
```

## Contributing

Found ways to improve this starter? Contributions are welcome! Feel free to submit a Pull Request.

## License

MIT License - Use this starter freely in your projects.

---

Start building your next great API project faster with this production-ready foundation. Focus on what matters - your application's unique features - while we handle the boilerplate.