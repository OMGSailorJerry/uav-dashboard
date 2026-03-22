/**
 * Mission Planner Page - Coordinator
 * Full-featured mission creation with interactive map checkpoint placement
 */

import React, { useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { MapContainer, TileLayer, Marker, Polyline, Tooltip, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Trash2 } from 'lucide-react';
import { ArrowLeft } from 'lucide-react';
import { useMissionStore } from '@/store/missionStore';
import { useDroneStore } from '@/store/droneStore';
import { useUserStore } from '@/store/userStore';
import { Card } from '@/features/shared/components/ui/Card';
import { mockOperators } from '@/data/mockData';
import type { LatLng, Checkpoint } from '@/domain/types';

interface MissionFormData {
  title: string;
  assignedDroneId: string;
  assignedOperatorId: string;
  plannedStart: string;
  plannedEnd: string;
}

interface PendingCheckpoint {
  id: string;
  label: string;
  position: LatLng;
  plannedTime: number;
}

const MapClickHandler: React.FC<{ onMapClick: (latlng: LatLng) => void }> = ({ onMapClick }) => {
  useMapEvents({
    click(e) {
      onMapClick({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
};

const getCheckpointIcon = (index: number) =>
  L.divIcon({
    className: '',
    html: `<div style="width:32px;height:32px;background:#3b82f6;border:2px solid #1d4ed8;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-size:12px;font-weight:bold;line-height:28px;text-align:center">${index + 1}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });

const toDatetimeLocal = (ts: number): string => {
  const d = new Date(ts);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export const MissionPlanner: React.FC = () => {
  const navigate = useNavigate();
  const createMission = useMissionStore((state) => state.createMission);
  const drones = useDroneStore((state) => state.drones);
  const currentUser = useUserStore((state) => state.currentUser);
  const availableDrones = drones.filter((d) => d.status === 'AVAILABLE');

  const [checkpoints, setCheckpoints] = useState<PendingCheckpoint[]>([]);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<MissionFormData>();

  const plannedStartValue = watch('plannedStart');

  const handleMapClick = useCallback(
    (latlng: LatLng) => {
      const startMs = plannedStartValue ? new Date(plannedStartValue).getTime() : Date.now();
      setCheckpoints((prev) => {
        const index = prev.length;
        return [
          ...prev,
          {
            id: `cp-new-${Date.now()}-${index}`,
            label: `Waypoint ${index + 1}`,
            position: latlng,
            plannedTime: startMs + index * 15 * 60 * 1000,
          },
        ];
      });
    },
    [plannedStartValue]
  );

  const updateCheckpointLabel = (id: string, label: string) => {
    setCheckpoints((prev) => prev.map((cp) => (cp.id === id ? { ...cp, label } : cp)));
  };

  const updateCheckpointTime = (id: string, timeStr: string) => {
    const time = new Date(timeStr).getTime();
    if (!isNaN(time)) {
      setCheckpoints((prev) => prev.map((cp) => (cp.id === id ? { ...cp, plannedTime: time } : cp)));
    }
  };

  const removeCheckpoint = (id: string) => {
    setCheckpoints((prev) => {
      const filtered = prev.filter((cp) => cp.id !== id);
      return filtered.map((cp, i) =>
        cp.label.match(/^Waypoint \d+$/) ? { ...cp, label: `Waypoint ${i + 1}` } : cp
      );
    });
  };

  const onSubmit = (data: MissionFormData) => {
    setSubmitAttempted(true);
    if (checkpoints.length === 0) return;

    const finalCheckpoints: Checkpoint[] = checkpoints.map((cp) => ({
      id: cp.id,
      label: cp.label,
      position: cp.position,
      plannedTime: cp.plannedTime,
      actualTime: null,
      status: 'PENDING',
    }));

    createMission({
      title: data.title,
      assignedDroneId: data.assignedDroneId,
      assignedOperatorId: data.assignedOperatorId || null,
      status: 'PLANNED',
      plannedStart: new Date(data.plannedStart).getTime(),
      plannedEnd: new Date(data.plannedEnd).getTime(),
      checkpoints: finalCheckpoints,
      createdBy: currentUser?.id ?? 'unknown',
    });

    navigate('/coordinator/missions');
  };

  const polylinePositions = checkpoints.map(
    (cp) => [cp.position.lat, cp.position.lng] as [number, number]
  );

  const noCheckpoints = submitAttempted && checkpoints.length === 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          to="/coordinator/missions"
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create New Mission</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Mission metadata */}
        <Card title="Mission Details">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Mission Title <span className="text-red-500">*</span>
              </label>
              <input
                {...register('title', { required: 'Mission title is required' })}
                type="text"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="e.g., Infrastructure Inspection — Downtown"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Assigned Drone <span className="text-red-500">*</span>
              </label>
              <select
                {...register('assignedDroneId', { required: 'Please select a drone' })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Select a drone...</option>
                {availableDrones.map((drone) => (
                  <option key={drone.id} value={drone.id}>
                    {drone.name} ({drone.model}) — {drone.batteryPercent}% battery
                  </option>
                ))}
              </select>
              {errors.assignedDroneId && (
                <p className="mt-1 text-sm text-red-500">{errors.assignedDroneId.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Assigned Operator
              </label>
              <select
                {...register('assignedOperatorId')}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Unassigned</option>
                {mockOperators.map((op) => (
                  <option key={op.id} value={op.id}>
                    {op.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Planned Start <span className="text-red-500">*</span>
              </label>
              <input
                {...register('plannedStart', { required: 'Planned start is required' })}
                type="datetime-local"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              {errors.plannedStart && (
                <p className="mt-1 text-sm text-red-500">{errors.plannedStart.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Planned End <span className="text-red-500">*</span>
              </label>
              <input
                {...register('plannedEnd', { required: 'Planned end is required' })}
                type="datetime-local"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              {errors.plannedEnd && (
                <p className="mt-1 text-sm text-red-500">{errors.plannedEnd.message}</p>
              )}
            </div>
          </div>
        </Card>

        {/* Checkpoint builder */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map */}
          <div className="lg:col-span-2">
            <Card title="Route Planning">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                Click anywhere on the map to place waypoints in sequence.
              </p>
              <div
                className={`h-96 rounded-md overflow-hidden border ${noCheckpoints ? 'border-red-400' : 'border-gray-200 dark:border-gray-700'}`}
              >
                <MapContainer
                  center={[50.4501, 30.5234]}
                  zoom={12}
                  style={{ width: '100%', height: '100%' }}
                >
                  <TileLayer
                    url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap Contributors"
                    maxZoom={19}
                  />
                  <MapClickHandler onMapClick={handleMapClick} />
                  {polylinePositions.length > 1 && (
                    <Polyline
                      positions={polylinePositions}
                      color="#3b82f6"
                      weight={3}
                      dashArray="8,8"
                    />
                  )}
                  {checkpoints.map((cp, index) => (
                    <Marker
                      key={cp.id}
                      position={[cp.position.lat, cp.position.lng]}
                      icon={getCheckpointIcon(index)}
                    >
                      <Tooltip>{cp.label}</Tooltip>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
              {noCheckpoints && (
                <p className="mt-2 text-sm text-red-500">
                  At least one waypoint is required to create a mission.
                </p>
              )}
            </Card>
          </div>

          {/* Checkpoint list */}
          <div>
            <Card title={`Waypoints (${checkpoints.length})`}>
              {checkpoints.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                  <MapPin className="w-8 h-8 mb-2 opacity-40" />
                  <p className="text-sm text-center">Click the map to add waypoints</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                  {checkpoints.map((cp, index) => (
                    <div
                      key={cp.id}
                      className="border border-gray-200 dark:border-gray-700 rounded-md p-3 space-y-2"
                    >
                      <div className="flex items-center gap-2">
                        <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full text-xs flex items-center justify-center font-bold">
                          {index + 1}
                        </span>
                        <input
                          value={cp.label}
                          onChange={(e) => updateCheckpointLabel(cp.id, e.target.value)}
                          className="flex-1 min-w-0 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                        <button
                          type="button"
                          onClick={() => removeCheckpoint(cp.id)}
                          className="flex-shrink-0 text-gray-400 hover:text-red-500 transition-colors"
                          aria-label="Remove waypoint"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <input
                        type="datetime-local"
                        value={toDatetimeLocal(cp.plannedTime)}
                        onChange={(e) => updateCheckpointTime(cp.id, e.target.value)}
                        className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                      <p className="text-xs text-gray-400">
                        {cp.position.lat.toFixed(5)}, {cp.position.lng.toFixed(5)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
              {checkpoints.length > 0 && (
                <button
                  type="button"
                  onClick={() => setCheckpoints([])}
                  className="mt-3 text-sm text-red-500 hover:text-red-700 transition-colors"
                >
                  Clear all waypoints
                </button>
              )}
            </Card>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md font-medium"
          >
            Create Mission
          </button>
          <Link
            to="/coordinator/missions"
            className="px-6 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-md font-medium"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};
