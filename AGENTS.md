# Agent Guidelines for Compose Monorepo

## Monorepo Structure

This is a TypeScript monorepo using Bun workspaces. The project follows a modular architecture with clear separation between applications and shared packages.

### Applications

- **`apps/web`** - Frontend React application
  - React 19.2.3 with TanStack Router for file-based routing
  - Vite for build tooling
  - TanStack Form for form management
  - AI SDK integration (@ai-sdk/react)
  
- **`apps/server`** - Backend API server
  - Elysia framework (type-safe, high-performance)
  - AI SDK integration (@ai-sdk/google)
  - Better-Auth for authentication

### Packages

- **`@compose/auth`** - Authentication package
  - Better-Auth configuration and logic
  - Polar.sh integration (@polar-sh/better-auth, @polar-sh/sdk)
  - Payment-related utilities

- **`@compose/db`** - Database package
  - Drizzle ORM schema definitions
  - Database connection and queries
  - SQLite/Turso integration (@libsql/client)

- **`@compose/env`** - Environment configuration
  - Type-safe environment variable validation using Zod
  - Separate exports for server and web environments
  - Uses @t3-oss/env-core

- **`@compose/config`** - Shared TypeScript configuration
  - Base TypeScript config for all packages

### Key Technologies

- **Runtime**: Bun 1.3.8
- **Language**: TypeScript 5
- **Database**: SQLite/Turso with Drizzle ORM
- **Authentication**: Better-Auth with Polar.sh integration
- **AI**: Vercel AI SDK (ai package)
- **Linting/Formatting**: Oxlint + Oxfmt
- **Package Management**: Bun workspaces with catalog for dependency management

## Styling Guidelines

### CRITICAL: Use Only shadcn/ui Components

- **DO NOT** create custom CSS styles or add custom Tailwind classes beyond what shadcn provides
- **DO NOT** write custom styled components or CSS modules
- **ONLY** use shadcn/ui components from `@/components/ui`
- All styling should come from shadcn components and their built-in variants
- Use shadcn's component composition patterns for customization

### shadcn Configuration

- Style: `base-lyra`
- Base color: `neutral`
- CSS variables enabled
- Icon library: `lucide-react`
- Components are located in `apps/web/src/components/ui/`

### Available shadcn Components

Current components include: `button`, `card`, `checkbox`, `dropdown-menu`, `input`, `label`, `skeleton`, `sonner` (toast notifications).

To add new shadcn components, use the shadcn CLI - do not create custom alternatives.

## Component Architecture: Composability First

### Core Principle: Everything in Its Own Component

This application prioritizes **maximum composability**. Every piece of functionality, UI element, and feature should be broken down into its own reusable component.

### Component Guidelines

1. **Single Responsibility**: Each component should have one clear purpose
2. **Small & Focused**: Prefer smaller, focused components over large monolithic ones
3. **Reusability**: Design components to be reusable across different contexts
4. **Composition**: Build complex UIs by composing smaller components together
5. **Separation**: Keep business logic, UI, and data fetching in separate components when possible

### Component Structure

- **UI Components**: Located in `apps/web/src/components/ui/` (shadcn components)
- **Feature Components**: Located in `apps/web/src/components/` (application-specific components)
- **Route Components**: Located in `apps/web/src/routes/` (page-level components)

### Examples of Good Component Composition

- Instead of one large form component, break it into: `FormField`, `FormSection`, `FormActions`
- Instead of one dashboard component, break it into: `DashboardHeader`, `DashboardStats`, `DashboardContent`
- Extract repeated patterns into reusable components even if only used once initially

### When Creating New Features

1. Identify all distinct UI elements and behaviors
2. Create a separate component for each distinct element
3. Compose these components together to build the feature
4. Keep components small and focused - if a component is doing multiple things, split it

## Development Workflow

- Dev server is always running on specified ports, you won't have to run these commands
- Use `bun run dev` to start all applications
- Use `bun run dev:web` or `bun run dev:server` for individual apps
- Use `bun run check` to format and lint code
- Use `bun run db:push` to apply database schema changes
- Use `bun run db:studio` to open database management UI

## Type Safety

- Use @compose/config to configure needed environment variables to keep them type safe
- All packages use TypeScript with strict type checking
- Use `bun run check-types` to verify types across all packages
- Prefer type inference where possible, but be explicit when it improves clarity
- Leverage workspace package imports for type-safe cross-package dependencies
- Never use any
