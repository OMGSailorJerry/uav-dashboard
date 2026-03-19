/**
 * Drone fleet state management store
 * Manages drone statuses, positions, and battery levels
 */

import { create } from 'zustand';
import { Drone, DroneStatus, LatLng } from '@/domain/types';
import { mockDrones } from '@/data/mockData';

interface DroneStore {
  drones: Drone[];
  
  /**
   * Updates the position of a specific drone
   * TODO: Replace with WebSocket updates from backend
   */
  updateDronePosition: (droneId: string, position: LatLng) => void;
  
  /**
   * Updates the operational status of a drone
   * TODO: Replace with real API call
   */
  updateDroneStatus: (droneId: string, status: DroneStatus) => void;
  
  /**
   * Updates the battery level of a specific drone
   * TODO: Replace with real-time telemetry from backend
   */
  updateBattery: (droneId: string, batteryPercent: number) => void;
  
  /**
   * Gets a drone by its ID
   */
  getDroneById: (droneId: string) => Drone | undefined;
}

export const useDroneStore = create<DroneStore>((set, get) => ({
  drones: mockDrones,

  updateDronePosition: (droneId: string, position: LatLng) => {
    set((state) => ({
      drones: state.drones.map((drone) =>
        drone.id === droneId ? { ...drone, currentPosition: position } : drone
      ),
    }));
  },

  updateDroneStatus: (droneId: string, status: DroneStatus) => {
    set((state) => ({
      drones: state.drones.map((drone) =>
        drone.id === droneId ? { ...drone, status } : drone
      ),
    }));
  },

  updateBattery: (droneId: string, batteryPercent: number) => {
    set((state) => ({
      drones: state.drones.map((drone) =>
        drone.id === droneId ? { ...drone, batteryPercent } : drone
      ),
    }));
  },

  getDroneById: (droneId: string) => {
    return get().drones.find((drone) => drone.id === droneId);
  },
}));
