import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Mail, Lock, User, Eye, EyeOff, Building } from 'lucide-react';

interface RegisterProps {
  onLogin: (userData: any) => void;
}

const GoogleIcon: React.FC = () => (
  <svg className="w-5 h-5 mr-2" viewBox="0 0 533.5 544.3" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
    <path fill="#4285F4" d="M533.5 278.4c0-18.5-1.5-36.3-4.3-53.6H272v101.4h146.9c-6.3 34-25.4 62.8-54.3 82v68h87.7c51.3-47.3 80.2-116.7 80.2-197.8z"/>
    <path fill="#34A853" d="M272 544.3c73.7 0 135.6-24.4 180.8-66.1l-87.7-68c-24.4 16.3-55.7 26-93.1 26-71.5 0-132-48.3-153.6-113.1H29.6v70.9C74.6 485.7 167.6 544.3 272 544.3z"/>
    <path fill="#FBBC05" d="M118.4 321.1c-5.4-16.3-8.5-33.7-8.5-51.6s3.1-35.3 8.5-51.6v-70.9H29.6c-18.9 37.7-29.6 80-29.6 122.5s10.7 84.8 29.6 122.5l88.8-70.9z"/>
    <path fill="#EA4335" d="M272 107.7c39.9 0 75.7 13.7 103.9 40.7l77.9-77.9C405.7 24.4 343.8 0 272 0 167.6 0 74.6 58.6 29.6 146.2l88.8 70.9c21.6-64.8 82.1-113.1 153.6-113.1z"/>
  </svg>
);

const Register: React.FC<RegisterProps> = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }
    setTimeout(() => {
      const userData = {
        id: 1,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        company: formData.company,
        balance: 0,
        joinDate: new Date().toISOString()
      };
      onLogin(userData);
      setIsLoading(false);
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleGoogleSignIn = () => {
    alert('Google sign-in clicked');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f6f8fa] overflow-y-auto">
      <div className="w-[92vw] max-w-full md:max-w-5xl h-auto md:h-[650px] bg-white rounded-lg shadow-lg border border-gray-200 flex flex-col md:flex-row overflow-hidden my-6 md:my-0 mx-auto">
        {/* Left Panel */}
        <div className="w-full md:w-1/2 bg-[#2563eb] flex flex-col justify-center items-center p-6 md:p-10 text-white">
          <div className="flex items-center mb-8">
            <MessageSquare className="w-8 h-8 mr-2 text-white" />
            <span className="text-2xl font-bold">SMS-System</span>
          </div>
          <h2 className="text-lg md:text-xl font-semibold mb-2">Already Signed up?</h2>
          <p className="mb-6 text-white/80 text-center max-w-xs text-sm md:text-base">Log in to your account so you can continue building and editing your onboarding flows.</p>
          <Link to="/login">
            <button className="px-6 md:px-8 py-2 bg-white text-[#2563eb] font-semibold rounded border border-white hover:bg-blue-50 hover:text-[#2563eb] transition text-sm md:text-base">LOG IN</button>
          </Link>
        </div>
        {/* Right Panel */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-6 md:p-10">
          <div className="w-full max-w-sm">
            <h2 className="text-xl md:text-2xl font-bold text-[#22223b] mb-2">Sign Up for an Account</h2>
            <p className="mb-6 text-gray-500 text-xs md:text-sm">Let's get you all set up so you can start creating your first onboarding experience.</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded text-sm">{error}</div>
              )}
              <div className="flex gap-2">
                <div className="w-1/2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full pl-10 pr-2 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-colors"
                      placeholder="Your first name"
                      required
                    />
                  </div>
                </div>
                <div className="w-1/2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full pl-10 pr-2 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-colors"
                      placeholder="Your last name"
                      required
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-2 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-colors"
                    placeholder="Enter your email address"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-colors"
                    placeholder="Enter a strong password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-colors"
                    placeholder="Confirm your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <div className="flex items-center mb-2">
                <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2" required />
                <span className="text-sm text-gray-600">I accept BoardMe's <a href="#" className="text-blue-600 hover:underline">Terms & Conditions</a></span>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#2563eb] text-white py-2 rounded font-semibold hover:bg-blue-700 transition disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
                ) : (
                  'SIGN UP'
                )}
              </button>
            </form>
            <div className="my-4 flex items-center">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="mx-2 text-gray-400 text-xs">Or sign up using</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>
            <button
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center border border-gray-300 rounded py-2 hover:bg-gray-50 transition-colors mb-2"
              aria-label="Sign up with Google"
            >
              <GoogleIcon />
              <span className="text-gray-700 font-medium">Google</span>
            </button>
            <div className="mt-4 text-center">
              <span className="text-sm text-gray-500">Already have an account? </span>
              <Link to="/login" className="text-blue-600 hover:underline font-medium">Log in</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
