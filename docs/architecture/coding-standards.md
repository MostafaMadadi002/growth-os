# GrowthOS Coding Standards

To maintain a consistent and scalable codebase, all developers must adhere to these standards.

## 1. Naming Conventions

- **Files & Directories**:
  - Folders: `kebab-case` (e.g., `features/goals-management`)
  - Components: `PascalCase` (e.g., `GoalCard.tsx`)
  - Hooks/Utils/Services: `camelCase` (e.g., `useGoalData.ts`, `goalService.ts`)
- **Types & Interfaces**:
  - `PascalCase` (e.g., `interface GoalSession {}`)
- **Variables & Functions**:
  - `camelCase` (e.g., `const currentGoal = ...`, `function calculatePoints()`)
- **Constants & Enums**:
  - `UPPER_SNAKE_CASE` (e.g., `const MAX_RETRY = 3`, `enum GoalStatus { ACTIVE = 'ACTIVE' }`)

## 2. Directory Structure (Feature-Based)

Each feature folder (e.g., `src/features/goals`) should follow this internal structure:
- `components/`: UI components private to this feature.
- `hooks/`: React hooks private to this feature.
- `services/`: Business logic and orchestration.
- `repositories/`: Data access layer (Supabase, local storage).
- `stores/`: Zustand store for state management.
- `screens/`: Main page components for the feature.
- `types/`: Domain-specific TypeScript definitions.
- `utils/`: Helper functions private to this feature.

## 3. Data Access (The Hierarchy)

**Strict Rule**: UI Components -> Stores -> Services -> Repositories -> Data Source

- **Repositories**: ONLY handle data fetching/persistence. No business logic.
- **Services**: Orchestrate between repositories, handle validation, calculate business rules, and trigger cross-cutting concerns (like logging activities).
- **Stores**: Maintain the "live" state in the UI. They call services to perform actions.
- **UI Components**: Use stores to get data and trigger actions. They should be "thin".

## 4. UI & Styling

- Use **Tailwind CSS** for all styling.
- Prefer **composition** over many props for complex components.
- Icons must be imported from `lucide-react`.
- Animations must use `motion` (framer-motion).

## 5. Persistence & Deletion

- Use **Soft Delete** (`deleted_at`) for all primary user data.
- Ensure every database-backed entity has a `user_id` for RLS.

## 6. Definition of Done (DoD)

A feature is considered complete only after:
1. Types are defined in `src/core/types` or feature specific `types/`.
2. Repository methods for CRUD are implemented.
3. Service layer logic (including activity logging) is implemented.
4. Zustand store is updated to manage the feature state.
5. UI reflects the new state and handles loading/error states.
6. Linting passes and code adheres to these standards.
