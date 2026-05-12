import { create } from 'zustand';
import { authApi } from './api';
import useStore from './useStore';

const useAuthStore = create((set, get) => ({
  // State
  user: null,          // { id, email, username, role, xp_total }
  token: localStorage.getItem('lm_token') || null,
  loading: false,
  error: null,

  // Auth
  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await authApi.login(email, password);
      const { user, token, progress } = res.data;
      localStorage.setItem('lm_token', token);
      set({ user, token, loading: false });
      useStore.setState({ progress: progress || {} });
      return true;
    } catch (err) {
      const msg = err.response?.data?.error || 'Error';
      set({ error: msg, loading: false });
      return false;
    }
  },

  register: async (email, username, password) => {
    try {
      set({ loading: true, error: null });
      const res = await authApi.register(email, username, password);
      if (res.data.requiresVerification) {
        set({ loading: false });
        return { requiresVerification: true };
      } else {
        localStorage.setItem('lm_token', res.data.token);
        set({ user: res.data.user, token: res.data.token, loading: false });
        useStore.getState().setProgress(res.data.progress || {});
        return { success: true };
      }
    } catch (err) {
      set({ error: err.response?.data?.error || err.message, loading: false });
      return { error: err.response?.data?.error || err.message };
    }
  },

  logout: () => {
    localStorage.removeItem('lm_token');
    set({ user: null, token: null, error: null });
    useStore.setState({ progress: {}, totalXP: 0, streak: 0 });
  },

  // Renew session
    fetchMe: async () => {
        const token = localStorage.getItem('lm_token');
        if (!token) return;
        try {
            const res = await authApi.me();
            set({ user: res.data.user });
            useStore.setState({ progress: res.data.progress || {} });
        } catch (err) {
            if (err.response?.status === 401 || err.response?.status === 403) {
                localStorage.removeItem('lm_token');
                set({ token: null });
            }
        }
    },

  // Sync XP
    syncXP: (newXpTotal) => {
        if (newXpTotal === null || newXpTotal === undefined) return;
        set(state => ({
            user: state.user ? { ...state.user, xp_total: newXpTotal } : null
        }));
    },

    clearError: () => set({ error: null }),
}));

export default useAuthStore;
