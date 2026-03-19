/**
 * Mission Execution Page - Operator
 * Real-time mission monitoring and execution interface
 */

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useMissionStore } from '@/store/missionStore';
import { useDroneStore } from '@/store/droneStore';
import { useAlertStore } from '@/store/alertStore';
import { useMissionProgress } from '@/hooks/useMissionProgress';
import { Card } from '@/features/shared/components/ui/Card';
import { MissionStatusBadge } from '@/features/shared/components/mission/MissionStatusBadge';
import { CheckpointTimeline } from '@/features/shared/components/mission/CheckpointTimeline';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { MissionRouteLayer } from '@/features/shared/components/map/MissionRouteLayer';
import { format } from 'date-fns';
import { ArrowLeft, Plane, Battery, AlertCircle } from 'lucide-react';

export const MissionExecution: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const getMissionById = useMissionStore((state) => state.getMissionById);
  const updateMissionStatus = useMissionStore((state) => state.updateMissionStatus);
  const getDroneById = useDroneStore((state) => state.getDroneById);
  const alerts = useAlertStore((state) => state.alerts);

  const mission = getMissionById(id!);
  const drone = mission ? getDroneById(mission.assignedDroneId) : null;
  const progress = mission ? useMissionProgress(mission) : null;
  
  // Get alerts for this mission
  const missionAlerts = alerts
    .filter((a) => a.missionId === id && !a.acknowledged)
    .slice(0, 3);

  if (!mission) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">Mission not found</p>
        <Link
          to="/operator"
          className="text-primary-600 hover:text-primary-700 dark:text-primary-400 mt-4 inline-block"
        >
          Back to My Missions
        </Link>
      </div>
    );
  }

  const handleAbortMission = () => {
    if (window.confirm('Are you sure you want to abort this mission?')) {
      updateMissionStatus(mission.id, 'ABORTED');
      // TODO: Add API call to notify backend
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/operator"
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {mission.title}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Mission Execution
            </p>
          </div>
          <MissionStatusBadge status={mission.status} />
        </div>

        {mission.status === 'IN_PROGRESS' && (
          <button
            onClick={handleAbortMission}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium"
          >
            Abort Mission
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Drone Status */}
        <Card title="Drone Status">
          {drone ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Plane className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Name</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {drone.name}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Battery className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Battery</p>
                  <p
                    className={`font-semibold ${
                      drone.batteryPercent <= 20
                        ? 'text-red-600'
                        : drone.batteryPercent <= 50
                        ? 'text-yellow-600'
                        : 'text-green-600'
                    }`}
                  >
                    {drone.batteryPercent}%
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Model</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {drone.model}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Position</p>
                <p className="text-xs font-mono text-gray-900 dark:text-white">
                  {drone.currentPosition.lat.toFixed(6)}, {drone.currentPosition.lng.toFixed(6)}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">Drone not found</p>
          )}
        </Card>

        {/* Mission Progress */}
        <Card title="Mission Progress">
          {progress && (
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <span>Overall Progress</span>
                  <span>{progress.percentComplete.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className="bg-primary-600 h-3 rounded-full"
                    style={{ width: `${progress.percentComplete}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {progress.completedCheckpoints}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Remaining</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {progress.totalCheckpoints - progress.completedCheckpoints}
                  </p>
                </div>
              </div>

              {progress.estimatedTimeRemaining && (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">ETA</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {format(Date.now() + progress.estimatedTimeRemaining, 'HH:mm')}
                  </p>
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Alerts */}
        <Card title="Active Alerts">
          {missionAlerts.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No active alerts</p>
          ) : (
            <div className="space-y-3">
              {missionAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-3 rounded-md flex items-start gap-2 ${
                    alert.severity === 'CRITICAL'
                      ? 'bg-red-50 dark:bg-red-900'
                      : alert.severity === 'WARNING'
                      ? 'bg-yellow-50 dark:bg-yellow-900'
                      : 'bg-blue-50 dark:bg-blue-900'
                  }`}
                >
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-900 dark:text-white">
                    {alert.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Map */}
      <Card title="Live Mission Map">
        <div className="h-[400px]">
          <MapContainer
            center={[
              mission.checkpoints[0]?.position.lat || 50.4501,
              mission.checkpoints[0]?.position.lng || 30.5234,
            ]}
            zoom={12}
            style={{ width: '100%', height: '100%' }}
          >
            <TileLayer
              url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap Contributors"
              maxZoom={19}
            />
            <MissionRouteLayer mission={mission} />
          </MapContainer>
        </div>
      </Card>

      {/* Checkpoints */}
      <Card title="Checkpoint Progress">
        <CheckpointTimeline checkpoints={mission.checkpoints} />
      </Card>
    </div>
  );
};
