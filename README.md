# Bun Hono Drizzle Starter

A production-ready starter template for building RESTful APIs using Bun, Hono, and Drizzle ORM with TypeScript.

## Features

- 🚀 Built with Bun + Hono + Drizzle
- 📚 OpenAPI/Swagger documentation
  - Interactive API documentation available at `/swagger-doc`
  - Test API endpoints directly from the browser
  - Automatic API schema generation
- 🔄 Dynamic query pagination
- 🛡️ Type-safe with TypeScript
- 🗃️ SQL migrations with Drizzle ORM
- 🔐 Authentication ready
- 🎯 Request validation with Zod
- 🌱 Dynamic Data Seeding
  - Flexible seeder with command line options
  - Customize number of records to generate
  - Example: `bun run db:seed:user 1000` generates 1000 users
  - Default seeding available: `bun run db:seed:user`
  - Support for large dataset generation (up to millions of records)

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

1. Clone the repository
```bash
git clone https://github.com/href0/bun-hono-drizzle-starter.git
```

2. Install dependencies
```bash
bun install
```

3. Set up environment variables
```bash
cp .env.example .env
```

4. Run database migrations
```bash
bun run db:migrate
```

5. Start development server
```bash
bun run dev
```

## Scripts

- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run start` - Start production server
- `bun run db:generate` - Generate database migrations
- `bun run db:push` - Push database changes
- `bun run db:migrate` - Run migrations
- `bun run db:seed:user` - Seed user data

### Database Seeder Usage

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

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this starter in your own projects.