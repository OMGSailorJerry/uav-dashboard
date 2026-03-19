/**
 * Fleet Overview Page - Coordinator Dashboard
 * Main dashboard showing fleet status, active missions, and KPIs
 */

import React, { useEffect } from 'react';
import { useDroneStore } from '@/store/droneStore';
import { useMissionStore } from '@/store/missionStore';
import { useAlertStore } from '@/store/alertStore';
import { useSimulationStore } from '@/store/simulationStore';
import { KpiCard } from '@/features/shared/components/ui/KpiCard';
import { Card } from '@/features/shared/components/ui/Card';
import { FleetMap } from '@/features/shared/components/map/FleetMap';
import { Plane, Target, AlertTriangle, Battery } from 'lucide-react';
import { startSimulation, stopSimulation } from '@/simulation/missionSimulator';

export const FleetOverview: React.FC = () => {
  const drones = useDroneStore((state) => state.drones);
  const missions = useMissionStore((state) => state.missions);
  const alerts = useAlertStore((state) => state.getUnacknowledgedAlerts());
  const { isRunning, speed, startSimulation: startSim, stopSimulation: stopSim, setSpeed } = useSimulationStore();

  // Calculate KPIs
  const totalDrones = drones.length;
  const activeMissions = missions.filter((m) => m.status === 'IN_PROGRESS').length;
  const availableDrones = drones.filter((d) => d.status === 'AVAILABLE').length;
  const criticalAlerts = alerts.filter((a) => a.severity === 'CRITICAL').length;

  // Handle simulation control
  useEffect(() => {
    if (isRunning) {
      startSimulation();
    } else {
      stopSimulation();
    }

    return () => {
      stopSimulation();
    };
  }, [isRunning, speed]);

  const handleSimulationToggle = () => {
    if (isRunning) {
      stopSim();
    } else {
      startSim();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Fleet Overview
        </h1>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Speed:</span>
            <select
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value) as 1 | 2 | 5)}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              disabled={!isRunning}
            >
              <option value={1}>1x</option>
              <option value={2}>2x</option>
              <option value={5}>5x</option>
            </select>
          </div>
          
          <button
            onClick={handleSimulationToggle}
            className={`px-4 py-2 rounded-md font-medium ${
              isRunning
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {isRunning ? 'Stop Simulation' : 'Start Simulation'}
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard title="Total Drones" value={totalDrones} icon={Plane} />
        <KpiCard title="Active Missions" value={activeMissions} icon={Target} />
        <KpiCard title="Available Drones" value={availableDrones} icon={Battery} />
        <KpiCard
          title="Critical Alerts"
          value={criticalAlerts}
          icon={AlertTriangle}
        />
      </div>

      {/* Map */}
      <Card title="Fleet Map">
        <div className="h-[500px]">
          <FleetMap drones={drones} />
        </div>
      </Card>

      {/* Recent Alerts */}
      <Card title="Recent Alerts">
        {alerts.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No unacknowledged alerts</p>
        ) : (
          <div className="space-y-2">
            {alerts.slice(0, 5).map((alert) => (
              <div
                key={alert.id}
                className={`p-3 rounded-md ${
                  alert.severity === 'CRITICAL'
                    ? 'bg-red-50 dark:bg-red-900'
                    : alert.severity === 'WARNING'
                    ? 'bg-yellow-50 dark:bg-yellow-900'
                    : 'bg-blue-50 dark:bg-blue-900'
                }`}
              >
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {alert.message}
                </p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};
