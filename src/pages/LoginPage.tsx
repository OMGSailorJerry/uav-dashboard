/**
 * Login Page
 * Simple authentication interface with role selection
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useUserStore } from '@/store/userStore';
import { UserRole } from '@/domain/types';
import { Plane } from 'lucide-react';

interface LoginFormData {
  email: string;
  password: string;
}

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const login = useUserStore((state) => state.login);
  const [selectedRole, setSelectedRole] = useState<UserRole>('coordinator');

  const { register, handleSubmit } = useForm<LoginFormData>();

  const onSubmit = (_data: LoginFormData) => {
    // TODO: Replace mock login with real auth service
    login(selectedRole);

    // Redirect based on role
    if (selectedRole === 'coordinator') {
      navigate('/coordinator');
    } else {
      navigate('/operator');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-full mb-4">
            <Plane className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            UAV Fleet Operations
          </h1>
          <p className="text-slate-400">Access your mission control dashboard</p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-800 rounded-lg shadow-xl p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email/Phone Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Email or Phone
              </label>
              <input
                {...register('email')}
                type="text"
                id="email"
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter your email or phone"
              />
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Password
              </label>
              <input
                {...register('password')}
                type="password"
                id="password"
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter your password"
              />
            </div>

            {/* Role Selector */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">
                Select Role
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedRole('coordinator')}
                  className={`px-4 py-3 rounded-md font-medium transition-colors ${
                    selectedRole === 'coordinator'
                      ? 'bg-primary-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  Coordinator
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRole('operator')}
                  className={`px-4 py-3 rounded-md font-medium transition-colors ${
                    selectedRole === 'operator'
                      ? 'bg-primary-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  Operator
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-slate-800"
            >
              Sign In
            </button>
          </form>

          {/* TODO Notice */}
          <div className="mt-6 p-4 bg-slate-700 rounded-md border border-slate-600">
            <p className="text-xs text-slate-400 text-center">
              <strong>Development Mode:</strong> No authentication required. Click any role
              to proceed.
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-slate-500 text-sm mt-6">
          UAV Fleet Management System v0.1.0
        </p>
      </div>
    </div>
  );
};
