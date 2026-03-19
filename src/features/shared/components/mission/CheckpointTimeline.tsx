/**
 * Checkpoint timeline component
 * Displays mission checkpoints in a vertical timeline
 */

import React from 'react';
import { Checkpoint } from '@/domain/types';
import { Check, Circle, X } from 'lucide-react';
import { format } from 'date-fns';

interface CheckpointTimelineProps {
  checkpoints: Checkpoint[];
  className?: string;
}

export const CheckpointTimeline: React.FC<CheckpointTimelineProps> = ({
  checkpoints,
  className = '',
}) => {
  const getStatusIcon = (status: Checkpoint['status']) => {
    switch (status) {
      case 'REACHED':
        return <Check className="w-5 h-5 text-green-500" />;
      case 'SKIPPED':
        return <X className="w-5 h-5 text-red-500" />;
      case 'PENDING':
      default:
        return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: Checkpoint['status']) => {
    switch (status) {
      case 'REACHED':
        return 'border-green-500 bg-green-50 dark:bg-green-900';
      case 'SKIPPED':
        return 'border-red-500 bg-red-50 dark:bg-red-900';
      case 'PENDING':
      default:
        return 'border-gray-300 bg-gray-50 dark:bg-gray-800 dark:border-gray-600';
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {checkpoints.map((checkpoint, index) => (
        <div key={checkpoint.id} className="flex items-start">
          <div className="flex flex-col items-center mr-4">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${getStatusColor(
                checkpoint.status
              )}`}
            >
              {getStatusIcon(checkpoint.status)}
            </div>
            {index < checkpoints.length - 1 && (
              <div className="w-0.5 h-12 bg-gray-300 dark:bg-gray-600 mt-2" />
            )}
          </div>
          <div className="flex-1 pb-8">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
              {checkpoint.label}
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Planned: {format(checkpoint.plannedTime, 'HH:mm, MMM d')}
            </p>
            {checkpoint.actualTime && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Actual: {format(checkpoint.actualTime, 'HH:mm, MMM d')}
              </p>
            )}
            <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
              {checkpoint.position.lat.toFixed(4)}, {checkpoint.position.lng.toFixed(4)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
