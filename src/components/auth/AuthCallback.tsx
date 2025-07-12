import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader } from 'lucide-react';
import { authService } from '../../lib/auth';

interface AuthCallbackProps {
  onLogin: (user: any) => void;
}

const AuthCallback: React.FC<AuthCallbackProps> = ({ onLogin }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the current user after OAuth callback
        const user = await authService.getCurrentUser();
        
        if (user) {
          onLogin(user);
          navigate('/dashboard');
        } else {
          // If no user found, redirect to login
          navigate('/auth');
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        navigate('/auth');
      }
    };

    handleAuthCallback();
  }, [navigate, onLogin]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200">
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Loader className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
        <h2 className="text-xl font-semibold text-blue-900 mb-2">Signing you in...</h2>
        <p className="text-blue-600">Please wait while we complete your authentication.</p>
      </div>
    </div>
  );
};

export default AuthCallback;