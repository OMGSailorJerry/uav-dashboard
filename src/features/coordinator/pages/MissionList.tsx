/**
 * Mission List Page - Coordinator
 * Displays all missions with filtering and sorting capabilities
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMissionStore } from '@/store/missionStore';
import { useDroneStore } from '@/store/droneStore';
import { useFilteredMissions } from '@/hooks/useFilteredMissions';
import { Card } from '@/features/shared/components/ui/Card';
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@/features/shared/components/ui/Table';
import { MissionStatusBadge } from '@/features/shared/components/mission/MissionStatusBadge';
import { MissionStatus } from '@/domain/types';
import { format } from 'date-fns';
import { Plus } from 'lucide-react';

export const MissionList: React.FC = () => {
  const missions = useMissionStore((state) => state.missions);
  const getDroneById = useDroneStore((state) => state.getDroneById);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<MissionStatus[]>([]);

  const filteredMissions = useFilteredMissions(missions, {
    searchQuery,
    status: statusFilter.length > 0 ? statusFilter : undefined,
  });

  const handleStatusFilterToggle = (status: MissionStatus) => {
    setStatusFilter((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Missions</h1>
        <Link
          to="/coordinator/missions/new"
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md font-medium"
        >
          <Plus className="w-5 h-5" />
          New Mission
        </Link>
      </div>

      <Card>
        {/* Filters */}
        <div className="mb-6 space-y-4">
          <input
            type="text"
            placeholder="Search missions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />

          <div className="flex flex-wrap gap-2">
            {(['DRAFT', 'PLANNED', 'IN_PROGRESS', 'COMPLETED', 'ABORTED'] as MissionStatus[]).map(
              (status) => (
                <button
                  key={status}
                  onClick={() => handleStatusFilterToggle(status)}
                  className={`px-3 py-1 rounded-md text-sm font-medium ${
                    statusFilter.includes(status)
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {status.replace('_', ' ')}
                </button>
              )
            )}
          </div>
        </div>

        {/* Table */}
        <Table>
          <TableHeader>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Drone</TableHead>
            <TableHead>Planned Start</TableHead>
            <TableHead>Checkpoints</TableHead>
            <TableHead>Actions</TableHead>
          </TableHeader>
          <TableBody>
            {filteredMissions.map((mission) => {
              const drone = getDroneById(mission.assignedDroneId);
              const completedCheckpoints = mission.checkpoints.filter(
                (cp) => cp.status === 'REACHED'
              ).length;

              return (
                <TableRow key={mission.id}>
                  <TableCell>
                    <Link
                      to={`/coordinator/missions/${mission.id}`}
                      className="font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400"
                    >
                      {mission.title}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <MissionStatusBadge status={mission.status} />
                  </TableCell>
                  <TableCell>{drone?.name || 'Unknown'}</TableCell>
                  <TableCell>{format(mission.plannedStart, 'MMM d, HH:mm')}</TableCell>
                  <TableCell>
                    {completedCheckpoints} / {mission.checkpoints.length}
                  </TableCell>
                  <TableCell>
                    <Link
                      to={`/coordinator/missions/${mission.id}`}
                      className="text-primary-600 hover:text-primary-700 dark:text-primary-400 text-sm"
                    >
                      View Details
                    </Link>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {filteredMissions.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">
            No missions found
          </p>
        )}
      </Card>
    </div>
  );
};
