import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";

// Tipos para el usuario y autenticación
interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "veterinarian" | "farmer" | "viewer";
  avatar?: string;
  farmId?: string;
  permissions: string[];
  createdAt: Date;
  lastLogin?: Date;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  refreshToken?: string;
}

// Credenciales para login
interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

// Datos para registro
interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: User["role"];
  farmId?: string;
}

// Acciones disponibles para el reducer de autenticación
type AuthAction =
  | { type: "AUTH_START" }
  | {
      type: "AUTH_SUCCESS";
      payload: { user: User; token: string; refreshToken?: string };
    }
  | { type: "AUTH_FAILURE"; payload: string }
  | { type: "LOGOUT" }
  | { type: "UPDATE_USER"; payload: Partial<User> }
  | { type: "CLEAR_ERROR" }
  | { type: "SET_LOADING"; payload: boolean };

// Estado inicial de autenticación
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  refreshToken: undefined,
};

// Reducer para manejar las acciones de autenticación
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "AUTH_START":
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case "AUTH_SUCCESS":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        refreshToken: action.payload.refreshToken,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };

    case "AUTH_FAILURE":
      return {
        ...state,
        user: null,
        token: null,
        refreshToken: undefined,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };

    case "LOGOUT":
      return {
        ...initialState,
      };

    case "UPDATE_USER":
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };

    case "CLEAR_ERROR":
      return {
        ...state,
        error: null,
      };

    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };

    default:
      return state;
  }
};

// Contexto de autenticación
interface AuthContextType {
  state: AuthState;
  // Funciones de autenticación
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  refreshAuth: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  changePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<void>;
  clearError: () => void;
  // Funciones de verificación de permisos
  hasPermission: (permission: string) => boolean;
  isRole: (role: User["role"]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Configuración de la API (en un entorno real esto vendría de variables de entorno)
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3001/api";

// Provider del contexto de autenticación
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Función para realizar peticiones HTTP autenticadas
  const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      "Content-Type": "application/json",
      ...(state.token && { Authorization: `Bearer ${state.token}` }),
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error en la solicitud");
    }

    return response.json();
  };

  // Función de login
  const login = async (credentials: LoginCredentials) => {
    try {
      dispatch({ type: "AUTH_START" });

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Error al iniciar sesión");
      }

      const data = await response.json();

      // Guardar tokens en localStorage si el usuario eligió "recordarme"
      if (credentials.rememberMe) {
        localStorage.setItem("auth_token", data.token);
        if (data.refreshToken) {
          localStorage.setItem("refresh_token", data.refreshToken);
        }
      }

      dispatch({
        type: "AUTH_SUCCESS",
        payload: {
          user: data.user,
          token: data.token,
          refreshToken: data.refreshToken,
        },
      });
    } catch (error) {
      dispatch({
        type: "AUTH_FAILURE",
        payload: error instanceof Error ? error.message : "Error desconocido",
      });
      throw error;
    }
  };

  // Función de registro
  const register = async (data: RegisterData) => {
    try {
      dispatch({ type: "AUTH_START" });

      if (data.password !== data.confirmPassword) {
        throw new Error("Las contraseñas no coinciden");
      }

      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          role: data.role,
          farmId: data.farmId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Error al registrar usuario");
      }

      const responseData = await response.json();

      dispatch({
        type: "AUTH_SUCCESS",
        payload: {
          user: responseData.user,
          token: responseData.token,
          refreshToken: responseData.refreshToken,
        },
      });
    } catch (error) {
      dispatch({
        type: "AUTH_FAILURE",
        payload: error instanceof Error ? error.message : "Error desconocido",
      });
      throw error;
    }
  };

  // Función de logout
  const logout = () => {
    // Limpiar tokens del localStorage
    localStorage.removeItem("auth_token");
    localStorage.removeItem("refresh_token");

    dispatch({ type: "LOGOUT" });
  };

  // Función para refrescar la autenticación
  const refreshAuth = async () => {
    try {
      const refreshToken = localStorage.getItem("refresh_token");
      if (!refreshToken) {
        throw new Error("No hay token de refresco disponible");
      }

      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error("Error al refrescar token");
      }

      const data = await response.json();

      localStorage.setItem("auth_token", data.token);
      if (data.refreshToken) {
        localStorage.setItem("refresh_token", data.refreshToken);
      }

      dispatch({
        type: "AUTH_SUCCESS",
        payload: {
          user: data.user,
          token: data.token,
          refreshToken: data.refreshToken,
        },
      });
    } catch (error) {
      logout();
      throw error;
    }
  };

  // Función para actualizar perfil
  const updateProfile = async (data: Partial<User>) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });

      const updatedUser = await apiRequest("/auth/profile", {
        method: "PUT",
        body: JSON.stringify(data),
      });

      dispatch({ type: "UPDATE_USER", payload: updatedUser });
    } catch (error) {
      dispatch({
        type: "AUTH_FAILURE",
        payload:
          error instanceof Error ? error.message : "Error al actualizar perfil",
      });
      throw error;
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  // Función para solicitar recuperación de contraseña
  const forgotPassword = async (email: string) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });

      await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
    } catch (error) {
      throw error;
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  // Función para resetear contraseña
  const resetPassword = async (token: string, newPassword: string) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });

      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, newPassword }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Error al resetear contraseña");
      }
    } catch (error) {
      throw error;
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  // Función para cambiar contraseña
  const changePassword = async (
    currentPassword: string,
    newPassword: string
  ) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });

      await apiRequest("/auth/change-password", {
        method: "POST",
        body: JSON.stringify({ currentPassword, newPassword }),
      });
    } catch (error) {
      throw error;
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  // Función para limpiar errores
  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" });
  };

  // Función para verificar permisos
  const hasPermission = (permission: string): boolean => {
    return state.user?.permissions.includes(permission) || false;
  };

  // Función para verificar rol
  const isRole = (role: User["role"]): boolean => {
    return state.user?.role === role;
  };

  // Efecto para cargar usuario desde localStorage al iniciar
  useEffect(() => {
    const loadUserFromStorage = async () => {
      const token = localStorage.getItem("auth_token");
      if (token) {
        try {
          dispatch({ type: "SET_LOADING", payload: true });

          const response = await fetch(`${API_BASE_URL}/auth/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const userData = await response.json();
            dispatch({
              type: "AUTH_SUCCESS",
              payload: {
                user: userData,
                token,
                refreshToken:
                  localStorage.getItem("refresh_token") || undefined,
              },
            });
          } else {
            // Token inválido, intentar refrescar
            await refreshAuth();
          }
        } catch (error) {
          // Si falla, limpiar localStorage
          logout();
        } finally {
          dispatch({ type: "SET_LOADING", payload: false });
        }
      }
    };

    loadUserFromStorage();
  }, []);

  // Valor del contexto que se proporcionará a los componentes hijos
  const contextValue: AuthContextType = {
    state,
    login,
    register,
    logout,
    refreshAuth,
    updateProfile,
    forgotPassword,
    resetPassword,
    changePassword,
    clearError,
    hasPermission,
    isRole,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto de autenticación
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Hook para verificar si el usuario está autenticado
export const useIsAuthenticated = (): boolean => {
  const { state } = useAuth();
  return state.isAuthenticated;
};

// Hook para obtener el usuario actual
export const useCurrentUser = (): User | null => {
  const { state } = useAuth();
  return state.user;
};
