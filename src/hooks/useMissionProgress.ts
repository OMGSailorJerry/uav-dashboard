/**
 * Custom hook for calculating mission progress
 * Returns completion percentage and checkpoint statistics
 */

import { useMemo } from 'react';
import { Mission } from '@/domain/types';
import { MissionProgress } from '@/domain/viewModels';

export const useMissionProgress = (mission: Mission): MissionProgress => {
  return useMemo(() => {
    const totalCheckpoints = mission.checkpoints.length;
    const completedCheckpoints = mission.checkpoints.filter(
      (cp) => cp.status === 'REACHED'
    ).length;

    const percentComplete =
      totalCheckpoints > 0 ? (completedCheckpoints / totalCheckpoints) * 100 : 0;

    // Calculate estimated time remaining
    let estimatedTimeRemaining: number | null = null;

    if (mission.status === 'IN_PROGRESS' && completedCheckpoints < totalCheckpoints) {
      const now = Date.now();
      const remainingCheckpoints = mission.checkpoints.filter(
        (cp) => cp.status === 'PENDING'
      );

      if (remainingCheckpoints.length > 0) {
        // Use the last checkpoint's planned time
        const lastCheckpointTime =
          remainingCheckpoints[remainingCheckpoints.length - 1].plannedTime;
        estimatedTimeRemaining = Math.max(0, lastCheckpointTime - now);
      }
    }

    return {
      missionId: mission.id,
      completedCheckpoints,
      totalCheckpoints,
      percentComplete,
      estimatedTimeRemaining,
    };
  }, [mission]);
};
