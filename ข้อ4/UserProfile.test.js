import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserProfile from './UserProfile';

// Mock fetch globally
global.fetch = jest.fn();

describe('UserProfile', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('should show loading state initially', () => {
    render(<UserProfile userId="1" />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should render user data when fetch is successful', async () => {
    const mockUser = {
      name: 'John Doe',
      email: 'john@example.com'
    };

    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockUser),
      })
    );

    render(<UserProfile userId="1" />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Email: john@example.com')).toBeInTheDocument();
    });

    expect(fetch).toHaveBeenCalledWith('https://api.example.com/users/1');
  });

  it('should show error message when fetch fails', async () => {
    const errorMessage = 'Failed to fetch user data';
    
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
      })
    );

    render(<UserProfile userId="1" />);

    await waitFor(() => {
      expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument();
    });
  });

  it('should refetch user data when userId prop changes', async () => {
    // Mock first user data
    const firstUser = {
      name: 'John Doe',
      email: 'john@example.com'
    };
    
    // Mock second user data
    const secondUser = {
      name: 'Jane Smith',
      email: 'jane@example.com'
    };

    // Setup fetch mock to return different users
    fetch
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(firstUser),
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(secondUser),
        })
      );

    const { rerender } = render(<UserProfile userId="1" />);

    // Wait for first user to be displayed
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Email: john@example.com')).toBeInTheDocument();
    });

    // Rerender with different userId
    rerender(<UserProfile userId="2" />);

    // Wait for second user to be displayed
    await waitFor(() => {
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('Email: jane@example.com')).toBeInTheDocument();
    });

    // Verify fetch was called twice with different userIds
    expect(fetch).toHaveBeenCalledTimes(2);
    expect(fetch).toHaveBeenNthCalledWith(1, 'https://api.example.com/users/1');
    expect(fetch).toHaveBeenNthCalledWith(2, 'https://api.example.com/users/2');
  });
});
