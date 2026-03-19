/**
 * Mission route layer component
 * Displays mission checkpoints and route on the map
 */

import React from 'react';
import { Polyline, Marker, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import { Mission } from '@/domain/types';

interface MissionRouteLayerProps {
  mission: Mission;
}

const getCheckpointIcon = (status: string, index: number) => {
  const bg =
    status === 'REACHED' ? '#22c55e' : status === 'SKIPPED' ? '#ef4444' : '#3b82f6';
  const border =
    status === 'REACHED' ? '#15803d' : status === 'SKIPPED' ? '#b91c1c' : '#1d4ed8';
  return L.divIcon({
    className: '',
    html: `<div style="width:32px;height:32px;background:${bg};border:2px solid ${border};border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-size:12px;font-weight:bold;line-height:28px;text-align:center">${index + 1}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

export const MissionRouteLayer: React.FC<MissionRouteLayerProps> = ({ mission }) => {
  const positions = mission.checkpoints.map(
    (cp) => [cp.position.lat, cp.position.lng] as [number, number]
  );

  return (
    <>
      <Polyline positions={positions} color="#3b82f6" weight={3} dashArray="8, 8" />
      {mission.checkpoints.map((checkpoint, index) => (
        <Marker
          key={checkpoint.id}
          position={[checkpoint.position.lat, checkpoint.position.lng]}
          icon={getCheckpointIcon(checkpoint.status, index)}
        >
          <Tooltip>{checkpoint.label}</Tooltip>
        </Marker>
      ))}
    </>
  );
};
