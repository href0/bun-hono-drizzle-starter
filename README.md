# Bun Hono Drizzle Starter

A production-ready starter template for building RESTful APIs using Bun, Hono, and Drizzle ORM with TypeScript.

## Features

- 🚀 Built with Bun + Hono + Drizzle
- 📚 OpenAPI/Swagger documentation
- 🔄 Dynamic query pagination
- 🛡️ Type-safe with TypeScript
- 🗃️ SQL migrations with Drizzle ORM
- 🔐 Authentication ready
- 🎯 Request validation with Zod

## Project Structure

```
├── drizzle/
│   └── meta/
│       ├── 0000_far_grandmaster.sql
│       ├── 0001_calm_abomination.sql
│       └── 0002_shiny_proudstar.sql
├── src/
│   ├── apis/
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

## Directory Structure Overview

### `/drizzle`
Contains database migration files and metadata in SQL format.

### `/src/apis`
API route handlers and business logic organized by feature:
- Route handlers (`.handler.ts`)
- Database queries (`.query.ts`)
- Validation schemas (`.schema.ts`)
- Business logic (`.service.ts`)
- TypeScript types (`.type.ts`)

### `/src/config`
Application-wide configurations:
- `app.config.ts`: Application settings
- `db.config.ts`: Database configuration

### `/src/models`
Database models and schema definitions using Drizzle ORM.

### `/src/seeders`
Database seed files for initial data population.

### `/src/utils`
Utility functions, constants, and helpers:
- Common utilities
- Date helpers
- OpenAPI response formatters
- Pagination utilities
- API response helpers

### `/src/middlewares`
Hono middleware functions:
- Error handling
- Request logging
- Authentication
- Authorization

### `/src/schemas`
Common validation schemas using Zod.

### `/src/types`
TypeScript type definitions and interfaces.

## Development Guidelines

1. **Code Organization**
   - Follow modular approach
   - Keep related files together
   - Use appropriate naming conventions

2. **TypeScript**
   - Maintain strict type safety
   - Define interfaces for data structures
   - Use type guards where necessary

3. **API Design**
   - Follow RESTful principles
   - Implement proper validation
   - Use consistent error handling
   - Document with OpenAPI/Swagger

4. **Database**
   - Use migrations for schema changes
   - Write clean and efficient queries
   - Implement proper indexing

5. **Error Handling**
   - Use custom error classes
   - Implement global error handling
   - Provide meaningful error messages

## Getting Started

1. Clone the repository
```bash
git clone https://github.com/yourusername/bun-hono-drizzle-starter-pro.git
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
- `bun run db:generate` - Run database generate
- `bun run db:push` - Run database push
- `bun run db:migrate` - Run database migrations
- `bun run db:seed:user` - Seed database with initial data

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this starter in your own projects.