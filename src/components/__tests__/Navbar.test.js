import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import Navbar from '../Navbar';

const MockNavbar = ({ isAuthenticated = false, user = null }) => {
  const mockAuthContext = {
    isAuthenticated,
    user,
    logout: jest.fn()
  };

  return (
    <BrowserRouter>
      <AuthProvider value={mockAuthContext}>
        <Navbar />
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('Navbar', () => {
  test('renders app title', () => {
    render(<MockNavbar />);
    expect(screen.getByText('Financial Noting')).toBeInTheDocument();
  });

  test('shows login and register links when not authenticated', () => {
    render(<MockNavbar />);
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Register')).toBeInTheDocument();
  });

  test('shows navigation links when authenticated', () => {
    const user = { name: 'Test User', email: 'test@example.com' };
    render(<MockNavbar isAuthenticated={true} user={user} />);
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Expenses')).toBeInTheDocument();
    expect(screen.getByText('Accounts')).toBeInTheDocument();
    expect(screen.getByText('Analytics')).toBeInTheDocument();
    expect(screen.getByText('Hello, Test User')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });
});