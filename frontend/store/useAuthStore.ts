import { create } from 'zustand';

export type Role = "Super Admin" | "Data Analyst" | "Reviewer";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  hasRole: (roles: Role[]) => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: {
    id: "u-1",
    name: "Elena Rostova",
    email: "elena@vibeanalytics.com",
    role: "Super Admin"
  }, // Pre-filled for UI scaffolding phase
  setUser: (user) => set({ user }),
  hasRole: (roles) => {
    const user = get().user;
    if (!user) return false;
    return roles.includes(user.role);
  }
}));
