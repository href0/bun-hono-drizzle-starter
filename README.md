# Bun Hono Drizzle Starter

A production-ready starter template to jumpstart your next API project. This template provides a solid foundation with pre-configured Bun, Hono, and Drizzle ORM setup, allowing you to focus on building your application logic rather than setting up the infrastructure.

## Why Use This Starter?

Save hours of initial setup time with a pre-configured project that includes:

- 🚀 Build with Bun + Hono + Drizzle
- 📚 Ready-to-use OpenAPI/Swagger documentation
  - Instantly available at `/swagger-doc`
  - Interactive API testing interface
  - Automatic schema generation
- 🔄 Built-in query pagination system
- 🛡️ Full TypeScript support for type safety
- 🗃️ Database migration system with Drizzle ORM
- 🔐 Pre-configured authentication structure
- 🎯 Request validation using Zod
- 🌱 Flexible data seeding system
  - Configurable record generation
  - Support for large datasets
  - Example: `bun run db:seed:user 1000` for 1000 test users
  - Quick start with `bun run db:seed:user`

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
Contains the compiled JavaScript file (index.js) ready for production deployment.

### `/drizzle/meta`
Contains SQL migration files for database schema management:
- Sequential migration files with descriptive names
- Tracks database schema evolution

### `/logs`
Application logging directory:
- Daily log files (e.g., info-2024-12-12.log)
- Captures application events and errors

### `/seeders`
Database seeding scripts:
- user.seeder.ts for generating test user data

### `/src/api`
API modules organized by feature:
- `auth/`: Authentication related features
- `user/`: Complete user management module with:
  - `user.handler.ts`: Route handlers
  - `user.repository.ts`: Database operations
  - `user.schema.ts`: Validation schemas
  - `user.service.ts`: Business logic
  - `user.type.ts`: Type definitions

### `/src/config`
Configuration files:
- `app.config.ts`: Application settings
- `db.config.ts`: Database configuration
- `logger.config.ts`: Logging settings

### `/src/models`
Database models using Drizzle ORM:
- `user.model.ts`: User entity definition

### `/src/utils`
Utility modules:
- `constants/`: Application and error constants
- `errors/`: Custom error handling classes
- `helpers/`: Utility functions for common operations
- `types/`: TypeScript type definitions

### `/src/middlewares`
Hono middleware functions:
- `error.middleware.ts`: Global error handling
- `http-logging.middleware.ts`: HTTP Request logging

### `/src/schemas`
Shared validation schemas using Zod:
- `common.schema.ts`: Common validation rules

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
   
2. Define your models in `src/models/`
   - Use Drizzle ORM for type-safe database operations
   - Follow the existing model patterns

3. Add routes in your module handlers
   - Implement new endpoints following the existing pattern
   - Utilize the pre-configured OpenAPI documentation

4. Implement your business logic in services
   - Keep handlers thin, move logic to services
   - Use the repository pattern for database operations

## Contributing

Found ways to improve this starter? Contributions are welcome! Feel free to submit a Pull Request.

## License

MIT License - Use this starter freely in your projects.

---

Start building your next great API project faster with this production-ready foundation. Focus on what matters - your application's unique features - while we handle the boilerplate.