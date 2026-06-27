import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Sidebar } from '@/components/layout/sidebar';

// Mock matchMedia for testing responsive UI elements
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: () => '/analytics',
  useRouter: () => ({ push: vi.fn() })
}));

describe('UI Foundation Components', () => {
  describe('Sidebar Navigation', () => {
    it('renders the main navigation links', () => {
      render(<Sidebar />);
      
      expect(screen.getByText('Analytics')).toBeDefined();
      expect(screen.getByText('Datasets')).toBeDefined();
      expect(screen.getByText('Predictions')).toBeDefined();
      expect(screen.getByText('Organizations')).toBeDefined();
      expect(screen.getByText('Settings')).toBeDefined();
    });

    it('has correct ARIA labels for accessibility', () => {
      render(<Sidebar />);
      
      // The toggle collapse button should have sr-only text
      expect(screen.getAllByText('Toggle Collapse')).toBeDefined();
    });
  });
});
