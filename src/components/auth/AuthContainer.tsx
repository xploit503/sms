import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import Login from './Login';
import Register from './Register';
import ForgotPassword from './ForgotPassword';

interface AuthContainerProps {
  onLogin: (userData: any) => void;
}

const AuthContainer: React.FC<AuthContainerProps> = ({ onLogin }) => {
  const [currentView, setCurrentView] = useState<'login' | 'register' | 'forgot'>('login');
  const [isAnimating, setIsAnimating] = useState(false);

  const switchView = (view: 'login' | 'register' | 'forgot') => {
    if (view === currentView) return;
    
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentView(view);
      setIsAnimating(false);
    }, 300);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 p-4">
      <div className="w-full max-w-md">
        {/* Single Card Container */}
        <div className="bg-white rounded-2xl shadow-2xl border border-blue-200 overflow-hidden">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-center">
            <div className="flex items-center justify-center mb-4">
              <MessageSquare className="w-8 h-8 mr-3 text-white" />
              <span className="text-2xl font-bold text-white">SMS-System</span>
            </div>
            <p className="text-blue-100 text-sm">
              {currentView === 'login' && 'Welcome back! Sign in to continue'}
              {currentView === 'register' && 'Join thousands of businesses today'}
              {currentView === 'forgot' && 'Reset your password securely'}
            </p>
          </div>

          {/* Form Container */}
          <div className="p-6 sm:p-8">
            <div className={`transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
              {currentView === 'login' && (
                <Login 
                  onLogin={onLogin} 
                  onSwitchToRegister={() => switchView('register')}
                  onSwitchToForgot={() => switchView('forgot')}
                />
              )}
              {currentView === 'register' && (
                <Register 
                  onLogin={onLogin} 
                  onSwitchToLogin={() => switchView('login')}
                />
              )}
              {currentView === 'forgot' && (
                <ForgotPassword 
                  onSwitchToLogin={() => switchView('login')}
                />
              )}
            </div>
          </div>

          {/* Footer Navigation */}
          <div className="bg-blue-50 px-6 py-4 border-t border-blue-100">
            <div className="text-center text-sm">
              {currentView === 'login' && (
                <p className="text-blue-600">
                  Don't have an account?{' '}
                  <button 
                    onClick={() => switchView('register')}
                    className="font-semibold text-blue-700 hover:text-blue-800 transition-colors"
                  >
                    Sign up
                  </button>
                </p>
              )}
              {currentView === 'register' && (
                <p className="text-blue-600">
                  Already have an account?{' '}
                  <button 
                    onClick={() => switchView('login')}
                    className="font-semibold text-blue-700 hover:text-blue-800 transition-colors"
                  >
                    Sign in
                  </button>
                </p>
              )}
              {currentView === 'forgot' && (
                <p className="text-blue-600">
                  Remember your password?{' '}
                  <button 
                    onClick={() => switchView('login')}
                    className="font-semibold text-blue-700 hover:text-blue-800 transition-colors"
                  >
                    Sign in
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthContainer;