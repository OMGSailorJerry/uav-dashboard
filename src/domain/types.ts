/**
 * Core domain types for UAV Fleet Operations Dashboard
 */

export type DroneStatus = 'AVAILABLE' | 'IN_MISSION' | 'MAINTENANCE' | 'OFFLINE';
export type MissionStatus = 'DRAFT' | 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'ABORTED';
export type AlertSeverity = 'INFO' | 'WARNING' | 'CRITICAL';
export type UserRole = 'coordinator' | 'operator';

export interface LatLng {
  lat: number;
  lng: number;
}

export interface Drone {
  id: string;
  name: string;
  model: string;
  status: DroneStatus;
  batteryPercent: number;
  currentPosition: LatLng;
  assignedMissionId: string | null;
}

export interface Checkpoint {
  id: string;
  label: string;
  position: LatLng;
  plannedTime: number;
  actualTime: number | null;
  status: 'PENDING' | 'REACHED' | 'SKIPPED';
}

export interface Mission {
  id: string;
  title: string;
  assignedDroneId: string;
  assignedOperatorId: string | null;
  status: MissionStatus;
  plannedStart: number;
  plannedEnd: number;
  checkpoints: Checkpoint[];
  createdBy: string;
}

export interface Alert {
  id: string;
  severity: AlertSeverity;
  message: string;
  missionId: string | null;
  droneId: string | null;
  timestamp: number;
  acknowledged: boolean;
}

export interface User {
  id: string;
  role: UserRole;
  name: string;
}
