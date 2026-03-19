# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server (localhost:5173)
npm run build      # Type-check + production build (tsc && vite build)
npm run lint       # ESLint with zero warnings tolerance
npm run preview    # Preview production build
```

There is no test runner configured — check `package.json` before adding tests.

## Path Aliases

Use `@/` to import from `src/`:
```ts
import { Drone } from '@/domain/types'
import { useDroneStore } from '@/store/droneStore'
```

## Architecture

### Role-Based App

Two distinct user roles with separate layouts and route trees:
- **Coordinator** — fleet management, mission planning, overview (`/coordinator/...`)
- **Operator** — mission execution monitoring (`/operator/...`)

Authentication is mock-only (Zustand `userStore` + localStorage). `<ProtectedRoute>` and `<RoleGuard>` in `src/app/router.tsx` gate access.

### State Management (Zustand)

Five stores in `src/store/`, each owning a single domain:

| Store | Owns |
|-------|------|
| `userStore` | Auth session (persisted to localStorage) |
| `droneStore` | Fleet state and telemetry |
| `missionStore` | Mission lifecycle and checkpoints |
| `alertStore` | System alerts with severity |
| `simulationStore` | Simulation running state and speed |

Stores use mock data from `src/data/mockData.ts`. All backend integration is marked with `// TODO` comments throughout the stores.

### Simulation Engine

`src/simulation/missionSimulator.ts` is a tick-based engine that drives the live dashboard. It:
- Progresses mission checkpoints based on planned times
- Interpolates drone positions toward the next checkpoint
- Drains battery per checkpoint (1–3%)
- Emits alerts for low battery and mission completion
- Respects speed multipliers (1×, 2×, 5×) from `simulationStore`

The simulator interacts exclusively through store actions — it does not hold its own state.

### Domain Types

All core types are in `src/domain/types.ts`:
- **Entities**: `Drone`, `Mission`, `Checkpoint`, `Alert`, `User`
- **Enums**: `DroneStatus`, `MissionStatus`, `AlertSeverity`, `UserRole`

View model interfaces are in `src/domain/viewModels.ts`.

### Feature Structure

```
src/features/
├── coordinator/pages/   # FleetOverview, MissionList, MissionDetail, MissionPlanner
├── operator/pages/      # MyMissions, MissionExecution
└── shared/components/
    ├── map/             # FleetMap (MapLibre GL via react-map-gl)
    ├── mission/         # CheckpointTimeline, MissionStatusBadge
    └── ui/              # Card, KpiCard, Table
```

### Map

Map visualization uses **MapLibre GL JS** via **react-map-gl** (not Mapbox). Mock drone coordinates are centered around Kyiv (~50.45°N, 30.52°E).

## TypeScript Config

`strict: true` is enabled along with `noUnusedLocals` and `noUnusedParameters`. The build will fail on any unused variables.
