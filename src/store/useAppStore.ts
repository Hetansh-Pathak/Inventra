import { create } from 'zustand';

interface AppState {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  globalSearchOpen: boolean;
  setGlobalSearchOpen: (open: boolean) => void;
  currentUser: { name: string; email: string; role: string; initials: string };
}

export const useAppStore = create<AppState>((set) => ({
  sidebarCollapsed: false,
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  globalSearchOpen: false,
  setGlobalSearchOpen: (open) => set({ globalSearchOpen: open }),
  currentUser: {
    name: 'Rajesh Kumar',
    email: 'rajesh@coreinventory.com',
    role: 'Admin',
    initials: 'RK',
  },
}));
