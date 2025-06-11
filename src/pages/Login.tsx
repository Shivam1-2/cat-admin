import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('password');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const success = await login(email, password);
      if (!success) {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('An error occurred during login');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const demoAccounts = [
    { email: 'admin@example.com', role: 'Master Admin', description: 'Full system access', color: 'bg-blue-100 text-blue-800' },
    { email: 'sarah@client.com', role: 'Client Admin', description: 'Client organization management', color: 'bg-purple-100 text-purple-800' },
    { email: 'mike@supplier.com', role: 'Supplier Admin', description: 'Supplier catalog management', color: 'bg-teal-100 text-teal-800' },
    { email: 'jessica@client.com', role: 'Buyer', description: 'Browse catalogs and place orders', color: 'bg-emerald-100 text-emerald-800' },
    { email: 'emma@client.com', role: 'Requestor', description: 'Browse catalogs and submit requests', color: 'bg-orange-100 text-orange-800' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Catalogue Admin Dashboard
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to access your dashboard
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          {error && (
            <div className="text-danger-600 text-sm text-center font-medium">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
                isLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
          
          <div className="text-sm">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Demo Accounts</h3>
              <div className="space-y-3">
                {demoAccounts.map((account, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-white rounded-md border border-gray-200">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-xs font-medium text-gray-700">{account.email}</p>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${account.color}`}>
                          {account.role}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">{account.description}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEmail(account.email)}
                      className="ml-3 text-xs text-primary-600 hover:text-primary-900 font-medium px-2 py-1 rounded hover:bg-primary-50"
                    >
                      Use
                    </button>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-3 text-center">
                Password: <span className="font-mono bg-gray-100 px-1 rounded">password</span>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;