/**
 * Simulation control state management store
 * Manages real-time mission simulation speed and state
 */

import { create } from 'zustand';

type SimulationSpeed = 1 | 2 | 5;

interface SimulationStore {
  isRunning: boolean;
  speed: SimulationSpeed;
  
  /**
   * Starts the mission simulation
   */
  startSimulation: () => void;
  
  /**
   * Stops the mission simulation
   */
  stopSimulation: () => void;
  
  /**
   * Sets the simulation speed multiplier
   */
  setSpeed: (speed: SimulationSpeed) => void;
}

export const useSimulationStore = create<SimulationStore>((set) => ({
  isRunning: false,
  speed: 1,

  startSimulation: () => {
    set({ isRunning: true });
  },

  stopSimulation: () => {
    set({ isRunning: false });
  },

  setSpeed: (speed: SimulationSpeed) => {
    set({ speed });
  },
}));
