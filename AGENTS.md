# AGENTS.md

## Development Commands

### Core Commands
- **Start development**: `pnpm dev` - Runs Vite dev server
- **Build**: `pnpm build` - Runs TypeScript compilation then Vite build
- **Preview**: `pnpm preview` - Preview production build locally

### Code Quality
- **Lint**: `pnpm lint` - Runs Biome linter on src directory
- **Lint fix**: `pnpm lint:fix` - Auto-fixes Biome linting issues
- **Format**: `pnpm format` - Formats code with Biome

### Testing
- No test framework is currently configured in this project
- Consider adding Vitest for unit testing if needed

## Code Style Guidelines

### General Configuration
- **Linter/Formatter**: Biome (primary tool)
- **Package Manager**: pnpm (required - specified in packageManager field)
- **TypeScript**: Strict mode enabled with path aliases (`@/*` → `./src/*`)
- **Build Tool**: Vite with React plugin and TanStack Router

### Import Style
- Use absolute imports with `@/` prefix for internal modules
- Order: React → third-party → internal modules
- Biome organizes imports automatically
- No explicit import type enforcement (disabled in biome config)

### Code Formatting (Biome Rules)
- **Indentation**: 2 spaces
- **Quotes**: Single quotes, double quotes for JSX
- **Semicolons**: As needed
- **Trailing commas**: ES5 compatible
- **Line endings**: LF
- **Arrow parentheses**: As needed
- **Bracket spacing**: Enabled, bracket same line: disabled

### TypeScript Patterns
- Use Zod schemas for API responses and data validation
- Type inference preferred over explicit types when possible
- Interface naming: PascalCase (e.g., `Props`, `ChatStreamStoreState`)
- Export types separately from schemas: `export type Foo = z.infer<typeof FooSchema>`

### Component Architecture
- **Function components**: Default export with PascalCase naming
- **Props interface**: Named `Props` with optional properties
- **Styling**: Tailwind CSS classes, use `cn()` utility for merging
- **Shadcn components**: Located in `@/components/shadcn/`, ignored by linter

### State Management
- **Zustand**: Create stores with separate State and Action interfaces
- Store pattern: `useStoreName` function with create()
- Initial state defined separately as `initialState` objects
- Async operations handled in custom hooks (e.g., `useChatIdb()`)

### Error Handling
- Use Zod for runtime validation and parsing
- Error boundaries implemented with `react-error-boundary`
- Type guards for error instance checking
- Consistent error throwing with descriptive messages

### File Organization
```
src/
├── components/     # React components
│   ├── chat/      # Feature-specific components
│   ├── common/    # Reusable components
│   ├── layout/    # Layout components
│   ├── provider/  # Context providers
│   └── shadcn/    # UI library components (ignored by linter)
├── hooks/         # Custom React hooks
├── lib/           # Utility functions
├── routes/        # TanStack Router file-based routing
├── services/      # API and external service integrations
└── store/         # Zustand stores
```

### Naming Conventions
- **Components**: PascalCase, default export
- **Functions**: camelCase
- **Constants**: UPPER_SNAKE_CASE for static values
- **Files**: PascalCase for components, camelCase for utilities
- **Variables**: camelCase, descriptive names

### API Integration
- **Axios**: For REST API calls with configured instances
- **Fetch**: For streaming responses (e.g., chat streaming)
- **Base URLs**: Configurable, stored in service modules
- **Timeouts**: Default 30s for streaming operations

### React Specific Patterns
- **React Compiler**: Enabled with target '18'
- **Hooks**: Custom hooks for business logic, prefixed with 'use'
- **Refs**: Use for DOM manipulation and imperative APIs
- **Props**: Destructure in function signatures

### CSS/Tailwind Guidelines
- **Utility-first**: Use Tailwind classes directly
- **Responsive**: Mobile-first approach
- **Dark mode**: Implemented with next-themes
- **Component variants**: Use class-variance-authority (cva)
- **Class sorting**: Biome sorts Tailwind classes automatically

### Path Aliases
- `@/components` → Component directory
- `@/lib/utils` → Utility functions
- `@/ui` → Shadcn components
- `@/lib` → Library directory
- `@/hooks` → Custom hooks

### Performance Considerations
- **Code splitting**: Enabled in TanStack Router
- **React Compiler**: Optimizes component re-renders
- **Bundle size**: Monitor with Vite build analysis
- **Image handling**: Base64 conversion for chat images

### Development Workflow
1. Always run `pnpm lint:fix` before commits
2. Use `pnpm build` to verify production readiness
3. Biome handles most formatting automatically
4. Follow existing component patterns when adding new features
5. Use Zod schemas for any new data structures