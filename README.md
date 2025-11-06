# Bun Hono Drizzle Starter

This repository serves as a starter project to streamline the development process. Built with modern tools and best practices, it eliminates the need for repetitive setup, enabling you to focus directly on building features. This starter kit includes a pre-configured environment with the following technologies:

- **[Bun](https://bun.sh)** for a fast and modern JavaScript runtime.
- **[Hono](https://honojs.dev)** as the lightweight web framework.
- **[Drizzle ORM](https://orm.drizzle.team/)** for type-safe database operations.
- **[Swagger](https://swagger.io/specification/)** OpenAPI Version 3.1.0.
- TypeScript for type safety and development ease.

## Why Use This Starter?

Save hours of initial setup time with a pre-configured project that includes:

- 🚀 **Modern Stack**: Built with Bun + Hono + Drizzle
- 📚 **API Documentation**: Auto-generated OpenAPI/Swagger documentation powered by OpenAPIHono and Zod schemas. Each route's request/response validation is automatically reflected in the Swagger UI (available at `/swagger-doc`)
- 📊 **Smart Pagination**:: Built with Features include:
  - Dynamic column selection and filtering
  - Flexible ordering with custom column support
  - Type-safe pagination metadata using Drizzle's type inference
  - Default configuration with customizable page size and number
  - Efficient parallel query execution for data and count
- 📘 **TypeScript**: Full TypeScript support for enhanced type safety and developer experience
- 🗄️ **Database**: PostgreSQL database with Drizzle ORM for migrations and queries
- 🔐 **Authentication**: Pre-configured authentication structure with JWT support
- ✅ **Validation**: Request validation using Zod
- 📝 **Logging**: Comprehensive request logging system
- 🌱 **Seeding**: Flexible data seeding system for development and testing
  - Configurable record generation
  - Support for large datasets
  - Example: `bun run db:seed:user 1000` for 1000 test users
  - Quick start with `bun run db:seed:user`

## Purpose of This Starter

This starter template is designed to serve as a base for new projects using Bun, Hono, and Drizzle ORM. It enables developers to:

1. Skip boilerplate setup.
2. Quickly start building project-specific features.
3. Ensure consistent project structure and code quality.
4. Adopt industry best practices with minimal effort.
5. Focus on business logic rather than repetitive configuration.

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
│   │       ├── user.route.ts
│   │       ├── user.schema.ts
│   │       ├── user.service.ts
│   │       ├── user.type.ts
│   ├── routes/
│   │   ├── index.ts/
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
├── bun.lock
├── drizzle.config.ts
├── package.json
└── README.md
└── tsconfig.json
```

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

## Environment Variables Example

```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# JWT TOKEN
ACCESS_TOKEN_SECRET_KEY=
REFRESH_TOKEN_SECRET_KEY=
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