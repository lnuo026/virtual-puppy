import { create } from "zustand";
import type { Pet } from "../api/pet";

export interface PetStore {
     pet: Pet | null;
     justHatched: boolean;
     justCheckedIn: boolean;
     setPet: (pet: Pet) => void;
     setHatchSignal: (justHatched: boolean, justCheckedIn: boolean) => void;
     clearPet: () => void;     
}

export const usePetStore = create<PetStore> ( (set) => ({
     pet: null,
     justHatched: false,
     justCheckedIn: false,
     setPet: (pet) => set({ pet }),
     setHatchSignal: (justHatched, justCheckedIn) => set({ justHatched, justCheckedIn }),
     clearPet: () => set({ pet: null, justHatched: false, justCheckedIn: false }),
}));