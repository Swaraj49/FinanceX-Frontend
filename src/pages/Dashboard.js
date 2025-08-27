import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useExpense } from '../context/ExpenseContext';

const Dashboard = () => {
  const { user } = useAuth();
  const { expenses, accounts, analytics, fetchExpenses, fetchAccounts, fetchAnalytics } = useExpense();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    fetchExpenses({ limit: 5 });
    fetchAccounts();
    fetchAnalytics();

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
  const recentExpenses = expenses.slice(0, 5);

  const MetricPanel = ({ title, value, status, icon, trend }) => (
    <div className="bg-gray-900/50 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-4 sm:p-6 hover:border-cyan-400/40 transition-all duration-300 group">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="text-cyan-400 text-xl sm:text-2xl">{icon}</div>
        <div className={`px-2 py-1 rounded-full text-xs font-mono ${
          status === 'optimal' ? 'bg-green-500/20 text-green-400' :
          status === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
          'bg-red-500/20 text-red-400'
        }`}>
          {status?.toUpperCase()}
        </div>
      </div>
      <div className="mb-2">
        <h3 className="text-gray-400 text-xs sm:text-sm font-mono mb-1">{title}</h3>
        <p className="text-xl sm:text-2xl font-bold text-white group-hover:text-cyan-400 transition-colors duration-300">
          {value}
        </p>
      </div>
      {trend && (
        <p className="text-xs text-gray-500 font-mono">{trend}</p>
      )}
    </div>
  );

  const CommandButton = ({ title, description, icon, to, color = 'cyan' }) => (
    <Link
      to={to}
      className={`group block p-4 bg-gray-900/30 backdrop-blur-xl border border-${color}-500/20 rounded-xl hover:border-${color}-400/60 hover:bg-gray-800/50 transition-all duration-300`}
    >
      <div className="flex items-center space-x-3">
        <div className={`text-2xl text-${color}-400 group-hover:scale-110 transition-transform duration-200`}>
          {icon}
        </div>
        <div>
          <h3 className={`font-bold text-white group-hover:text-${color}-400 transition-colors duration-200`}>
            {title}
          </h3>
          <p className="text-gray-400 text-sm font-mono">{description}</p>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="min-h-screen bg-black text-white pt-16 sm:pt-20 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/10 via-black to-purple-900/10"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        
        {/* Floating elements */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 sm:w-64 sm:h-64 bg-gradient-to-r from-cyan-400/5 to-purple-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 sm:w-96 sm:h-96 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 px-4 sm:px-6">
        {/* Command Center Header */}
        <div className="mb-6 sm:mb-8">
          <div className="bg-gray-900/80 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="relative">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-lg sm:text-2xl font-bold">{user?.name?.charAt(0)?.toUpperCase()}</span>
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full blur opacity-30 animate-pulse"></div>
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                    COMMAND CENTER
                  </h1>
                  <p className="text-gray-400 font-mono text-sm sm:text-base">Welcome back, Agent {user?.name}</p>
                </div>
              </div>
              <div className="text-left sm:text-right">
                <div className="text-cyan-400 font-mono text-base sm:text-lg">
                  {currentTime.toLocaleTimeString()}
                </div>
                <div className="text-gray-400 font-mono text-xs sm:text-sm">
                  {currentTime.toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* System Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <MetricPanel
            title="TOTAL_BALANCE"
            value={`$${totalBalance.toFixed(2)}`}
            status={totalBalance >= 0 ? 'optimal' : 'critical'}
            icon="💰"
            trend={`${accounts.length} accounts active`}
          />
          <MetricPanel
            title="MONTHLY_BURN"
            value={`$${analytics?.totalSpent?.toFixed(2) || '0.00'}`}
            status={analytics?.totalSpent > 1000 ? 'warning' : 'optimal'}
            icon="🔥"
            trend="current cycle"
          />
          <MetricPanel
            title="VAULT_COUNT"
            value={accounts.length}
            status={accounts.length > 0 ? 'optimal' : 'warning'}
            icon="🔐"
            trend="secure vaults"
          />
          <MetricPanel
            title="TRANSACTIONS"
            value={expenses.length}
            status="optimal"
            icon="⚡"
            trend="total logged"
          />
        </div>

        {/* Main Interface Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-6 sm:mb-8">
          {/* Activity Feed */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900/50 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-cyan-400 font-mono">RECENT_ACTIVITY</h3>
                <Link 
                  to="/expenses" 
                  className="text-purple-400 hover:text-purple-300 font-mono text-sm transition-colors duration-200"
                >
                  VIEW_ALL →
                </Link>
              </div>
              
              {recentExpenses.length > 0 ? (
                <div className="space-y-3">
                  {recentExpenses.map((expense, index) => (
                    <div key={expense._id} className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl border border-gray-700/50 hover:border-cyan-500/30 transition-all duration-300">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                          <span className="text-red-400">📊</span>
                        </div>
                        <div>
                          <p className="font-mono text-white">{expense.description}</p>
                          <p className="text-xs text-gray-400 font-mono">
                            {expense.category?.toUpperCase()} • {expense.account?.name}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-red-400 font-mono">-${expense.amount.toFixed(2)}</p>
                        <p className="text-xs text-gray-500 font-mono">
                          {new Date(expense.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🎯</div>
                  <p className="text-gray-400 font-mono mb-4">NO_ACTIVITY_DETECTED</p>
                  <Link
                    to="/expenses"
                    className="inline-block px-6 py-3 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-lg font-mono hover:from-cyan-500 hover:to-purple-500 transition-all duration-300"
                  >
                    INITIALIZE_TRACKING
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Control Panel */}
          <div className="space-y-6">
            {/* Quick Commands */}
            <div className="bg-gray-900/50 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-cyan-400 font-mono mb-6">QUICK_COMMANDS</h3>
              <div className="space-y-3">
                <CommandButton
                  title="TRACK"
                  description="Log new expense"
                  to="/expenses"
                  icon="🎯"
                  color="cyan"
                />
                <CommandButton
                  title="VAULT"
                  description="Manage accounts"
                  to="/accounts"
                  icon="🔐"
                  color="green"
                />
                <CommandButton
                  title="ANALYZE"
                  description="View insights"
                  to="/analytics"
                  icon="🧠"
                  color="purple"
                />
              </div>
            </div>

            {/* Vault Status */}
            <div className="bg-gray-900/50 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-cyan-400 font-mono mb-6">VAULT_STATUS</h3>
              {accounts.length > 0 ? (
                <div className="space-y-3">
                  {accounts.slice(0, 3).map((account) => (
                    <div key={account._id} className="flex justify-between items-center p-3 bg-gray-800/30 rounded-lg border border-gray-700/50">
                      <div>
                        <p className="font-mono text-white text-sm">{account.name}</p>
                        <p className="text-xs text-gray-400 font-mono uppercase">{account.type}</p>
                      </div>
                      <p className={`font-mono font-bold ${account.balance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        ${account.balance.toFixed(2)}
                      </p>
                    </div>
                  ))}
                  {accounts.length > 3 && (
                    <Link
                      to="/accounts"
                      className="block text-center text-purple-400 hover:text-purple-300 text-sm font-mono mt-3 transition-colors duration-200"
                    >
                      VIEW_ALL_{accounts.length}_VAULTS
                    </Link>
                  )}
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="text-4xl mb-3">🔒</div>
                  <p className="text-gray-400 font-mono text-sm mb-3">NO_VAULTS_DETECTED</p>
                  <Link
                    to="/accounts"
                    className="text-cyan-400 hover:text-cyan-300 font-mono text-sm transition-colors duration-200"
                  >
                    CREATE_VAULT
                  </Link>
                </div>
              )}
            </div>

            {/* System Status */}
            <div className="bg-gray-900/50 backdrop-blur-xl border border-green-500/20 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-green-400 font-mono mb-4">SYSTEM_STATUS</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 font-mono text-sm">ENCRYPTION</span>
                  <span className="text-green-400 font-mono text-sm">ACTIVE</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 font-mono text-sm">SYNC</span>
                  <span className="text-green-400 font-mono text-sm">ONLINE</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 font-mono text-sm">BACKUP</span>
                  <span className="text-green-400 font-mono text-sm">SECURE</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;