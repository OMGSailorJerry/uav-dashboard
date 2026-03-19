/**
 * Custom hook for filtering and sorting missions
 * Provides flexible mission list filtering by status, operator, drone, etc.
 */

import { useMemo } from 'react';
import { Mission, MissionStatus } from '@/domain/types';

interface MissionFilters {
  status?: MissionStatus[];
  operatorId?: string;
  droneId?: string;
  searchQuery?: string;
}

export const useFilteredMissions = (
  missions: Mission[],
  filters: MissionFilters
): Mission[] => {
  return useMemo(() => {
    let filtered = [...missions];

    // Filter by status
    if (filters.status && filters.status.length > 0) {
      filtered = filtered.filter((mission) =>
        filters.status!.includes(mission.status)
      );
    }

    // Filter by operator
    if (filters.operatorId) {
      filtered = filtered.filter(
        (mission) => mission.assignedOperatorId === filters.operatorId
      );
    }

    // Filter by drone
    if (filters.droneId) {
      filtered = filtered.filter(
        (mission) => mission.assignedDroneId === filters.droneId
      );
    }

    // Filter by search query (searches title)
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter((mission) =>
        mission.title.toLowerCase().includes(query)
      );
    }

    // Sort by planned start time (most recent first)
    filtered.sort((a, b) => b.plannedStart - a.plannedStart);

    return filtered;
  }, [missions, filters]);
};
