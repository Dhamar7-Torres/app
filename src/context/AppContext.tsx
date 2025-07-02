import React, { createContext, useContext, useReducer, ReactNode } from "react";

// Tipos para el estado global de la aplicación
interface AppState {
  isLoading: boolean;
  error: string | null;
  notifications: Notification[];
  theme: "light" | "dark";
  language: "es" | "en";
  currentView: "dashboard" | "map" | "calendar" | "bovines" | "reports";
}

interface Notification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  timestamp: Date;
  duration?: number;
}

// Acciones disponibles para el reducer
type AppAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | {
      type: "ADD_NOTIFICATION";
      payload: Omit<Notification, "id" | "timestamp">;
    }
  | { type: "REMOVE_NOTIFICATION"; payload: string }
  | { type: "CLEAR_NOTIFICATIONS" }
  | { type: "SET_THEME"; payload: "light" | "dark" }
  | { type: "SET_LANGUAGE"; payload: "es" | "en" }
  | { type: "SET_CURRENT_VIEW"; payload: AppState["currentView"] };

// Estado inicial de la aplicación
const initialState: AppState = {
  isLoading: false,
  error: null,
  notifications: [],
  theme: "light",
  language: "es",
  currentView: "dashboard",
};

// Reducer para manejar las acciones del estado global
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };

    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    case "ADD_NOTIFICATION":
      const newNotification: Notification = {
        ...action.payload,
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date(),
      };
      return {
        ...state,
        notifications: [newNotification, ...state.notifications].slice(0, 5), // Máximo 5 notificaciones
      };

    case "REMOVE_NOTIFICATION":
      return {
        ...state,
        notifications: state.notifications.filter(
          (n) => n.id !== action.payload
        ),
      };

    case "CLEAR_NOTIFICATIONS":
      return {
        ...state,
        notifications: [],
      };

    case "SET_THEME":
      return {
        ...state,
        theme: action.payload,
      };

    case "SET_LANGUAGE":
      return {
        ...state,
        language: action.payload,
      };

    case "SET_CURRENT_VIEW":
      return {
        ...state,
        currentView: action.payload,
      };

    default:
      return state;
  }
};

// Contexto de la aplicación
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  // Funciones helper para acciones comunes
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addNotification: (
    notification: Omit<Notification, "id" | "timestamp">
  ) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  toggleTheme: () => void;
  setLanguage: (language: "es" | "en") => void;
  setCurrentView: (view: AppState["currentView"]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider del contexto de la aplicación
interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Funciones helper para facilitar el uso del contexto
  const setLoading = (loading: boolean) => {
    dispatch({ type: "SET_LOADING", payload: loading });
  };

  const setError = (error: string | null) => {
    dispatch({ type: "SET_ERROR", payload: error });
  };

  const addNotification = (
    notification: Omit<Notification, "id" | "timestamp">
  ) => {
    dispatch({ type: "ADD_NOTIFICATION", payload: notification });
  };

  const removeNotification = (id: string) => {
    dispatch({ type: "REMOVE_NOTIFICATION", payload: id });
  };

  const clearNotifications = () => {
    dispatch({ type: "CLEAR_NOTIFICATIONS" });
  };

  const toggleTheme = () => {
    dispatch({
      type: "SET_THEME",
      payload: state.theme === "light" ? "dark" : "light",
    });
  };

  const setLanguage = (language: "es" | "en") => {
    dispatch({ type: "SET_LANGUAGE", payload: language });
  };

  const setCurrentView = (view: AppState["currentView"]) => {
    dispatch({ type: "SET_CURRENT_VIEW", payload: view });
  };

  // Valor del contexto que se proporcionará a los componentes hijos
  const contextValue: AppContextType = {
    state,
    dispatch,
    setLoading,
    setError,
    addNotification,
    removeNotification,
    clearNotifications,
    toggleTheme,
    setLanguage,
    setCurrentView,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

// Hook personalizado para usar el contexto de la aplicación
export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};

// Hook para notificaciones con auto-eliminación
export const useNotifications = () => {
  const { state, addNotification, removeNotification } = useApp();

  const showNotification = (
    notification: Omit<Notification, "id" | "timestamp">
  ) => {
    const id = Math.random().toString(36).substr(2, 9);
    addNotification({
      ...notification,
      duration: notification.duration || 5000,
    });

    // Auto-eliminar la notificación después del tiempo especificado
    setTimeout(() => {
      removeNotification(id);
    }, notification.duration || 5000);
  };

  return {
    notifications: state.notifications,
    showNotification,
    removeNotification,
  };
};
