import { create } from 'zustand';

interface DashboardState {
  isDarkMode: boolean;
  searchQuery: string;
  isSidebarCollapsed: boolean;
  favorites: string[];
  setDarkMode: (val: boolean) => void;
  setSearchQuery: (query: string) => void;
  setSidebarCollapsed: (val: boolean) => void;
  toggleFavorite: (tab: string) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  isDarkMode: false, // Start in light mode by default
  searchQuery: '',
  isSidebarCollapsed: false,
  favorites: ['dashboard', 'analytics'],
  setDarkMode: (val) => set({ isDarkMode: val }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSidebarCollapsed: (val) => set({ isSidebarCollapsed: val }),
  toggleFavorite: (tab) => set((state) => ({
    favorites: state.favorites.includes(tab)
      ? state.favorites.filter(f => f !== tab)
      : [...state.favorites, tab]
  }))
}));
