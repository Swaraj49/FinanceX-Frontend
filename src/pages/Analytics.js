import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement } from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';
import { useExpense } from '../context/ExpenseContext';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement);

const Analytics = () => {
  const { analytics, expenses, fetchAnalytics, fetchExpenses } = useExpense();
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchAnalytics(dateRange);
    fetchExpenses();
  }, [dateRange]);

  const handleDateChange = (e) => {
    setDateRange({
      ...dateRange,
      [e.target.name]: e.target.value
    });
  };

  const categoryInfo = {
    food: { color: '#FF6384', icon: '🍽️', label: 'Food & Dining' },
    transport: { color: '#36A2EB', icon: '🚗', label: 'Transportation' },
    entertainment: { color: '#FFCE56', icon: '🎬', label: 'Entertainment' },
    utilities: { color: '#4BC0C0', icon: '⚡', label: 'Utilities' },
    healthcare: { color: '#9966FF', icon: '🏥', label: 'Healthcare' },
    shopping: { color: '#FF9F40', icon: '🛍️', label: 'Shopping' },
    other: { color: '#C9CBCF', icon: '📝', label: 'Other' }
  };

  const pieData = {
    labels: analytics?.categoryBreakdown?.map(item => 
      categoryInfo[item._id]?.label || item._id.charAt(0).toUpperCase() + item._id.slice(1)
    ) || [],
    datasets: [
      {
        data: analytics?.categoryBreakdown?.map(item => item.total) || [],
        backgroundColor: analytics?.categoryBreakdown?.map(item => 
          categoryInfo[item._id]?.color || '#FF6384'
        ) || [],
        borderWidth: 3,
        borderColor: '#fff',
        hoverBorderWidth: 4,
        hoverOffset: 10
      }
    ]
  };

  const barData = {
    labels: analytics?.categoryBreakdown?.map(item => 
      categoryInfo[item._id]?.label || item._id.charAt(0).toUpperCase() + item._id.slice(1)
    ) || [],
    datasets: [
      {
        label: 'Amount Spent',
        data: analytics?.categoryBreakdown?.map(item => item.total) || [],
        backgroundColor: analytics?.categoryBreakdown?.map(item => 
          categoryInfo[item._id]?.color + '80' || '#FF638480'
        ) || [],
        borderColor: analytics?.categoryBreakdown?.map(item => 
          categoryInfo[item._id]?.color || '#FF6384'
        ) || [],
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      }
    ]
  };

  // Generate trend data for the last 7 days
  const generateTrendData = () => {
    const last7Days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      last7Days.push(date.toISOString().split('T')[0]);
    }

    const dailySpending = last7Days.map(date => {
      const dayExpenses = expenses.filter(expense => 
        expense.date.split('T')[0] === date
      );
      return dayExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    });

    return {
      labels: last7Days.map(date => new Date(date).toLocaleDateString('en-US', { weekday: 'short' })),
      datasets: [
        {
          label: 'Daily Spending',
          data: dailySpending,
          borderColor: '#8B5CF6',
          backgroundColor: '#8B5CF6',
          tension: 0.4,
          fill: false,
          pointBackgroundColor: '#8B5CF6',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8,
        }
      ]
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#374151',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function(context) {
            const value = typeof context.parsed === 'number' ? context.parsed : 
                         (context.parsed && typeof context.parsed.y === 'number') ? context.parsed.y : 0;
            return `${context.label}: $${value.toFixed(2)}`;
          }
        }
      }
    }
  };

  const barOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: '#F3F4F6'
        },
        ticks: {
          callback: function(value) {
            const numValue = typeof value === 'number' ? value : 0;
            return '$' + numValue.toFixed(0);
          }
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'categories', label: 'Categories', icon: '📈' },
    { id: 'trends', label: 'Trends', icon: '📉' }
  ];

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
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">FINANCIAL_ANALYTICS</h1>
              <p className="text-gray-400 font-mono">Insights into your spending patterns and trends</p>
            </div>
          </div>
          
          {/* Date Range Selector */}
          <div className="bg-gray-900/80 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-6 shadow-2xl">
            <div className="flex flex-wrap gap-4 items-end">
              <div>
                <label className="block text-sm font-medium text-cyan-400 mb-2 font-mono">
                  START_DATE
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={dateRange.startDate}
                  onChange={handleDateChange}
                  className="px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200 font-mono"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-cyan-400 mb-2 font-mono">
                  END_DATE
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={dateRange.endDate}
                  onChange={handleDateChange}
                  className="px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200 font-mono"
                />
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    const today = new Date();
                    const lastWeek = new Date(today);
                    lastWeek.setDate(today.getDate() - 7);
                    setDateRange({
                      startDate: lastWeek.toISOString().split('T')[0],
                      endDate: today.toISOString().split('T')[0]
                    });
                  }}
                  className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-colors duration-200 text-sm font-medium font-mono"
                >
                  LAST_7_DAYS
                </button>
                <button
                  onClick={() => {
                    const today = new Date();
                    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
                    setDateRange({
                      startDate: lastMonth.toISOString().split('T')[0],
                      endDate: today.toISOString().split('T')[0]
                    });
                  }}
                  className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-colors duration-200 text-sm font-medium font-mono"
                >
                  LAST_MONTH
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-900/50 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-6 hover:border-cyan-400/40 transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1 font-mono">TOTAL_SPENT</p>
                <p className="text-3xl font-bold text-red-400">
                  ${analytics?.totalSpent?.toFixed(2) || '0.00'}
                </p>
              </div>
              <div className="p-3 bg-red-500/20 rounded-2xl">
                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-900/50 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-6 hover:border-cyan-400/40 transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1 font-mono">CATEGORIES</p>
                <p className="text-3xl font-bold text-blue-400">
                  {analytics?.categoryBreakdown?.length || 0}
                </p>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-2xl">
                <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-900/50 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-6 hover:border-cyan-400/40 transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1 font-mono">AVG_PER_CATEGORY</p>
                <p className="text-3xl font-bold text-green-400">
                  ${analytics?.categoryBreakdown?.length > 0 
                    ? (analytics.totalSpent / analytics.categoryBreakdown.length).toFixed(2)
                    : '0.00'
                  }
                </p>
              </div>
              <div className="p-3 bg-green-500/20 rounded-2xl">
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gray-900/50 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-6 hover:border-cyan-400/40 transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1 font-mono">DAILY_AVERAGE</p>
                <p className="text-3xl font-bold text-purple-400">
                  ${analytics?.totalSpent && dateRange.startDate && dateRange.endDate
                    ? (analytics.totalSpent / Math.max(1, Math.ceil((new Date(dateRange.endDate) - new Date(dateRange.startDate)) / (1000 * 60 * 60 * 24)))).toFixed(2)
                    : '0.00'
                  }
                </p>
              </div>
              <div className="p-3 bg-purple-500/20 rounded-2xl">
                <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-gray-900/50 backdrop-blur-xl border border-cyan-500/20 rounded-2xl shadow-lg mb-8">
          <div className="border-b border-cyan-500/20">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm font-mono transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'border-cyan-400 text-cyan-400'
                      : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label.toUpperCase()}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div>
                {analytics?.categoryBreakdown?.length > 0 ? (
                  <div className="grid lg:grid-cols-2 gap-8">
                    <div className="bg-gray-800/30 rounded-2xl p-6 border border-gray-700/50">
                      <h3 className="text-xl font-bold text-cyan-400 mb-6 font-mono">SPENDING_DISTRIBUTION</h3>
                      <div className="h-80">
                        <Pie data={pieData} options={chartOptions} />
                      </div>
                    </div>
                    
                    <div className="bg-gray-800/30 rounded-2xl p-6 border border-gray-700/50">
                      <h3 className="text-xl font-bold text-cyan-400 mb-6 font-mono">CATEGORY_COMPARISON</h3>
                      <div className="h-80">
                        <Bar data={barData} options={barOptions} />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 font-mono">NO_DATA_AVAILABLE</h3>
                    <p className="text-gray-400 mb-6 font-mono">
                      No expenses found for the selected date range. Add some expenses to see your analytics!
                    </p>
                    <a
                      href="/expenses"
                      className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white px-8 py-3 rounded-xl font-medium font-mono shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                    >
                      ADD_EXPENSES
                    </a>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'categories' && (
              <div>
                {analytics?.categoryBreakdown?.length > 0 ? (
                  <div className="overflow-hidden">
                    <h3 className="text-xl font-bold text-cyan-400 mb-6 font-mono">DETAILED_CATEGORY_BREAKDOWN</h3>
                    <div className="grid gap-4">
                      {analytics.categoryBreakdown.map((category) => {
                        const info = categoryInfo[category._id] || { color: '#6B7280', icon: '📝', label: category._id };
                        const percentage = ((category.total / analytics.totalSpent) * 100);
                        
                        return (
                          <div key={category._id} className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/50">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center space-x-3">
                                <div 
                                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                                  style={{ backgroundColor: info.color + '20' }}
                                >
                                  {info.icon}
                                </div>
                                <div>
                                  <h4 className="text-lg font-bold text-white font-mono">{info.label.toUpperCase()}</h4>
                                  <p className="text-sm text-gray-400 font-mono">{category.count} transactions</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-2xl font-bold font-mono" style={{ color: info.color }}>
                                  ${category.total.toFixed(2)}
                                </p>
                                <p className="text-sm text-gray-400 font-mono">{percentage.toFixed(1)}% of total</p>
                              </div>
                            </div>
                            
                            <div className="mb-2">
                              <div className="flex justify-between text-sm text-gray-400 mb-1 font-mono">
                                <span>Average per transaction</span>
                                <span>${(category.total / category.count).toFixed(2)}</span>
                              </div>
                              <div className="w-full bg-gray-700 rounded-full h-2">
                                <div
                                  className="h-2 rounded-full transition-all duration-500"
                                  style={{ 
                                    width: `${percentage}%`,
                                    backgroundColor: info.color
                                  }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <p className="text-gray-400 text-lg font-mono">NO_CATEGORY_DATA_AVAILABLE_FOR_SELECTED_PERIOD</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'trends' && (
              <div>
                <h3 className="text-xl font-bold text-cyan-400 mb-6 font-mono">SPENDING_TRENDS_LAST_7_DAYS</h3>
                <div className="bg-gray-800/30 rounded-2xl p-6 border border-gray-700/50">
                  <div className="h-80">
                    <Line data={generateTrendData()} options={{
                      ...chartOptions,
                      scales: {
                        y: {
                          beginAtZero: true,
                          grid: {
                            color: '#374151'
                          },
                          ticks: {
                            color: '#9CA3AF',
                            callback: function(value) {
                              const numValue = typeof value === 'number' ? value : 0;
                              return '$' + numValue.toFixed(0);
                            }
                          }
                        },
                        x: {
                          grid: {
                            display: false
                          },
                          ticks: {
                            color: '#9CA3AF'
                          }
                        }
                      }
                    }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;