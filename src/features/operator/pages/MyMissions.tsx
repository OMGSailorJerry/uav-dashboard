/**
 * My Missions Page - Operator Dashboard
 * Shows missions assigned to the current operator
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { useMissionStore } from '@/store/missionStore';
import { useDroneStore } from '@/store/droneStore';
import { useUserStore } from '@/store/userStore';
import { useMissionProgress } from '@/hooks/useMissionProgress';
import { Card } from '@/features/shared/components/ui/Card';
import { MissionStatusBadge } from '@/features/shared/components/mission/MissionStatusBadge';
import { format } from 'date-fns';
import { Target, Clock, CheckCircle2 } from 'lucide-react';

export const MyMissions: React.FC = () => {
  const currentUser = useUserStore((state) => state.currentUser);
  const missions = useMissionStore((state) => state.missions);
  const getDroneById = useDroneStore((state) => state.getDroneById);

  // Filter missions assigned to current operator
  const myMissions = missions.filter(
    (m) => m.assignedOperatorId === currentUser?.id
  );

  const activeMissions = myMissions.filter((m) => m.status === 'IN_PROGRESS');
  const upcomingMissions = myMissions.filter((m) => m.status === 'PLANNED');
  const completedMissions = myMissions.filter((m) => m.status === 'COMPLETED');

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        My Missions
      </h1>

      {/* Mission Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-full">
              <Target className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {activeMissions.length}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
              <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Upcoming</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {upcomingMissions.length}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
              <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {completedMissions.length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Active Missions */}
      {activeMissions.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Active Missions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeMissions.map((mission) => {
              const drone = getDroneById(mission.assignedDroneId);
              const progress = useMissionProgress(mission);

              return (
                <Card key={mission.id}>
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {mission.title}
                      </h3>
                      <MissionStatusBadge status={mission.status} />
                    </div>

                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <p>Drone: {drone?.name || 'Unknown'}</p>
                      <p>Started: {format(mission.plannedStart, 'HH:mm, MMM d')}</p>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                        <span>Progress</span>
                        <span>{progress.percentComplete.toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-primary-600 h-2 rounded-full"
                          style={{ width: `${progress.percentComplete}%` }}
                        />
                      </div>
                    </div>

                    <Link
                      to={`/operator/missions/${mission.id}`}
                      className="block w-full text-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md font-medium"
                    >
                      Execute Mission
                    </Link>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Upcoming Missions */}
      {upcomingMissions.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Upcoming Missions
          </h2>
          <div className="space-y-4">
            {upcomingMissions.map((mission) => {
              const drone = getDroneById(mission.assignedDroneId);

              return (
                <Card key={mission.id}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {mission.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Drone: {drone?.name || 'Unknown'} | Starts:{' '}
                        {format(mission.plannedStart, 'HH:mm, MMM d, yyyy')}
                      </p>
                    </div>
                    <MissionStatusBadge status={mission.status} />
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {myMissions.length === 0 && (
        <Card>
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">
            No missions assigned to you yet
          </p>
        </Card>
      )}
    </div>
  );
};
