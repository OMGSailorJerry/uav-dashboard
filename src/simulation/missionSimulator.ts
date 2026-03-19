/**
 * Mission simulation engine
 * Simulates real-time mission progress, checkpoint advancement, and drone telemetry
 * TODO: Replace with WebSocket feed from backend
 */

import { useMissionStore } from '@/store/missionStore';
import { useDroneStore } from '@/store/droneStore';
import { useSimulationStore } from '@/store/simulationStore';
import { useAlertStore } from '@/store/alertStore';

let simulationInterval: NodeJS.Timeout | null = null;

/**
 * Starts the mission simulation with configurable speed
 * Advances IN_PROGRESS missions toward their next checkpoint
 */
export const startSimulation = () => {
  if (simulationInterval) {
    stopSimulation();
  }

  const tick = () => {
    const { missions, updateCheckpoint, updateMissionStatus, getMissionById } = useMissionStore.getState();
    const { updateDronePosition, updateDroneStatus, updateBattery } = useDroneStore.getState();
    const { speed } = useSimulationStore.getState();
    const { addAlert } = useAlertStore.getState();

    const now = Date.now();

    missions.forEach((mission) => {
      if (mission.status !== 'IN_PROGRESS') return;

      const currentMission = getMissionById(mission.id);
      if (!currentMission) return;

      // Find next pending checkpoint
      const nextCheckpoint = currentMission.checkpoints.find(
        (cp) => cp.status === 'PENDING'
      );

      if (!nextCheckpoint) {
        // All checkpoints reached - complete mission
        updateMissionStatus(mission.id, 'COMPLETED');
        updateDroneStatus(mission.assignedDroneId, 'AVAILABLE');
        
        addAlert({
          severity: 'INFO',
          message: `Mission "${mission.title}" completed successfully`,
          missionId: mission.id,
          droneId: mission.assignedDroneId,
        });
        
        return;
      }

      // Check if checkpoint should be reached based on planned time
      const timeToCheckpoint = nextCheckpoint.plannedTime - now;
      const simulationThreshold = 5000 / speed; // 5 seconds in real-time, adjusted by speed

      if (timeToCheckpoint <= simulationThreshold) {
        // Reach checkpoint
        updateCheckpoint(mission.id, nextCheckpoint.id, {
          status: 'REACHED',
          actualTime: now,
        });

        // Update drone position to checkpoint
        updateDronePosition(mission.assignedDroneId, nextCheckpoint.position);

        // Simulate battery drain (1-3% per checkpoint)
        const drone = useDroneStore.getState().getDroneById(mission.assignedDroneId);
        if (drone) {
          const batteryDrain = Math.floor(Math.random() * 3) + 1;
          const newBattery = Math.max(0, drone.batteryPercent - batteryDrain);
          updateBattery(mission.assignedDroneId, newBattery);

          // Low battery warning
          if (newBattery <= 20 && newBattery > 0) {
            addAlert({
              severity: 'WARNING',
              message: `Low battery on ${drone.name}: ${newBattery}%`,
              missionId: mission.id,
              droneId: drone.id,
            });
          }
        }

        addAlert({
          severity: 'INFO',
          message: `Checkpoint "${nextCheckpoint.label}" reached in mission "${mission.title}"`,
          missionId: mission.id,
          droneId: mission.assignedDroneId,
        });
      } else {
        // Simulate gradual position change toward next checkpoint
        const drone = useDroneStore.getState().getDroneById(mission.assignedDroneId);
        if (drone) {
          const newLat = drone.currentPosition.lat + (nextCheckpoint.position.lat - drone.currentPosition.lat) * 0.01;
          const newLng = drone.currentPosition.lng + (nextCheckpoint.position.lng - drone.currentPosition.lng) * 0.01;
          
          updateDronePosition(mission.assignedDroneId, {
            lat: newLat,
            lng: newLng,
          });
        }
      }
    });
  };

  // Run simulation tick based on speed
  const { speed } = useSimulationStore.getState();
  const intervalTime = 1000 / speed; // Base tick rate adjusted by speed
  
  simulationInterval = setInterval(tick, intervalTime);
};

/**
 * Stops the active simulation
 */
export const stopSimulation = () => {
  if (simulationInterval) {
    clearInterval(simulationInterval);
    simulationInterval = null;
  }
};

/**
 * Updates the simulation speed and restarts if running
 */
export const updateSimulationSpeed = (_speed: number) => {
  const { isRunning } = useSimulationStore.getState();
  if (isRunning) {
    stopSimulation();
    startSimulation();
  }
};
