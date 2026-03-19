/**
 * View models for presenting domain data in UI components
 */

import { Mission, Drone, Alert } from './types';

export interface MissionWithDrone extends Mission {
  drone: Drone;
}

export interface FleetKPIs {
  totalDrones: number;
  activeMissions: number;
  availableDrones: number;
  maintenanceRequired: number;
}

export interface MissionProgress {
  missionId: string;
  completedCheckpoints: number;
  totalCheckpoints: number;
  percentComplete: number;
  estimatedTimeRemaining: number | null;
}

export interface AlertViewModel extends Alert {
  droneName?: string;
  missionTitle?: string;
}
