import { create } from "zustand";
import {resetAuthTokens, setAuthTokens} from "../user/fetcher";

export const useAuthStore = create((set, getState) => ({
    loading: true,
    authenticated: false,
    userData: null,
    setAuth: (authData) => {
        set(() => ({
            loading: false,
            authenticated: true,
            userData: authData,
        }));
    },
    resetAuth: () => {
        resetAuthTokens();
        set({
            loading: false,
            authenticated: false,
            userData: null,
        });
    },
}));