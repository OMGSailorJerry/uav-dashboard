/**
 * Fleet map component using react-leaflet
 * Displays drones and their positions on an interactive map
 */

import React from 'react';
import { MapContainer, TileLayer, Marker, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Drone } from '@/domain/types';

interface FleetMapProps {
  drones: Drone[];
  center?: { lat: number; lng: number };
  zoom?: number;
  className?: string;
}

const DRONE_COLORS: Record<Drone['status'], string> = {
  IN_MISSION: '#eab308',
  AVAILABLE: '#22c55e',
  MAINTENANCE: '#f97316',
  OFFLINE: '#ef4444',
};

const getDroneIcon = (status: Drone['status']) => {
  const color = DRONE_COLORS[status] ?? '#6b7280';
  return L.divIcon({
    className: '',
    html: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="${color}" style="transform:rotate(-45deg);filter:drop-shadow(0 1px 2px rgba(0,0,0,.4))"><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

export const FleetMap: React.FC<FleetMapProps> = ({
  drones,
  center = { lat: 50.4501, lng: 30.5234 },
  zoom = 12,
  className = '',
}) => {
  return (
    <div className={`relative w-full h-full ${className}`}>
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={zoom}
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap Contributors"
          maxZoom={19}
        />
        {drones.map((drone) => (
          <Marker
            key={drone.id}
            position={[drone.currentPosition.lat, drone.currentPosition.lng]}
            icon={getDroneIcon(drone.status)}
          >
            <Tooltip>
              {drone.name} ({drone.batteryPercent}%)
            </Tooltip>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};
