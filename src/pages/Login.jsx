import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { SparklesIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from '../components/LoadingSpinner';

const Login = () => {
  const { signInWithEmail, registerWithEmail, signInWithPhone, getRecaptchaVerifier } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);


  // Email/password login state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await signInWithEmail(email, password);
    } catch (error) {
      setError(error.message || 'Failed to sign in.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await registerWithEmail(email, password);
    } catch (error) {
      setError(error.message || 'Failed to register.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const verifier = getRecaptchaVerifier('recaptcha-container');
      const result = await signInWithPhone(phone, verifier);
      setConfirmationResult(result);
    } catch (error) {
      setError(error.message || 'Failed to send OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      if (confirmationResult) {
        await confirmationResult.confirm(otp);
      }
    } catch (error) {
      setError(error.message || 'Failed to verify OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center px-2 sm:px-4">
      <div className="w-full max-w-md space-y-8">
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

        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100">
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


              <form onSubmit={handleEmailLogin} className="space-y-4">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  required
                />
                <div className="flex gap-2">
                  <button type="submit" className="flex-1 bg-blue-500 text-white py-2 rounded-lg text-sm">Login</button>
                  <button type="button" onClick={handleEmailRegister} className="flex-1 bg-green-500 text-white py-2 rounded-lg text-sm">Register</button>
                </div>
              </form>

              <form onSubmit={confirmationResult ? handleVerifyOtp : handlePhoneLogin} className="space-y-4 mt-6">
                <input
                  type="tel"
                  placeholder="Phone number (with country code)"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  required
                  disabled={!!confirmationResult}
                />
                {confirmationResult && (
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={e => setOtp(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                    required
                  />
                )}
                <button type="submit" className="w-full bg-yellow-500 text-white py-2 rounded-lg text-sm">
                  {confirmationResult ? 'Verify OTP' : 'Send OTP'}
                </button>
                <div id="recaptcha-container"></div>
              </form>

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