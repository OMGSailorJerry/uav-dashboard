# UAV Fleet Operations Dashboard

A comprehensive fleet management dashboard for coordinating and operating unmanned aerial vehicle (UAV) missions.

## Tech Stack

- **React 18** + **TypeScript** - UI framework
- **Vite** - Build tool and dev server
- **React Router v6** - Client-side routing
- **Zustand** - State management
- **Tailwind CSS v3** - Styling
- **react-map-gl** + **MapLibre GL JS** - Map visualization
- **TanStack Table v8** - Data tables
- **React Hook Form** - Form handling
- **date-fns** - Date utilities
- **lucide-react** - Icons

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Features

### Coordinator Role
- Fleet overview with real-time drone status
- Mission planning and management
- Mission list with filtering and sorting
- Detailed mission view with checkpoint tracking

### Operator Role
- View assigned missions
- Execute missions with real-time updates
- Monitor mission progress and checkpoints

### Simulation Mode
- Real-time mission simulation
- Configurable speed (1x, 2x, 5x)
- Automatic checkpoint progression
- Battery and position updates

## Project Structure

```
src/
├── app/                    # Application core
├── features/              # Feature modules
│   ├── coordinator/       # Coordinator role features
│   ├── operator/         # Operator role features
│   └── shared/           # Shared components
├── store/                # Zustand state management
├── domain/               # Type definitions
├── data/                 # Mock data
├── simulation/           # Mission simulator
├── hooks/                # Custom React hooks
└── pages/                # Page components
```

## TODO

- [ ] Replace mock login with real authentication service
- [ ] Replace mission simulator with WebSocket feed from backend
- [ ] Implement real API integration for all data stores
- [ ] Add form validation for mission planner
- [ ] Add error boundaries and loading states
- [ ] Implement comprehensive error handling
- [ ] Add unit and integration tests
