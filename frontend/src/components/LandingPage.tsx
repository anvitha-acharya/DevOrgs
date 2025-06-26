interface SignupResponse {
  message: string;
}

import type React from 'react';
import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import type { User, UserRole } from '../types';
import { Moon, Sun, Users, Target, CheckCircle } from 'lucide-react';
import axios from 'axios';

export function LandingPage() {
  const { state, dispatch } = useApp();
  const [isLogin, setIsLogin] = useState(true);
  const [inviteCode, setInviteCode] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student' as UserRole,
  });

  // Check for invite code in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const invite = urlParams.get('invite');
    if (invite) {
      setInviteCode(invite);
      setIsLogin(false); // Switch to signup mode for invites
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    e.preventDefault();

    if (!isLogin) {
      const passwordValid = /^(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(formData.password);
      if (!passwordValid) {
        alert('Password must be at least 8 characters and contain a special character.');
        return;
      }

      try {
        const res = await axios.post<SignupResponse>(`${API_BASE_URL}/api/auth/signup`, formData);
        alert(res.data.message);
      } catch (err: any) {
        if (err.response && err.response.data && err.response.data.error) {
          alert(err.response.data.error);
        } else {
          alert('Signup failed');
        }
      }
      return;
    }

    // Login logic
    const user: User = {
      id: Date.now().toString(),
      name: formData.name || formData.email.split('@')[0],
      email: formData.email,
      role: formData.role,
    };

    dispatch({ type: 'LOGIN', payload: user });
  };

  const toggleDarkMode = () => {
    dispatch({ type: 'TOGGLE_DARK_MODE' });
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      state.darkMode ? 'dark bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Header */}
      <header className="flex justify-between items-center p-6">
        <div className="flex items-center space-x-2">
          <Target className={`h-8 w-8 ${state.darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
          <h1 className={`text-2xl font-bold ${
            state.darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            DevOrgs
          </h1>
        </div>
        <button
          onClick={toggleDarkMode}
          className={`p-2 rounded-lg transition-colors duration-200 ${
            state.darkMode
              ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700'
              : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
        >
          {state.darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Hero Section */}
          <div>
            <h2 className={`text-5xl font-bold mb-6 ${
              state.darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Organize Development{' '}
              <span className={state.darkMode ? 'text-blue-400' : 'text-blue-600'}>
                Teams
              </span>
            </h2>
            <p className={`text-xl mb-8 ${
              state.darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              A comprehensive platform for guides and students to collaborate,
              track progress, and manage projects seamlessly.
            </p>

            {/* Features */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center space-x-3">
                <CheckCircle className={`h-6 w-6 ${
                  state.darkMode ? 'text-green-400' : 'text-green-500'
                }`} />
                <span className={state.darkMode ? 'text-gray-300' : 'text-gray-700'}>
                  Role-based access for Guides and students
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className={`h-6 w-6 ${
                  state.darkMode ? 'text-green-400' : 'text-green-500'
                }`} />
                <span className={state.darkMode ? 'text-gray-300' : 'text-gray-700'}>
                  Kanban boards for task management
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className={`h-6 w-6 ${
                  state.darkMode ? 'text-green-400' : 'text-green-500'
                }`} />
                <span className={state.darkMode ? 'text-gray-300' : 'text-gray-700'}>
                  Real-time project tracking
                </span>
              </div>
            </div>
          </div>

          {/* Auth Form */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 transition-colors duration-300">
            <div className="text-center mb-6">
              <Users className={`h-12 w-12 mx-auto mb-4 ${
                state.darkMode ? 'text-blue-400' : 'text-blue-600'
              }`} />
              <h3 className={`text-2xl font-bold ${
                state.darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {isLogin ? 'Welcome Back' : 'Get Started'}
              </h3>
              <p className={state.darkMode ? 'text-gray-400' : 'text-gray-600'}>
                {isLogin ? 'Sign in to your account' : 'Create your account'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    state.darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                      state.darkMode
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    placeholder="Enter your full name"
                    required={!isLogin}
                  />
                </div>
              )}

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  state.darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                    state.darkMode
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  state.darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Password
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                    state.darkMode
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="Enter your password"
                  required
                />
              </div>

              {!isLogin && (
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    state.darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Role
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                      state.darkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    disabled={!!inviteCode}
                  >
                    <option value="student">Student</option>
                    <option value="guide">Guide</option>
                  </select>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
              >
                {isLogin ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            <div className="text-center mt-6">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className={`text-sm hover:underline ${
                  state.darkMode ? 'text-blue-400' : 'text-blue-600'
                }`}
              >
                {isLogin
                  ? "Don't have an account? Sign up"
                  : "Already have an account? Sign in"
                }
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}