# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Avesa is a proptech platform for property and lead management. It is a monorepo with:
- **Backend**: NestJS + TypeORM + PostgreSQL, exposed on port 3000
- **Frontend**: Angular 21 (standalone components) + Tailwind CSS + Angular Material, on port 4200
- **Database**: PostgreSQL 16, managed via Docker Compose

## Development Commands

### Docker (full stack)
```bash
docker compose --env-file ./backend/.env.development up   # for development

docker compose --env-file ./backend/.env.production up   # for production
```

### Backend (`cd backend`)
```bash
npm run start:dev       # watch mode
npm run build
npm run lint            # ESLint with auto-fix
npm run test            # Jest unit tests
npm run test:e2e        # E2E tests
npm run migration:generate -- --name <MigrationName>
npm run migration:run
npm run migration:revert
```

### Frontend (`cd frontend`)
```bash
npm start               # ng serve (http://localhost:4200)
npm run build
npm run test            # Vitest
```

Swagger docs available at `http://localhost:3000/documentation-api`.

## Backend Architecture

### Module layout (`backend/src/`)
- `app.module.ts` — root module: ConfigModule, TypeOrmModule, ClsModule
- `config/data-source.ts` — PostgreSQL config with SnakeNamingStrategy
- `core/dtos/` — shared DTOs used across modules
- `modules/auth/` — JWT authentication (guards, decorators, service)
- `modules/internal/` — domain modules: `lead/`, `property/`, `user/`, `source/`
- `modules/external-api/` — external integrations for lead/property ingestion
- `modules/general/black-list/` — blacklist management
- `shared/` — utilities (UserUtil, ClsUtil), constants (ROLES), interceptors

### Key patterns
- **Global API prefix**: `/api`
- **AuthGuard** is applied globally; skip it with `@PublicAccess()`
- **RolesGuard** is applied per route with `@Roles(...)` or `@Admin()`
- **CLS** (Continuation Local Storage) carries request context (user, token) across layers
- **typeorm-transactional** decorators manage database transactions
- **Repository pattern**: each domain module has its own repository class
- Validation uses class-validator DTOs; error messages are in Spanish
- TypeORM entities are auto-discovered via `**/**/*.entity.ts`; columns are snake_case
- Use `@PublicAccess()` for all controllers except `backend/src/modules/external-api/controllers/external-api.controller.ts`

### Authentication flow
1. `POST /api/auth/login` — validates bcrypt password, extracts roles from `user.groups[].functionalRoles`, returns 3 JWTs in response headers: `Authorization` (15 min), `Refresh-token` (7 d), `Id-token` (15 min)
2. `POST /api/auth/refresh` — uses `Refresh-token` header to issue new tokens
3. JWT payload includes: `sub`, `preferred_username`, `name`, `surname`, `email`, `roles`, `groups`, `sourceId`
4. Role constants live in `shared/constants/`: `LOGIN_AVESA`, `EXTERNAL_API`, `LEADS_READ`, `ADMINISTRATOR`

## Frontend Architecture

The frontend follows the guidance in `frontend/.claude/CLAUDE.md` (Angular/TypeScript best practices). Key additions:

### Structure (`frontend/src/app/`)
- `app.config.ts` — providers: HttpClient interceptors, router, Transloco (ES locale), Angular Material, JWT helper
- `app.routes.ts` — `/login` (public), `/` guarded by `authGuard` with lazy-loaded features
- `core/guards/` — `authGuard`, `rolesGuard`
- `core/interceptors/` — `JwtInterceptor` (adds Bearer token), `httpErrorInterceptor`, `httpActivityInterceptor` (inactivity logout at 11800 s)
- `core/services/login/` — `LoginService` (HTTP), `AuthService` (token storage/refresh)
- `core/models/` — typed interfaces for auth, lead, property
- `features/` — `home/` (shell layout), `auth/login`, `welcome/`
- `shared/directives/` — `decimals-only`, `numbers-only`

### Auth & tokens
- Tokens stored in localStorage as base64-encoded values (`authTokenKey`, `authRefreshTokenKey`, `authIdTokenKey`)
- `JwtInterceptor` attaches `Authorization: Bearer <token>` to every request
- 401 responses trigger a token refresh; inactivity logout after ~3.3 hours

### Angular conventions
- Standalone components only; do **not** set `standalone: true` (default in v20+)
- Signals for state (`signal()`, `computed()`); `ChangeDetectionStrategy.OnPush`
- `input()`/`output()` functions instead of `@Input`/`@Output` decorators
- Native control flow (`@if`, `@for`, `@switch`) — not structural directives
- `inject()` instead of constructor injection
- Reactive forms preferred over template-driven
- `class` bindings instead of `ngClass`; `style` bindings instead of `ngStyle`
- `NgOptimizedImage` for static images
- All UI must pass WCAG AA / AXE checks

## Environment & Configuration

Copy `backend/.env.example` to `backend/.env.development` and fill in secrets. Key variables:
```
DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD
JWT_ACCESS_SECRET
BACKEND_PORT=3000
FRONTEND_PORT=4200
```
