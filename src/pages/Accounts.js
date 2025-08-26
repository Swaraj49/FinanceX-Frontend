import React, { useState, useEffect } from 'react';
import { useExpense } from '../context/ExpenseContext';

const Accounts = () => {
  const { accounts, loading, error, fetchAccounts, addAccount, updateAccount, deleteAccount } = useExpense();
  const [showForm, setShowForm] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'checking',
    balance: '',
    currency: 'USD'
  });
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    fetchAccounts();
  }, []);

  const accountTypes = [
    { value: 'checking', label: 'Checking', icon: '🏦', color: 'bg-blue-100 text-blue-600' },
    { value: 'savings', label: 'Savings', icon: '💰', color: 'bg-green-100 text-green-600' },
    { value: 'credit', label: 'Credit Card', icon: '💳', color: 'bg-red-100 text-red-600' },
    { value: 'cash', label: 'Cash', icon: '💵', color: 'bg-yellow-100 text-yellow-600' }
  ];

  const getAccountTypeInfo = (type) => {
    return accountTypes.find(t => t.value === type) || accountTypes[0];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    
    const accountData = {
      ...formData,
      balance: parseFloat(formData.balance) || 0
    };

    let result;
    if (editingAccount) {
      result = await updateAccount(editingAccount._id, accountData);
    } else {
      result = await addAccount(accountData);
    }
    
    if (result.success) {
      setFormData({
        name: '',
        type: 'checking',
        balance: '',
        currency: 'USD'
      });
      setShowForm(false);
      setEditingAccount(null);
      setSubmitError('');
    } else {
      setSubmitError(result.error || 'Failed to save vault');
    }
  };

  const handleEdit = (account) => {
    setEditingAccount(account);
    setFormData({
      name: account.name,
      type: account.type,
      balance: account.balance.toString(),
      currency: account.currency
    });
    setShowForm(true);
  };

  const handleDelete = async (account) => {
    if (window.confirm(`Are you sure you want to delete the vault "${account.name}"? This action cannot be undone.`)) {
      const result = await deleteAccount(account._id);
      if (result.success) {
        // Optionally show a success message
      }
    }
  };

  const handleCancelEdit = () => {
    setShowForm(false);
    setEditingAccount(null);
    setSubmitError('');
    setFormData({
      name: '',
      type: 'checking',
      balance: '',
      currency: 'USD'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center pt-20 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/10 via-black to-purple-900/10"></div>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        </div>
        <div className="relative z-10 bg-gray-900/80 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"></div>
          <p className="text-gray-400 mt-4 text-center font-mono">LOADING_VAULTS...</p>
        </div>
      </div>
    );
  }

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);

  return (
    <div className="min-h-screen bg-black text-white pt-20 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/10 via-black to-purple-900/10"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        
        {/* Floating elements */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-cyan-400/5 to-purple-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 px-6">
        <div className="max-w-7xl mx-auto mb-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">VAULT_MANAGEMENT</h1>
            <p className="text-gray-400 font-mono">Manage your financial vaults and track balances</p>
          </div>
          <button
            onClick={() => showForm ? handleCancelEdit() : setShowForm(true)}
            className="mt-4 sm:mt-0 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white px-6 py-3 rounded-xl font-medium font-mono shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center space-x-2"
          >
            {showForm ? (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>CANCEL</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>ADD_VAULT</span>
              </>
            )}
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-900/50 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-6 hover:border-cyan-400/40 transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1 font-mono">TOTAL_BALANCE</p>
                <p className={`text-3xl font-bold ${totalBalance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  ${totalBalance.toFixed(2)}
                </p>
              </div>
              <div className="p-3 bg-green-500/20 rounded-2xl">
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gray-900/50 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-6 hover:border-cyan-400/40 transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1 font-mono">ACTIVE_VAULTS</p>
                <p className="text-3xl font-bold text-blue-400">{accounts.length}</p>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-2xl">
                <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gray-900/50 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-6 hover:border-cyan-400/40 transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1 font-mono">AVERAGE_BALANCE</p>
                <p className="text-3xl font-bold text-purple-400">
                  ${accounts.length > 0 ? (totalBalance / accounts.length).toFixed(2) : '0.00'}
                </p>
              </div>
              <div className="p-3 bg-purple-500/20 rounded-2xl">
                <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Add Account Form */}
        {showForm && (
          <div className="bg-gray-900/80 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-8 mb-8 shadow-2xl">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-cyan-500/20 rounded-lg">
                <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent font-mono">
                {editingAccount ? 'EDIT_VAULT' : 'ADD_NEW_VAULT'}
              </h2>
            </div>
            
            {(error || submitError) && (
              <div className="mb-6 bg-red-900/30 border border-red-500/50 rounded-xl p-4">
                <div className="flex">
                  <svg className="w-5 h-5 text-red-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="ml-3">
                    <p className="text-sm text-red-300 font-mono">{error || submitError}</p>
                  </div>
                </div>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-cyan-400 mb-2 font-mono">
                  VAULT_NAME
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200 font-mono"
                  placeholder="e.g., main.checking.vault"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-cyan-400 mb-2 font-mono">
                  VAULT_TYPE
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200 font-mono"
                >
                  {accountTypes.map(type => (
                    <option key={type.value} value={type.value} className="bg-gray-800 text-white">
                      {type.icon} {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-cyan-400 mb-2 font-mono">
                  INITIAL_BALANCE
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-400">$</span>
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.balance}
                    onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
                    className="w-full pl-8 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200 font-mono"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-cyan-400 mb-2 font-mono">
                  CURRENCY
                </label>
                <input
                  type="text"
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200 font-mono"
                  placeholder="USD"
                />
              </div>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3 rounded-xl font-medium font-mono shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  {editingAccount ? 'UPDATE_VAULT' : 'CREATE_VAULT'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Accounts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accounts.length > 0 ? (
            accounts.map((account) => {
              const typeInfo = getAccountTypeInfo(account.type);
              return (
                <div key={account._id} className="bg-gray-900/50 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-6 hover:border-cyan-400/40 hover:bg-gray-800/50 transition-all duration-300 transform hover:-translate-y-1 group">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 bg-cyan-500/20 rounded-xl">
                        <span className="text-2xl">{typeInfo.icon}</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white font-mono">
                          {account.name}
                        </h3>
                        <p className="text-sm text-gray-400 font-mono">
                          {typeInfo.label.toUpperCase()}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs bg-gray-800/50 text-cyan-400 px-3 py-1 rounded-full font-medium font-mono">
                      {account.currency}
                    </span>
                  </div>
                  
                  <div className="mb-6">
                    <p className="text-sm text-gray-400 mb-1 font-mono">CURRENT_BALANCE</p>
                    <p className={`text-3xl font-bold font-mono ${
                      account.balance >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      ${account.balance.toFixed(2)}
                    </p>
                  </div>
                  
                  <div className="flex justify-between items-center text-xs text-gray-500 pt-4 border-t border-gray-700/50">
                    <span className="font-mono">Created: {new Date(account.createdAt).toLocaleDateString()}</span>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleEdit(account)}
                        className="text-cyan-400 hover:text-cyan-300 font-medium font-mono transition-colors duration-200"
                      >
                        EDIT
                      </button>
                      <button 
                        onClick={() => handleDelete(account)}
                        className="text-red-400 hover:text-red-300 font-medium font-mono transition-colors duration-200"
                      >
                        DELETE
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="md:col-span-2 lg:col-span-3">
              <div className="bg-gray-900/50 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-12 text-center">
                <div className="w-24 h-24 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2 font-mono">NO_VAULTS_DETECTED</h3>
                <p className="text-gray-400 mb-6 font-mono">
                  Create your first vault to start tracking your finances
                </p>
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white px-8 py-3 rounded-xl font-medium font-mono shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  CREATE_FIRST_VAULT
                </button>
              </div>
            </div>
          )}
        </div>
        </div>
      </div>
    </div>
  );
};

export default Accounts;