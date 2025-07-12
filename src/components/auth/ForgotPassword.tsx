import React, { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle, Loader } from 'lucide-react';
import { authService } from '../../lib/auth';

interface ForgotPasswordProps {
  onSwitchToLogin: () => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onSwitchToLogin }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setIsLoading(true);
    
    const { error } = await authService.resetPassword(email);
    
    if (error) {
      setError(error);
    } else {
      setIsSubmitted(true);
    }
    
    setIsLoading(false);
  };

  if (isSubmitted) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-blue-600" />
        </div>
        
        <h2 className="text-2xl font-bold text-blue-900 mb-4">Check Your Email</h2>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-blue-800 text-sm leading-relaxed">
            We've sent a password reset link to{' '}
            <span className="font-semibold">{email}</span>
          </p>
        </div>
        
        <div className="space-y-4 text-sm text-blue-600">
          <p>Didn't receive the email? Check your spam folder or try again.</p>
          <p>The reset link will expire in 24 hours for security.</p>
        </div>
        
        <button
          onClick={onSwitchToLogin}
          className="w-full mt-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Sign In</span>
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-blue-900 mb-2">Reset Password</h2>
        <p className="text-blue-600 text-sm">
          Enter your email address and we'll send you a secure link to reset your password.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}
        
        <div>
          <label className="block text-sm font-medium text-blue-900 mb-2">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400 w-5 h-5" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-blue-50/30"
              placeholder="Enter your email address"
              required
            />
          </div>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Security Notice</p>
              <p>For your security, the reset link will expire in 24 hours and can only be used once.</p>
            </div>
          </div>
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg"
        >
          {isLoading ? (
            <Loader className="w-5 h-5 animate-spin" />
          ) : (
            'Send Reset Link'
          )}
        </button>
        
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="w-full text-blue-600 hover:text-blue-800 font-medium transition-colors flex items-center justify-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Sign In</span>
        </button>
      </form>
    </>
  );
};

export default ForgotPassword;