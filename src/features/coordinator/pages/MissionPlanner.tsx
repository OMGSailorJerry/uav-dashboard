/**
 * Mission Planner Page - Coordinator
 * Form for creating new missions
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMissionStore } from '@/store/missionStore';
import { useDroneStore } from '@/store/droneStore';
import { Card } from '@/features/shared/components/ui/Card';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface MissionFormData {
  title: string;
  assignedDroneId: string;
  plannedStart: string;
  plannedEnd: string;
}

export const MissionPlanner: React.FC = () => {
  const navigate = useNavigate();
  const createMission = useMissionStore((state) => state.createMission);
  const drones = useDroneStore((state) => state.drones);
  const availableDrones = drones.filter((d) => d.status === 'AVAILABLE');

  const { register, handleSubmit } = useForm<MissionFormData>();

  const onSubmit = (data: MissionFormData) => {
    // TODO: Add form validation
    // TODO: Allow checkpoint configuration in the form
    
    createMission({
      title: data.title,
      assignedDroneId: data.assignedDroneId,
      assignedOperatorId: null,
      status: 'PLANNED',
      plannedStart: new Date(data.plannedStart).getTime(),
      plannedEnd: new Date(data.plannedEnd).getTime(),
      checkpoints: [], // TODO: Allow user to define checkpoints
      createdBy: 'user-coordinator-1', // TODO: Get from user store
    });

    navigate('/coordinator/missions');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          to="/coordinator/missions"
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Create New Mission
        </h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Mission Title
            </label>
            <input
              {...register('title', { required: true })}
              type="text"
              id="title"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="e.g., Infrastructure Inspection - Downtown"
            />
          </div>

          <div>
            <label
              htmlFor="assignedDroneId"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Assigned Drone
            </label>
            <select
              {...register('assignedDroneId', { required: true })}
              id="assignedDroneId"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Select a drone...</option>
              {availableDrones.map((drone) => (
                <option key={drone.id} value={drone.id}>
                  {drone.name} ({drone.model}) - Battery: {drone.batteryPercent}%
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="plannedStart"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Planned Start
              </label>
              <input
                {...register('plannedStart', { required: true })}
                type="datetime-local"
                id="plannedStart"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label
                htmlFor="plannedEnd"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Planned End
              </label>
              <input
                {...register('plannedEnd', { required: true })}
                type="datetime-local"
                id="plannedEnd"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded-md p-4">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>TODO:</strong> Checkpoint configuration UI coming soon. For now, missions
              are created without checkpoints.
            </p>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md font-medium"
            >
              Create Mission
            </button>
            <Link
              to="/coordinator/missions"
              className="px-6 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-md font-medium"
            >
              Cancel
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
};
