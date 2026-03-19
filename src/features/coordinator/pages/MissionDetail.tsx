/**
 * Mission Detail Page - Coordinator
 * Displays detailed information about a specific mission
 */

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useMissionStore } from '@/store/missionStore';
import { useDroneStore } from '@/store/droneStore';
import { useMissionProgress } from '@/hooks/useMissionProgress';
import { Card } from '@/features/shared/components/ui/Card';
import { MissionStatusBadge } from '@/features/shared/components/mission/MissionStatusBadge';
import { CheckpointTimeline } from '@/features/shared/components/mission/CheckpointTimeline';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MissionRouteLayer } from '@/features/shared/components/map/MissionRouteLayer';
import { format } from 'date-fns';
import { ArrowLeft, Plane } from 'lucide-react';

export const MissionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const getMissionById = useMissionStore((state) => state.getMissionById);
  const getDroneById = useDroneStore((state) => state.getDroneById);

  const mission = getMissionById(id!);
  const drone = mission ? getDroneById(mission.assignedDroneId) : null;
  const progress = mission ? useMissionProgress(mission) : null;

  if (!mission) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">Mission not found</p>
        <Link
          to="/coordinator/missions"
          className="text-primary-600 hover:text-primary-700 dark:text-primary-400 mt-4 inline-block"
        >
          Back to Missions
        </Link>
      </div>
    );
  }

  const droneIcon = L.divIcon({
    className: '',
    html: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#eab308" style="transform:rotate(-45deg);filter:drop-shadow(0 1px 2px rgba(0,0,0,.4))"><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          to="/coordinator/missions"
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {mission.title}
        </h1>
        <MissionStatusBadge status={mission.status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mission Info */}
        <Card title="Mission Information">
          <dl className="space-y-3">
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Assigned Drone
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white flex items-center gap-2">
                <Plane className="w-4 h-4" />
                {drone?.name || 'Unknown'}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Planned Start
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                {format(mission.plannedStart, 'MMM d, yyyy HH:mm')}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Planned End
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                {format(mission.plannedEnd, 'MMM d, yyyy HH:mm')}
              </dd>
            </div>
            {progress && (
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Progress
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                  {progress.percentComplete.toFixed(0)}% complete
                </dd>
                <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full"
                    style={{ width: `${progress.percentComplete}%` }}
                  />
                </div>
              </div>
            )}
          </dl>
        </Card>

        {/* Checkpoints */}
        <Card title="Checkpoints" className="lg:col-span-2">
          <CheckpointTimeline checkpoints={mission.checkpoints} />
        </Card>
      </div>

      {/* Map */}
      <Card title="Mission Route">
        <div className="h-[500px]">
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
            {drone && (
              <Marker
                position={[drone.currentPosition.lat, drone.currentPosition.lng]}
                icon={droneIcon}
              />
            )}
          </MapContainer>
        </div>
      </Card>
    </div>
  );
};
