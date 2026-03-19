# UAV Fleet Operations Dashboard - Quick Start Guide

## 📁 Project Structure

The project has been generated with the following structure:

```
uav-fleet-dashboard/
├── src/
│   ├── app/
│   │   ├── layouts/
│   │   │   ├── CoordinatorLayout.tsx
│   │   │   └── OperatorLayout.tsx
│   │   ├── App.tsx
│   │   └── router.tsx
│   ├── features/
│   │   ├── coordinator/
│   │   │   └── pages/
│   │   │       ├── FleetOverview.tsx
│   │   │       ├── MissionList.tsx
│   │   │       ├── MissionDetail.tsx
│   │   │       └── MissionPlanner.tsx
│   │   ├── operator/
│   │   │   └── pages/
│   │   │       ├── MyMissions.tsx
│   │   │       └── MissionExecution.tsx
│   │   └── shared/
│   │       └── components/
│   │           ├── map/
│   │           │   ├── FleetMap.tsx
│   │           │   └── MissionRouteLayer.tsx
│   │           ├── mission/
│   │           │   ├── MissionStatusBadge.tsx
│   │           │   └── CheckpointTimeline.tsx
│   │           └── ui/
│   │               ├── Card.tsx
│   │               ├── Table.tsx
│   │               └── KpiCard.tsx
│   ├── store/
│   │   ├── userStore.ts
│   │   ├── droneStore.ts
│   │   ├── missionStore.ts
│   │   ├── alertStore.ts
│   │   └── simulationStore.ts
│   ├── domain/
│   │   ├── types.ts
│   │   └── viewModels.ts
│   ├── data/
│   │   └── mockData.ts
│   ├── simulation/
│   │   └── missionSimulator.ts
│   ├── hooks/
│   │   ├── useMissionProgress.ts
│   │   └── useFilteredMissions.ts
│   ├── pages/
│   │   └── LoginPage.tsx
│   ├── main.tsx
│   └── index.css
├── public/
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### 3. Login

The login page allows you to choose between two roles:
- **Coordinator**: Full fleet management access
- **Operator**: Mission execution view

No actual authentication is required in development mode - just select a role and click "Sign In".

## 🎯 Features & Navigation

### Coordinator Role

After logging in as Coordinator, you can access:

1. **Fleet Overview** (`/coordinator`)
   - Real-time KPIs (total drones, active missions, available drones, alerts)
   - Fleet map with all drone positions
   - Recent alerts
   - Simulation controls (start/stop, speed adjustment)

2. **Mission List** (`/coordinator/missions`)
   - View all missions
   - Filter by status (Draft, Planned, In Progress, Completed, Aborted)
   - Search by mission title
   - Create new missions

3. **Mission Planner** (`/coordinator/missions/new`)
   - Create new missions
   - Assign drones
   - Set mission timeline
   - *(Note: Checkpoint configuration UI is marked as TODO)*

4. **Mission Detail** (`/coordinator/missions/:id`)
   - Detailed mission information
   - Checkpoint timeline with status
   - Mission route map
   - Progress tracking

### Operator Role

After logging in as Operator, you can access:

1. **My Missions** (`/operator`)
   - View assigned missions
   - Mission statistics (active, upcoming, completed)
   - Quick access to active missions

2. **Mission Execution** (`/operator/missions/:id`)
   - Real-time mission monitoring
   - Drone telemetry (battery, position, status)
   - Mission progress tracking
   - Live mission map
   - Active alerts
   - Checkpoint progress
   - Abort mission capability

## 🧪 Testing the Simulation

The project includes a real-time mission simulator:

1. Log in as **Coordinator**
2. Go to **Fleet Overview**
3. Click **"Start Simulation"**
4. Adjust simulation speed (1x, 2x, 5x)
5. Watch as:
   - Drones move toward checkpoints
   - Checkpoints are automatically reached
   - Battery levels decrease
   - Alerts are generated
   - Missions complete

## 📊 Mock Data

The application includes realistic mock data:

- **5 Drones**: Various statuses (Available, In Mission, Maintenance, Offline)
- **3 Missions**: Different states (In Progress, Planned, Completed)
- **4 Alerts**: Mixed severity levels (Info, Warning, Critical)
- **Coordinates**: Based in Kyiv, Ukraine area (lat ~50.45, lng ~30.52)

## 🗺️ Map Configuration

The project uses **MapLibre GL JS** with OpenStreetMap tiles. The map is configured to work out-of-the-box with no API keys required.

For production, consider:
- Using a premium map tile provider (Mapbox, Maptiler, etc.)
- Adding custom styling
- Implementing map controls and interactions

## 🔧 State Management

The app uses **Zustand** for state management with 5 stores:

1. **userStore**: Authentication and user session (persisted to localStorage)
2. **droneStore**: Fleet state, drone positions, battery levels
3. **missionStore**: Mission lifecycle, checkpoints, assignments
4. **alertStore**: System alerts and notifications
5. **simulationStore**: Simulation controls and speed settings

## 🎨 Styling

- **Tailwind CSS v3** for all styling
- Dark mode support included
- Responsive design for mobile, tablet, and desktop
- Custom color palette with primary blue theme

## 📝 TODOs & Next Steps

The codebase includes TODO comments marking areas for future development:

1. **Authentication**: Replace mock login with real auth service
2. **Backend Integration**: Replace Zustand stores with real API calls
3. **WebSocket**: Replace simulator with real-time backend feed
4. **Form Validation**: Add validation to mission planner and login
5. **Checkpoint Configuration**: Build UI for defining mission checkpoints
6. **Error Handling**: Add comprehensive error boundaries and error states
7. **Testing**: Add unit and integration tests
8. **Loading States**: Implement loading indicators for async operations

## 🔍 Key Files to Review

- **`src/domain/types.ts`**: Core domain type definitions
- **`src/store/*.ts`**: State management stores
- **`src/simulation/missionSimulator.ts`**: Mission progress simulation
- **`src/app/router.tsx`**: Route configuration and guards
- **`src/data/mockData.ts`**: Sample data for development

## 🐛 Common Issues

### Port Already in Use
If port 5173 is occupied:
```bash
npm run dev -- --port 3000
```

### Type Errors
Ensure TypeScript version matches:
```bash
npm install typescript@5.3.3 --save-dev
```

### Map Not Loading
Check browser console for errors. Ensure you have internet connectivity for map tiles.

## 📚 Technology Stack

- **React 18**: UI library
- **TypeScript**: Type safety
- **Vite**: Build tool and dev server
- **React Router v6**: Client-side routing
- **Zustand**: State management
- **Tailwind CSS v3**: Utility-first CSS framework
- **react-map-gl + MapLibre GL JS**: Map visualization
- **TanStack Table v8**: Data tables (ready to use)
- **React Hook Form**: Form handling
- **date-fns**: Date utilities
- **lucide-react**: Icon library

## 🤝 Development Workflow

1. Make changes to files
2. Vite hot-reloads automatically
3. Check console for errors
4. Test in both Coordinator and Operator roles
5. Build for production: `npm run build`
6. Preview production build: `npm run preview`

## 📦 Building for Production

```bash
# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

The production files will be in the `dist/` directory.

## 🎓 Learning Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Zustand Guide](https://docs.pmnd.rs/zustand/getting-started/introduction)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [React Router Tutorial](https://reactrouter.com/en/main/start/tutorial)
- [MapLibre GL JS Docs](https://maplibre.org/maplibre-gl-js/docs/)

---

**Happy Coding! 🚁**
