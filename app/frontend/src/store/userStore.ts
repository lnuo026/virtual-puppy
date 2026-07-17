import { create } from "zustand";

export interface User {
     id: string;
     name: string;
     email: string;
     picture: string;
}

export interface UserStore {
     user: User | null;
     initialized: boolean;
     setUser: (user: User) => void;
     clearUser: () => void;
     setInitialized: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
     user: null,
     initialized: false,
     setUser: (user) => set({ user }),
     clearUser: () => set({ user: null }),
     setInitialized: () => set({ initialized: true }),
}));

