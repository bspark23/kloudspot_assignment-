// Login page with form validation and authentication
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { authApi, LoginRequest } from '../api/auth';
import { Loader2 } from 'lucide-react';

interface LoginFormData {
  email: string;
  password: string;
}

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string>('');
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setLoginError('');

    try {
      const credentials: LoginRequest = {
        email: data.email,
        password: data.password,
      };

      const response = await authApi.login(credentials);
      authApi.storeAuth(response);
      navigate('/', { replace: true });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.errorMessage || 
                          error.message || 
                          'Login failed';
      setLoginError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative" style={{
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('/co1.png')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      {/* Fallback gradient if image doesn't load */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-gray-300" style={{
        backgroundImage: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        zIndex: -1
      }}></div>
      
      <div className="relative z-10 min-h-screen flex">
        {/* Left side - Welcome text */}
        <div className="flex-1 flex items-center justify-start pl-16">
          <div className="text-white">
            <h1 className="text-5xl font-bold leading-tight">
              Welcome to the<br />
              Crowd Management System
            </h1>
          </div>
        </div>

        {/* Right side - Login form - Exact Figma design */}
        <div className="flex-1 flex items-center justify-center pr-16">
          {/* Login Card - Simple and Clean */}
          <div 
            className="bg-white shadow-lg overflow-hidden"
            style={{
              width: '360px',
              height: '360px',
              borderRadius: '8px',
              opacity: 1
            }}
          >
            {/* Green Header with co2.png Background */}
            <div 
              className="flex items-center justify-center"
              style={{ 
                backgroundImage: 'url(/co2.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundColor: '#14b8a6',
                height: '110px'
              }}
            >
              <div className="flex items-center space-x-2">
                <img 
                  src="/Vector.png" 
                  alt="Kloudspot Vector Logo" 
                  className="h-6 w-6"
                  style={{ maxHeight: '24px', maxWidth: '24px' }}
                />
                <span className="text-white font-semibold text-xl">kloudspot</span>
              </div>
            </div>

            {/* Form Content - Optimized spacing to prevent button cutoff */}
            <div className="px-6 py-3" style={{ height: '250px' }}>
              <form onSubmit={handleSubmit(onSubmit)} noValidate className="h-full flex flex-col justify-between">
                <div className="space-y-4">
                  {/* Login Field - With line border like in image */}
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">
                      Log In *
                    </label>
                    <input
                      type="email"
                      placeholder="Parking_solutions"
                      className="w-full px-3 py-2 text-base border border-gray-300 rounded-md bg-transparent focus:outline-none focus:border-teal-500 text-gray-700 placeholder-gray-500"
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Please enter a valid email address',
                        },
                      })}
                      disabled={isLoading}
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
                    )}
                  </div>

                  {/* Password Field - With line border like in image */}
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">
                      Password *
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        placeholder="••••••••••"
                        className="w-full px-3 py-2 pr-10 text-base border border-gray-300 rounded-md bg-transparent focus:outline-none focus:border-teal-500 text-gray-700 placeholder-gray-400"
                        {...register('password', {
                          required: 'Password is required',
                          minLength: {
                            value: 6,
                            message: 'Password must be at least 6 characters',
                          },
                        })}
                        disabled={isLoading}
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </div>
                    </div>
                    {errors.password && (
                      <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
                    )}
                  </div>

                  {loginError && (
                    <div className="p-2 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-xs text-red-600">{loginError}</p>
                    </div>
                  )}
                </div>

                {/* Login Button - Fixed at bottom with proper spacing */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full text-white font-medium py-2.5 px-6 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:cursor-not-allowed flex items-center justify-center"
                  style={{
                    backgroundColor: '#14b8a6',
                    opacity: isLoading ? 0.7 : 1,
                    fontSize: '16px',
                    fontWeight: '500'
                  }}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                      Signing in...
                    </>
                  ) : (
                    'Login'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};