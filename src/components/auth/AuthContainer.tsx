import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import Login from './Login';
import Register from './Register';

interface AuthContainerProps {
  onLogin: (userData: any) => void;
}

const AuthContainer: React.FC<AuthContainerProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  const switchMode = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsLogin(!isLogin);
      setIsAnimating(false);
    }, 300);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
      <div className="w-[92vw] max-w-full md:max-w-6xl h-auto md:h-[650px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col md:flex-row overflow-hidden my-6 md:my-0 mx-auto relative">
        
        {/* Animated Background Panel */}
        <div className={`absolute inset-0 w-full md:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 transition-transform duration-500 ease-in-out z-10 ${
          isLogin ? 'translate-x-0 md:translate-x-full' : 'translate-x-0'
        }`}>
          <div className="h-full flex flex-col justify-center items-center p-6 md:p-10 text-white relative">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10 text-center">
              <div className="flex items-center justify-center mb-8">
                <MessageSquare className="w-10 h-10 mr-3 text-white" />
                <span className="text-3xl font-bold">SMS-System</span>
              </div>
              
              <div className={`transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
                {isLogin ? (
                  <>
                    <h2 className="text-xl md:text-2xl font-semibold mb-4">New to SMS-System?</h2>
                    <p className="mb-8 text-white/90 text-center max-w-sm text-sm md:text-base leading-relaxed">
                      Join thousands of businesses using our platform to reach their customers effectively through SMS marketing.
                    </p>
                    <button 
                      onClick={switchMode}
                      className="px-8 py-3 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/30 hover:bg-white/30 transition-all duration-200 transform hover:scale-105"
                    >
                      Create Account
                    </button>
                  </>
                ) : (
                  <>
                    <h2 className="text-xl md:text-2xl font-semibold mb-4">Already have an account?</h2>
                    <p className="mb-8 text-white/90 text-center max-w-sm text-sm md:text-base leading-relaxed">
                      Welcome back! Sign in to continue managing your SMS campaigns and growing your business.
                    </p>
                    <button 
                      onClick={switchMode}
                      className="px-8 py-3 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/30 hover:bg-white/30 transition-all duration-200 transform hover:scale-105"
                    >
                      Sign In
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Login Form */}
        <div className={`w-full md:w-1/2 flex flex-col justify-center items-center p-6 md:p-10 transition-transform duration-500 ease-in-out ${
          isLogin ? 'translate-x-0 md:translate-x-0' : 'translate-x-0 md:-translate-x-full'
        } ${isLogin ? 'z-20' : 'z-0'}`}>
          <div className={`w-full max-w-sm transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
            <Login onLogin={onLogin} />
          </div>
        </div>

        {/* Register Form */}
        <div className={`w-full md:w-1/2 flex flex-col justify-center items-center p-6 md:p-10 transition-transform duration-500 ease-in-out ${
          isLogin ? 'translate-x-0 md:translate-x-full' : 'translate-x-0 md:translate-x-0'
        } ${!isLogin ? 'z-20' : 'z-0'}`}>
          <div className={`w-full max-w-sm transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
            <Register onLogin={onLogin} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthContainer;