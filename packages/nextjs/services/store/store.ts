import create from "zustand";

/**
 * Zustand Store to manage the app's global state.
 * You can get and set values from anywhere in the app using the useGlobalState hook.
 *
 * This is a global state manager similar to `useState`, but accessible globally.
 */
type TGlobalState = {
  nativeCurrencyPrice: number;
  setNativeCurrencyPrice: (newPrice: number) => void;
};

export const useGlobalState = create<TGlobalState>((set) => ({
  // Default state values
  nativeCurrencyPrice: 0, // Initial value for native currency price
  setNativeCurrencyPrice: (newPrice: number) => set({ nativeCurrencyPrice: newPrice }),
}));

// Optional: add persistence (if needed)
import { persist } from "zustand/middleware";

export const usePersistedGlobalState = create<TGlobalState>(
  persist(
    (set) => ({
      nativeCurrencyPrice: 0,
      setNativeCurrencyPrice: (newPrice: number) => set({ nativeCurrencyPrice: newPrice }),
    }),
    {
      name: "global-state", // key for storage
      getStorage: () => localStorage, // Use localStorage to persist state
    }
  )
);
