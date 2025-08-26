import React, { createContext, useContext, useReducer } from 'react';
import api from '../config/axios';

const ExpenseContext = createContext();

const expenseReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_EXPENSES':
      return { ...state, expenses: action.payload, loading: false };
    case 'ADD_EXPENSE':
      return { ...state, expenses: [action.payload, ...state.expenses] };
    case 'UPDATE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.map(expense =>
          expense._id === action.payload._id ? action.payload : expense
        )
      };
    case 'DELETE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.filter(expense => expense._id !== action.payload)
      };
    case 'SET_ACCOUNTS':
      return { ...state, accounts: action.payload };
    case 'ADD_ACCOUNT':
      return { ...state, accounts: [...state.accounts, action.payload] };
    case 'UPDATE_ACCOUNT':
      return {
        ...state,
        accounts: state.accounts.map(account =>
          account._id === action.payload._id ? action.payload : account
        )
      };
    case 'DELETE_ACCOUNT':
      return {
        ...state,
        accounts: state.accounts.filter(account => account._id !== action.payload)
      };
    case 'SET_ANALYTICS':
      return { ...state, analytics: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

export const ExpenseProvider = ({ children }) => {
  const [state, dispatch] = useReducer(expenseReducer, {
    expenses: [],
    accounts: [],
    analytics: null,
    loading: false,
    error: null
  });

  const fetchExpenses = async (filters = {}) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const params = new URLSearchParams(filters);
      const res = await api.get(`/api/expenses?${params}`);
      dispatch({ type: 'SET_EXPENSES', payload: res.data.expenses });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message });
    }
  };

  const addExpense = async (expenseData) => {
    try {
      const res = await api.post('/api/expenses', expenseData);
      dispatch({ type: 'ADD_EXPENSE', payload: res.data });
      return { success: true };
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message });
      return { success: false, error: error.response?.data?.message };
    }
  };

  const deleteExpense = async (id) => {
    try {
      await api.delete(`/api/expenses/${id}`);
      dispatch({ type: 'DELETE_EXPENSE', payload: id });
      return { success: true };
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message });
      return { success: false, error: error.response?.data?.message };
    }
  };

  const fetchAccounts = async () => {
    try {
      const res = await api.get('/api/accounts');
      dispatch({ type: 'SET_ACCOUNTS', payload: res.data });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message });
    }
  };

  const addAccount = async (accountData) => {
    try {
      const res = await api.post('/api/accounts', accountData);
      dispatch({ type: 'ADD_ACCOUNT', payload: res.data });
      return { success: true };
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message });
      return { success: false, error: error.response?.data?.message };
    }
  };

  const updateAccount = async (id, accountData) => {
    try {
      const res = await api.put(`/api/accounts/${id}`, accountData);
      dispatch({ type: 'UPDATE_ACCOUNT', payload: res.data });
      return { success: true };
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message });
      return { success: false, error: error.response?.data?.message };
    }
  };

  const deleteAccount = async (id) => {
    try {
      await api.delete(`/api/accounts/${id}`);
      dispatch({ type: 'DELETE_ACCOUNT', payload: id });
      return { success: true };
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message });
      return { success: false, error: error.response?.data?.message };
    }
  };

  const fetchAnalytics = async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters);
      const res = await api.get(`/api/expenses/analytics?${params}`);
      dispatch({ type: 'SET_ANALYTICS', payload: res.data });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message });
    }
  };

  return (
    <ExpenseContext.Provider value={{
      ...state,
      fetchExpenses,
      addExpense,
      deleteExpense,
      fetchAccounts,
      addAccount,
      updateAccount,
      deleteAccount,
      fetchAnalytics
    }}>
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpense = () => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpense must be used within ExpenseProvider');
  }
  return context;
};