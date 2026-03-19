/**
 * Mock data for UAV Fleet Operations Dashboard
 * TODO: Replace with real API calls to backend service
 */

import { Drone, Mission, Alert, Checkpoint } from '@/domain/types';

// Kyiv, Ukraine area coordinates (lat ~50.45, lng ~30.52)
export const mockDrones: Drone[] = [
  {
    id: 'drone-001',
    name: 'Falcon-1',
    model: 'DJI Matrice 300',
    status: 'IN_MISSION',
    batteryPercent: 72,
    currentPosition: { lat: 50.4501, lng: 30.5234 },
    assignedMissionId: 'mission-001',
  },
  {
    id: 'drone-002',
    name: 'Eagle-2',
    model: 'DJI Mavic 3',
    status: 'IN_MISSION',
    batteryPercent: 85,
    currentPosition: { lat: 50.4623, lng: 30.5112 },
    assignedMissionId: 'mission-002',
  },
  {
    id: 'drone-003',
    name: 'Hawk-3',
    model: 'Autel EVO II',
    status: 'MAINTENANCE',
    batteryPercent: 45,
    currentPosition: { lat: 50.4501, lng: 30.5234 },
    assignedMissionId: null,
  },
  {
    id: 'drone-004',
    name: 'Phoenix-4',
    model: 'DJI Matrice 300',
    status: 'AVAILABLE',
    batteryPercent: 100,
    currentPosition: { lat: 50.4501, lng: 30.5234 },
    assignedMissionId: null,
  },
  {
    id: 'drone-005',
    name: 'Sparrow-5',
    model: 'DJI Mavic 3',
    status: 'AVAILABLE',
    batteryPercent: 95,
    currentPosition: { lat: 50.4501, lng: 30.5234 },
    assignedMissionId: null,
  },
];

const createCheckpoints = (
  count: number,
  startLat: number,
  startLng: number,
  baseTime: number,
  completed: number = 0
): Checkpoint[] => {
  const checkpoints: Checkpoint[] = [];
  const latStep = 0.01;
  const lngStep = 0.01;
  const timeStep = 15 * 60 * 1000; // 15 minutes

  for (let i = 0; i < count; i++) {
    const isCompleted = i < completed;
    checkpoints.push({
      id: `checkpoint-${i + 1}`,
      label: `Checkpoint ${i + 1}`,
      position: {
        lat: startLat + i * latStep,
        lng: startLng + i * lngStep,
      },
      plannedTime: baseTime + i * timeStep,
      actualTime: isCompleted ? baseTime + i * timeStep + Math.random() * 60000 : null,
      status: isCompleted ? 'REACHED' : 'PENDING',
    });
  }

  return checkpoints;
};

export const mockMissions: Mission[] = [
  {
    id: 'mission-001',
    title: 'Infrastructure Inspection - Downtown',
    assignedDroneId: 'drone-001',
    assignedOperatorId: 'user-operator-1',
    status: 'IN_PROGRESS',
    plannedStart: Date.now() - 30 * 60 * 1000, // Started 30 minutes ago
    plannedEnd: Date.now() + 30 * 60 * 1000, // Ends in 30 minutes
    checkpoints: createCheckpoints(4, 50.4501, 30.5234, Date.now() - 30 * 60 * 1000, 2),
    createdBy: 'user-coordinator-1',
  },
  {
    id: 'mission-002',
    title: 'Perimeter Survey - Industrial Zone',
    assignedDroneId: 'drone-002',
    assignedOperatorId: 'user-operator-2',
    status: 'PLANNED',
    plannedStart: Date.now() + 2 * 60 * 60 * 1000, // Starts in 2 hours
    plannedEnd: Date.now() + 3 * 60 * 60 * 1000, // Ends in 3 hours
    checkpoints: createCheckpoints(3, 50.4623, 30.5112, Date.now() + 2 * 60 * 60 * 1000),
    createdBy: 'user-coordinator-1',
  },
  {
    id: 'mission-003',
    title: 'Agricultural Mapping - East Fields',
    assignedDroneId: 'drone-001',
    assignedOperatorId: 'user-operator-1',
    status: 'COMPLETED',
    plannedStart: Date.now() - 5 * 60 * 60 * 1000, // Started 5 hours ago
    plannedEnd: Date.now() - 3 * 60 * 60 * 1000, // Ended 3 hours ago
    checkpoints: createCheckpoints(3, 50.4789, 30.5445, Date.now() - 5 * 60 * 60 * 1000, 3),
    createdBy: 'user-coordinator-1',
  },
];

export const mockAlerts: Alert[] = [
  {
    id: 'alert-001',
    severity: 'WARNING',
    message: 'Low battery detected - 45%',
    missionId: null,
    droneId: 'drone-003',
    timestamp: Date.now() - 10 * 60 * 1000,
    acknowledged: false,
  },
  {
    id: 'alert-002',
    severity: 'INFO',
    message: 'Mission completed successfully',
    missionId: 'mission-003',
    droneId: 'drone-001',
    timestamp: Date.now() - 3 * 60 * 60 * 1000,
    acknowledged: true,
  },
  {
    id: 'alert-003',
    severity: 'CRITICAL',
    message: 'Drone requires immediate maintenance',
    missionId: null,
    droneId: 'drone-003',
    timestamp: Date.now() - 5 * 60 * 1000,
    acknowledged: false,
  },
  {
    id: 'alert-004',
    severity: 'INFO',
    message: 'Checkpoint 2 reached ahead of schedule',
    missionId: 'mission-001',
    droneId: 'drone-001',
    timestamp: Date.now() - 2 * 60 * 1000,
    acknowledged: true,
  },
];
