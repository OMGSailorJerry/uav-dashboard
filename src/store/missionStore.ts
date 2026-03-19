/**
 * Mission state management store
 * Manages mission lifecycle, checkpoints, and assignments
 */

import { create } from 'zustand';
import { Mission, MissionStatus, Checkpoint } from '@/domain/types';
import { mockMissions } from '@/data/mockData';

interface MissionStore {
  missions: Mission[];
  
  /**
   * Creates a new mission
   * TODO: Replace with API call to backend
   */
  createMission: (mission: Omit<Mission, 'id'>) => void;
  
  /**
   * Updates the status of an existing mission
   * TODO: Replace with API call to backend
   */
  updateMissionStatus: (missionId: string, status: MissionStatus) => void;
  
  /**
   * Updates a specific checkpoint within a mission
   * TODO: Replace with WebSocket updates from backend
   */
  updateCheckpoint: (
    missionId: string,
    checkpointId: string,
    updates: Partial<Checkpoint>
  ) => void;
  
  /**
   * Gets a mission by its ID
   */
  getMissionById: (missionId: string) => Mission | undefined;
  
  /**
   * Gets all missions assigned to a specific operator
   */
  getMissionsByOperator: (operatorId: string) => Mission[];
}

export const useMissionStore = create<MissionStore>((set, get) => ({
  missions: mockMissions,

  createMission: (mission: Omit<Mission, 'id'>) => {
    const newMission: Mission = {
      ...mission,
      id: `mission-${Date.now()}`,
    };
    set((state) => ({
      missions: [...state.missions, newMission],
    }));
  },

  updateMissionStatus: (missionId: string, status: MissionStatus) => {
    set((state) => ({
      missions: state.missions.map((mission) =>
        mission.id === missionId ? { ...mission, status } : mission
      ),
    }));
  },

  updateCheckpoint: (
    missionId: string,
    checkpointId: string,
    updates: Partial<Checkpoint>
  ) => {
    set((state) => ({
      missions: state.missions.map((mission) =>
        mission.id === missionId
          ? {
              ...mission,
              checkpoints: mission.checkpoints.map((checkpoint) =>
                checkpoint.id === checkpointId
                  ? { ...checkpoint, ...updates }
                  : checkpoint
              ),
            }
          : mission
      ),
    }));
  },

  getMissionById: (missionId: string) => {
    return get().missions.find((mission) => mission.id === missionId);
  },

  getMissionsByOperator: (operatorId: string) => {
    return get().missions.filter(
      (mission) => mission.assignedOperatorId === operatorId
    );
  },
}));
