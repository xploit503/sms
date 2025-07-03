import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, MessageSquare } from 'lucide-react';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    // Simulate API call
    setTimeout(() => {
      setSubmitted(true);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f6f8fa]">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 md:p-10 flex flex-col items-center">
        <div className="flex items-center mb-6">
          <MessageSquare className="w-8 h-8 mr-2 text-blue-600" />
          <span className="text-2xl font-bold text-blue-700">SMS-System</span>
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-[#22223b] mb-2">Forgot Password</h2>
        <p className="mb-6 text-gray-500 text-sm text-center">Enter your email address and we'll send you a link to reset your password.</p>
        {submitted ? (
          <div className="bg-green-100 border border-green-300 text-green-700 px-4 py-2 rounded text-sm text-center mb-4">
            If an account with that email exists, a password reset link has been sent.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="w-full space-y-4">
            {error && (
              <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded text-sm">{error}</div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-2 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-colors"
                  placeholder="Enter your email address"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-[#2563eb] text-white py-2 rounded font-semibold hover:bg-blue-700 transition"
            >
              Send Reset Link
            </button>
          </form>
        )}
        <div className="mt-6 text-center w-full">
          <Link to="/login" className="text-blue-600 hover:underline font-medium text-sm">Back to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword; 