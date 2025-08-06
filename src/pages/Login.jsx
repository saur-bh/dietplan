import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { SparklesIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from '../components/LoadingSpinner';

const Login = () => {
  const { signInWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await signInWithGoogle();
      // If result is null, it means we're using redirect method
      if (result === null) {
        // Don't set loading to false here as the page will redirect
        return;
      }
    } catch (error) {
      console.error('Sign in error:', error);
      
      if (error.code === 'auth/popup-blocked') {
        setError('Pop-ups are blocked. Please enable pop-ups for this site or try again.');
      } else if (error.code === 'auth/cancelled-popup-request') {
        setError('Sign-in was cancelled. Please try again.');
      } else {
        setError('Failed to sign in. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-green-500 p-4 rounded-full">
              <SparklesIcon className="w-12 h-12 text-white" />
            </div>
          </div>
          <h2 className="text-4xl font-bold text-gray-800 mb-2">
            AI Diet Coach
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Your personalized nutrition journey starts here
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {isLoading ? (
            <LoadingSpinner message="Signing you in..." />
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Get Started
                </h3>
                <p className="text-gray-600 text-sm">
                  Sign in to create your personalized meal plan
                </p>
              </div>

              <button
                onClick={handleGoogleSignIn}
                className="w-full flex items-center justify-center space-x-3 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="font-medium">Continue with Google</span>
              </button>

              <div className="text-center">
                <p className="text-xs text-gray-500">
                  By continuing, you agree to our Terms of Service and Privacy Policy
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="text-center">
          <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
            <div className="flex flex-col items-center space-y-2">
              <div className="bg-blue-100 p-2 rounded-full">
                <span className="text-blue-600">📊</span>
              </div>
              <span>Personalized Plans</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="bg-green-100 p-2 rounded-full">
                <span className="text-green-600">🤖</span>
              </div>
              <span>AI-Powered</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="bg-yellow-100 p-2 rounded-full">
                <span className="text-yellow-600">📈</span>
              </div>
              <span>Track Progress</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;