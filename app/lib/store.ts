import { create } from "zustand";

// ✅ UPDATED: Points to internal Next.js API routes
const API_URL = "/api";

interface AuthState {
    user: { email: string } | null;
    isAuthenticated: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    checkAuthStatus: () => Promise<boolean>;
}

interface StoreState {
    isLoading: boolean;
    auth: AuthState;
    fs: {
        upload: (files: File[]) => Promise<{ path: string } | null>;
        read: (path: string) => Promise<Blob | null>;
    };
    ai: {
        feedback: (path: string, instructions: string) => Promise<any>;
    };
    kv: {
        set: (key: string, value: string) => Promise<void>;
        get: (key: string) => Promise<string | null>;
        list: (pattern: string, returnValues?: boolean) => Promise<any[]>;
    };
    init: () => void;
}

export const usePuterStore = create<StoreState>((set, get) => ({
    isLoading: true,
    auth: {
        user: null,
        isAuthenticated: false,
        signIn: async (email, password) => {
            try {
                // Adjust this if you don't have an auth route yet, or keep for future use
                const res = await fetch(`${API_URL}/auth/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password })
                });
                const data = await res.json();

                if (!res.ok) throw new Error(data.error || "Login failed");

                localStorage.setItem("token", data.token);

                set((state) => ({
                    auth: { ...state.auth, user: data.user, isAuthenticated: true },
                    isLoading: false
                }));
            } catch (err: any) {
                console.error("Login Error:", err);
                alert(err.message);
                set({ isLoading: false });
            }
        },
        signOut: async () => {
            localStorage.removeItem("token");
            set((state) => ({
                auth: { ...state.auth, user: null, isAuthenticated: false }
            }));
            window.location.href = "/"; // Redirect to home
        },
        checkAuthStatus: async () => {
            const token = localStorage.getItem("token");
            if (token) {
                set((state) => ({
                    isLoading: false,
                    auth: { ...state.auth, isAuthenticated: true, user: { email: "User" } }
                }));
                return true;
            }
            set({ isLoading: false, auth: { ...get().auth, isAuthenticated: false } });
            return false;
        }
    },
    fs: {
        upload: async (files) => {
            const formData = new FormData();
            formData.append('files', files[0]);

            const token = localStorage.getItem("token");

            try {
                const res = await fetch(`${API_URL}/files/upload`, {
                    method: "POST",
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: formData
                });
                const data = await res.json();
                return data[0] ? { path: data[0].url } : null;
            } catch (e) {
                console.error("Upload failed", e);
                return null;
            }
        },
        read: async (path) => {
            try {
                const fetchUrl = path.startsWith("http") ? path : `${API_URL}/${path}`;
                const res = await fetch(fetchUrl);
                return await res.blob();
            } catch { return null; }
        }
    },
    ai: {
        feedback: async (fileUrl, instructions) => {
            const token = localStorage.getItem("token");

            const res = await fetch(`${API_URL}/ai/chat`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ prompt: instructions, fileUrl })
            });
            return await res.json();
        }
    },
    kv: {
        set: async (key, value) => {
            const token = localStorage.getItem("token");
            await fetch(`${API_URL}/kv/set`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ key, value })
            });
        },
        get: async (key) => {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_URL}/kv/get/${key}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            return data.value;
        },
        list: async (pattern) => {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_URL}/kv/list`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ pattern })
            });
            return await res.json();
        }
    },
    init: () => get().auth.checkAuthStatus(),
}));