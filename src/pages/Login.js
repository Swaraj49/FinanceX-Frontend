import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsScanning(true);
    
    // Simulate biometric scan
    setTimeout(async () => {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error || 'Access Denied');
        setIsScanning(false);
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center pt-20 pb-12 px-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-black to-purple-900/20"></div>
        
        {/* Matrix-like grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:30px_30px] animate-pulse"></div>
        
        {/* Floating particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-cyan-400 rounded-full animate-ping"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-purple-400 rounded-full animate-ping delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-pink-400 rounded-full animate-ping delay-500"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Terminal-style container */}
        <div className="bg-gray-900/80 backdrop-blur-xl border border-cyan-500/30 rounded-2xl overflow-hidden shadow-2xl">
          {/* Terminal header */}
          <div className="bg-gray-800/50 px-6 py-3 border-b border-cyan-500/20">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="ml-4 text-cyan-400 text-sm font-mono">SECURE_LOGIN_v2.1</span>
            </div>
          </div>

          <div className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="relative mb-6">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold">🔐</span>
                </div>
                <div className="absolute -inset-2 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full blur opacity-20 animate-pulse"></div>
              </div>
              <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                ACCESS PORTAL
              </h2>
              <p className="text-gray-400 text-sm font-mono">Initialize biometric authentication</p>
            </div>
            
            {error && (
              <div className="mb-6 bg-red-900/30 border border-red-500/50 rounded-lg p-4">
                <div className="flex items-center">
                  <span className="text-red-400 mr-2">⚠</span>
                  <p className="text-red-300 text-sm font-mono">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-cyan-400 text-sm font-mono mb-2">
                  EMAIL_ADDRESS
                </label>
                <div className="relative">
                  <input
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all duration-300 font-mono"
                    placeholder="user@domain.com"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-cyan-400 text-sm font-mono mb-2">
                  SECURITY_KEY
                </label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all duration-300 font-mono"
                    placeholder="••••••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-cyan-400 transition-colors duration-200"
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading || isScanning}
                  className="group relative w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-bold py-4 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                >
                  {isScanning ? (
                    <div className="flex items-center justify-center space-x-3">
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span className="font-mono">SCANNING BIOMETRICS...</span>
                    </div>
                  ) : loading ? (
                    <div className="flex items-center justify-center space-x-3">
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span className="font-mono">AUTHENTICATING...</span>
                    </div>
                  ) : (
                    <span className="font-mono">INITIATE ACCESS</span>
                  )}
                  
                  {/* Scanning line effect */}
                  {isScanning && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 animate-pulse"></div>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-400 text-sm font-mono">
                NEW_USER_DETECTED?{' '}
                <Link 
                  to="/register" 
                  className="text-cyan-400 hover:text-cyan-300 transition-colors duration-200 underline"
                >
                  REGISTER_NOW
                </Link>
              </p>
            </div>

            {/* Status indicators */}
            <div className="mt-6 flex justify-center space-x-4 text-xs font-mono">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400">SECURE</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                <span className="text-cyan-400">ENCRYPTED</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                <span className="text-purple-400">QUANTUM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Additional security notice */}
        <div className="mt-6 text-center">
          <p className="text-gray-500 text-xs font-mono">
            PROTECTED BY QUANTUM ENCRYPTION • BIOMETRIC VERIFICATION ACTIVE
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;