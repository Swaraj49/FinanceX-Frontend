import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const features = [
    {
      icon: '🎯',
      title: 'Neural Tracking',
      description: 'AI-powered expense categorization that learns from your spending patterns',
      color: 'from-cyan-400 to-blue-500'
    },
    {
      icon: '🧠',
      title: 'Quantum Analytics',
      description: 'Multi-dimensional financial insights with predictive modeling',
      color: 'from-purple-400 to-pink-500'
    },
    {
      icon: '🔐',
      title: 'Vault Security',
      description: 'Military-grade encryption with biometric access controls',
      color: 'from-green-400 to-emerald-500'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-cyan-900/20"></div>
        
        {/* Floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-cyan-400/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      {/* Mouse follower */}
      <div 
        className="fixed w-96 h-96 bg-gradient-to-r from-cyan-500/5 to-purple-500/5 rounded-full blur-3xl pointer-events-none transition-all duration-1000 ease-out"
        style={{
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
        }}
      ></div>

      <div className="relative z-10 pt-32">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            {/* Glitch effect title */}
            <div className="relative mb-8">
              <h1 className="text-6xl sm:text-8xl font-black mb-4 relative">
                <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-pulse">
                  FINANCE
                </span>
                <br />
                <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
                  EVOLVED
                </span>
              </h1>
              
              {/* Glitch lines */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-1/4 left-0 right-0 h-0.5 bg-cyan-400 animate-pulse"></div>
                <div className="absolute bottom-1/4 left-0 right-0 h-0.5 bg-purple-500 animate-pulse delay-500"></div>
              </div>
            </div>

            <p className="text-xl sm:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
              Step into the future of financial management. Where AI meets intuition, 
              and your money flows through dimensions of possibility.
            </p>
            
            {!isAuthenticated && (
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20">
                <Link
                  to="/register"
                  className="group relative px-12 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full text-lg font-bold overflow-hidden transition-all duration-300 hover:scale-105"
                >
                  <span className="relative z-10">Enter the Matrix</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full blur opacity-30 group-hover:opacity-60 transition-opacity duration-300"></div>
                </Link>
                <Link
                  to="/login"
                  className="px-12 py-4 border-2 border-gray-600 hover:border-cyan-400 rounded-full text-lg font-bold transition-all duration-300 hover:bg-cyan-400/10 hover:text-cyan-400"
                >
                  Access Portal
                </Link>
              </div>
            )}

            {isAuthenticated && (
              <div className="mb-20">
                <Link
                  to="/dashboard"
                  className="group relative px-12 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full text-lg font-bold overflow-hidden transition-all duration-300 hover:scale-105"
                >
                  <span className="relative z-10">Launch Control</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                Beyond Traditional Finance
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Harness the power of next-generation financial intelligence
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group relative">
                <div className="relative bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-3xl p-8 hover:border-gray-600 transition-all duration-500 hover:scale-105">
                  {/* Glow effect */}
                  <div className={`absolute -inset-0.5 bg-gradient-to-r ${feature.color} rounded-3xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-500`}></div>
                  
                  <div className="relative z-10">
                    <div className="text-6xl mb-6 text-center">{feature.icon}</div>
                    <h3 className="text-2xl font-bold mb-4 text-center bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 text-center leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="relative py-20">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/20 to-purple-900/20"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-12 text-center">
              <div className="group">
                <div className="text-6xl font-black mb-4 bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                  ∞
                </div>
                <div className="text-gray-400 text-lg">Infinite Possibilities</div>
              </div>
              <div className="group">
                <div className="text-6xl font-black mb-4 bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                  0.1s
                </div>
                <div className="text-gray-400 text-lg">Lightning Speed</div>
              </div>
              <div className="group">
                <div className="text-6xl font-black mb-4 bg-gradient-to-r from-pink-400 to-pink-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                  256
                </div>
                <div className="text-gray-400 text-lg">Bit Encryption</div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        {!isAuthenticated && (
          <div className="relative py-20">
            <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
              <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                Ready to Transcend?
              </h2>
              <p className="text-xl text-gray-400 mb-12">
                Join the financial revolution. Your future self is waiting.
              </p>
              <Link
                to="/register"
                className="group relative inline-block px-16 py-6 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full text-xl font-bold overflow-hidden transition-all duration-300 hover:scale-105"
              >
                <span className="relative z-10">Initialize Sequence</span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full blur opacity-30 group-hover:opacity-60 transition-opacity duration-300"></div>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;