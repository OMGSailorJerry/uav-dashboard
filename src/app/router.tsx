/**
 * Application router with role-based route guards
 * Handles authentication and authorization for protected routes
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useUserStore } from '@/store/userStore';
import { UserRole } from '@/domain/types';

// Pages
import { LoginPage } from '@/pages/LoginPage';

// Coordinator Pages
import { FleetOverview } from '@/features/coordinator/pages/FleetOverview';
import { MissionList } from '@/features/coordinator/pages/MissionList';
import { MissionDetail } from '@/features/coordinator/pages/MissionDetail';
import { MissionPlanner } from '@/features/coordinator/pages/MissionPlanner';

// Operator Pages
import { MyMissions } from '@/features/operator/pages/MyMissions';
import { MissionExecution } from '@/features/operator/pages/MissionExecution';

// Layout Components
import { CoordinatorLayout } from './layouts/CoordinatorLayout';
import { OperatorLayout } from './layouts/OperatorLayout';

/**
 * Protected route wrapper that checks authentication
 */
const ProtectedRoute: React.FC = () => {
  const currentUser = useUserStore((state) => state.currentUser);

  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

/**
 * Role-based route guard
 */
interface RoleGuardProps {
  allowedRole: UserRole;
  redirectPath: string;
}

const RoleGuard: React.FC<RoleGuardProps> = ({ allowedRole, redirectPath }) => {
  const currentUser = useUserStore((state) => state.currentUser);

  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  if (currentUser.role !== allowedRole) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

/**
 * Main application router
 */
export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LoginPage />} />

        {/* Coordinator Routes */}
        <Route element={<ProtectedRoute />}>
          <Route
            element={
              <RoleGuard allowedRole="coordinator" redirectPath="/operator" />
            }
          >
            <Route element={<CoordinatorLayout />}>
              <Route path="/coordinator" element={<FleetOverview />} />
              <Route path="/coordinator/missions" element={<MissionList />} />
              <Route path="/coordinator/missions/new" element={<MissionPlanner />} />
              <Route path="/coordinator/missions/:id" element={<MissionDetail />} />
            </Route>
          </Route>
        </Route>

        {/* Operator Routes */}
        <Route element={<ProtectedRoute />}>
          <Route
            element={
              <RoleGuard allowedRole="operator" redirectPath="/coordinator" />
            }
          >
            <Route element={<OperatorLayout />}>
              <Route path="/operator" element={<MyMissions />} />
              <Route path="/operator/missions/:id" element={<MissionExecution />} />
            </Route>
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
