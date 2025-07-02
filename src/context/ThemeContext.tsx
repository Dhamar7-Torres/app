import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";

// Tipos para el tema de la aplicación
interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  card: string;
  text: {
    primary: string;
    secondary: string;
    disabled: string;
    inverse: string;
  };
  border: string;
  shadow: string;
  success: string;
  warning: string;
  error: string;
  info: string;
}

interface ThemeConfig {
  name: string;
  mode: "light" | "dark";
  colors: ThemeColors;
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    xxl: string;
  };
  typography: {
    fontFamily: {
      sans: string;
      serif: string;
      mono: string;
    };
    fontSize: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      "2xl": string;
      "3xl": string;
      "4xl": string;
    };
    fontWeight: {
      light: string;
      normal: string;
      medium: string;
      semibold: string;
      bold: string;
    };
    lineHeight: {
      tight: string;
      normal: string;
      relaxed: string;
    };
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  animations: {
    duration: {
      fast: string;
      normal: string;
      slow: string;
    };
    ease: {
      in: string;
      out: string;
      inOut: string;
    };
  };
}

// Estado del contexto de tema
interface ThemeState {
  currentTheme: ThemeConfig;
  availableThemes: ThemeConfig[];
  isDarkMode: boolean;
  systemPreference: "light" | "dark";
  autoMode: boolean; // Si debe seguir la preferencia del sistema
  customColors: Partial<ThemeColors>;
  fontSize: "small" | "medium" | "large";
  animations: boolean;
  reducedMotion: boolean;
}

// Acciones para el reducer del tema
type ThemeAction =
  | { type: "SET_THEME"; payload: string }
  | { type: "TOGGLE_DARK_MODE" }
  | { type: "SET_AUTO_MODE"; payload: boolean }
  | { type: "SET_SYSTEM_PREFERENCE"; payload: "light" | "dark" }
  | { type: "SET_CUSTOM_COLORS"; payload: Partial<ThemeColors> }
  | { type: "SET_FONT_SIZE"; payload: "small" | "medium" | "large" }
  | { type: "SET_ANIMATIONS"; payload: boolean }
  | { type: "SET_REDUCED_MOTION"; payload: boolean }
  | { type: "RESET_THEME" };

// Temas predefinidos
const lightTheme: ThemeConfig = {
  name: "light",
  mode: "light",
  colors: {
    primary: "#2563eb", // Azul
    secondary: "#64748b", // Gris azulado
    accent: "#10b981", // Verde esmeralda
    background: "#ffffff",
    surface: "#f8fafc",
    card: "#ffffff",
    text: {
      primary: "#1e293b",
      secondary: "#64748b",
      disabled: "#cbd5e1",
      inverse: "#ffffff",
    },
    border: "#e2e8f0",
    shadow: "rgba(0, 0, 0, 0.1)",
    success: "#10b981",
    warning: "#f59e0b",
    error: "#ef4444",
    info: "#3b82f6",
  },
  borderRadius: {
    sm: "0.25rem",
    md: "0.375rem",
    lg: "0.5rem",
    xl: "0.75rem",
    full: "9999px",
  },
  spacing: {
    xs: "0.5rem",
    sm: "0.75rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    xxl: "3rem",
  },
  typography: {
    fontFamily: {
      sans: "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
      serif: "Georgia, serif",
      mono: "JetBrains Mono, monospace",
    },
    fontSize: {
      xs: "0.75rem",
      sm: "0.875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
    },
    fontWeight: {
      light: "300",
      normal: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
    },
    lineHeight: {
      tight: "1.25",
      normal: "1.5",
      relaxed: "1.75",
    },
  },
  shadows: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
  },
  animations: {
    duration: {
      fast: "150ms",
      normal: "300ms",
      slow: "500ms",
    },
    ease: {
      in: "cubic-bezier(0.4, 0, 1, 1)",
      out: "cubic-bezier(0, 0, 0.2, 1)",
      inOut: "cubic-bezier(0.4, 0, 0.2, 1)",
    },
  },
};

const darkTheme: ThemeConfig = {
  ...lightTheme,
  name: "dark",
  mode: "dark",
  colors: {
    primary: "#3b82f6", // Azul más claro
    secondary: "#64748b",
    accent: "#10b981",
    background: "#0f172a", // Azul muy oscuro
    surface: "#1e293b", // Azul oscuro
    card: "#334155", // Azul gris
    text: {
      primary: "#f1f5f9",
      secondary: "#cbd5e1",
      disabled: "#64748b",
      inverse: "#1e293b",
    },
    border: "#334155",
    shadow: "rgba(0, 0, 0, 0.3)",
    success: "#10b981",
    warning: "#f59e0b",
    error: "#ef4444",
    info: "#3b82f6",
  },
};

// Tema veterinario (verde médico)
const veterinaryTheme: ThemeConfig = {
  ...lightTheme,
  name: "veterinary",
  colors: {
    ...lightTheme.colors,
    primary: "#059669", // Verde médico
    accent: "#0d9488", // Verde azulado
    success: "#10b981",
  },
};

// Tema granja (marrón tierra)
const farmTheme: ThemeConfig = {
  ...lightTheme,
  name: "farm",
  colors: {
    ...lightTheme.colors,
    primary: "#92400e", // Marrón
    accent: "#d97706", // Naranja tierra
    surface: "#fef7ed", // Crema
  },
};

const availableThemes = [lightTheme, darkTheme, veterinaryTheme, farmTheme];

// Estado inicial
const initialState: ThemeState = {
  currentTheme: lightTheme,
  availableThemes,
  isDarkMode: false,
  systemPreference: "light",
  autoMode: false,
  customColors: {},
  fontSize: "medium",
  animations: true,
  reducedMotion: false,
};

// Reducer del tema
const themeReducer = (state: ThemeState, action: ThemeAction): ThemeState => {
  switch (action.type) {
    case "SET_THEME": {
      const theme = state.availableThemes.find(
        (t) => t.name === action.payload
      );
      if (!theme) return state;

      return {
        ...state,
        currentTheme: theme,
        isDarkMode: theme.mode === "dark",
      };
    }

    case "TOGGLE_DARK_MODE": {
      const newMode = state.isDarkMode ? "light" : "dark";
      const newTheme =
        state.availableThemes.find(
          (t) =>
            t.mode === newMode &&
            t.name.includes(state.currentTheme.name.replace(/dark|light/, ""))
        ) || (newMode === "dark" ? darkTheme : lightTheme);

      return {
        ...state,
        currentTheme: newTheme,
        isDarkMode: !state.isDarkMode,
        autoMode: false,
      };
    }

    case "SET_AUTO_MODE":
      return {
        ...state,
        autoMode: action.payload,
        isDarkMode: action.payload
          ? state.systemPreference === "dark"
          : state.isDarkMode,
      };

    case "SET_SYSTEM_PREFERENCE": {
      const newPreference = action.payload;
      const shouldUpdateTheme = state.autoMode;

      if (shouldUpdateTheme) {
        const newTheme = newPreference === "dark" ? darkTheme : lightTheme;
        return {
          ...state,
          systemPreference: newPreference,
          currentTheme: newTheme,
          isDarkMode: newPreference === "dark",
        };
      }

      return {
        ...state,
        systemPreference: newPreference,
      };
    }

    case "SET_CUSTOM_COLORS":
      return {
        ...state,
        customColors: { ...state.customColors, ...action.payload },
        currentTheme: {
          ...state.currentTheme,
          colors: { ...state.currentTheme.colors, ...action.payload },
        },
      };

    case "SET_FONT_SIZE":
      return {
        ...state,
        fontSize: action.payload,
      };

    case "SET_ANIMATIONS":
      return {
        ...state,
        animations: action.payload,
      };

    case "SET_REDUCED_MOTION":
      return {
        ...state,
        reducedMotion: action.payload,
        animations: action.payload ? false : state.animations,
      };

    case "RESET_THEME":
      return {
        ...state,
        currentTheme: lightTheme,
        isDarkMode: false,
        customColors: {},
        fontSize: "medium",
        animations: true,
        reducedMotion: false,
      };

    default:
      return state;
  }
};

// Contexto del tema
interface ThemeContextType {
  state: ThemeState;
  // Funciones para cambiar tema
  setTheme: (themeName: string) => void;
  toggleDarkMode: () => void;
  setAutoMode: (enabled: boolean) => void;
  setCustomColors: (colors: Partial<ThemeColors>) => void;
  resetTheme: () => void;
  // Funciones para configuración
  setFontSize: (size: "small" | "medium" | "large") => void;
  setAnimations: (enabled: boolean) => void;
  setReducedMotion: (enabled: boolean) => void;
  // Funciones utilitarias
  getThemeCSS: () => string;
  applyThemeToDOM: () => void;
  isThemeActive: (themeName: string) => boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Provider del contexto de tema
interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: string;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme = "light",
}) => {
  const [state, dispatch] = useReducer(themeReducer, {
    ...initialState,
    currentTheme:
      availableThemes.find((t) => t.name === defaultTheme) || lightTheme,
  });

  // Detectar preferencia del sistema
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      dispatch({
        type: "SET_SYSTEM_PREFERENCE",
        payload: e.matches ? "dark" : "light",
      });
    };

    // Establecer preferencia inicial
    dispatch({
      type: "SET_SYSTEM_PREFERENCE",
      payload: mediaQuery.matches ? "dark" : "light",
    });

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Detectar preferencia de movimiento reducido
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = (e: MediaQueryListEvent) => {
      dispatch({ type: "SET_REDUCED_MOTION", payload: e.matches });
    };

    dispatch({ type: "SET_REDUCED_MOTION", payload: mediaQuery.matches });
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Cargar configuración desde localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme_config");
    if (savedTheme) {
      try {
        const config = JSON.parse(savedTheme);
        if (config.themeName) {
          dispatch({ type: "SET_THEME", payload: config.themeName });
        }
        if (config.fontSize) {
          dispatch({ type: "SET_FONT_SIZE", payload: config.fontSize });
        }
        if (typeof config.animations === "boolean") {
          dispatch({ type: "SET_ANIMATIONS", payload: config.animations });
        }
        if (typeof config.autoMode === "boolean") {
          dispatch({ type: "SET_AUTO_MODE", payload: config.autoMode });
        }
        if (config.customColors) {
          dispatch({ type: "SET_CUSTOM_COLORS", payload: config.customColors });
        }
      } catch (error) {
        console.error("Error loading theme config:", error);
      }
    }
  }, []);

  // Guardar configuración en localStorage cuando cambie
  useEffect(() => {
    const config = {
      themeName: state.currentTheme.name,
      fontSize: state.fontSize,
      animations: state.animations,
      autoMode: state.autoMode,
      customColors: state.customColors,
    };
    localStorage.setItem("theme_config", JSON.stringify(config));
  }, [
    state.currentTheme.name,
    state.fontSize,
    state.animations,
    state.autoMode,
    state.customColors,
  ]);

  // Funciones del contexto
  const setTheme = (themeName: string) => {
    dispatch({ type: "SET_THEME", payload: themeName });
  };

  const toggleDarkMode = () => {
    dispatch({ type: "TOGGLE_DARK_MODE" });
  };

  const setAutoMode = (enabled: boolean) => {
    dispatch({ type: "SET_AUTO_MODE", payload: enabled });
  };

  const setCustomColors = (colors: Partial<ThemeColors>) => {
    dispatch({ type: "SET_CUSTOM_COLORS", payload: colors });
  };

  const resetTheme = () => {
    dispatch({ type: "RESET_THEME" });
  };

  const setFontSize = (size: "small" | "medium" | "large") => {
    dispatch({ type: "SET_FONT_SIZE", payload: size });
  };

  const setAnimations = (enabled: boolean) => {
    dispatch({ type: "SET_ANIMATIONS", payload: enabled });
  };

  const setReducedMotion = (enabled: boolean) => {
    dispatch({ type: "SET_REDUCED_MOTION", payload: enabled });
  };

  // Generar CSS del tema actual
  const getThemeCSS = (): string => {
    const { colors, borderRadius, spacing, typography, shadows, animations } =
      state.currentTheme;

    return `
      :root {
        /* Colores */
        --color-primary: ${colors.primary};
        --color-secondary: ${colors.secondary};
        --color-accent: ${colors.accent};
        --color-background: ${colors.background};
        --color-surface: ${colors.surface};
        --color-card: ${colors.card};
        --color-text-primary: ${colors.text.primary};
        --color-text-secondary: ${colors.text.secondary};
        --color-text-disabled: ${colors.text.disabled};
        --color-text-inverse: ${colors.text.inverse};
        --color-border: ${colors.border};
        --color-shadow: ${colors.shadow};
        --color-success: ${colors.success};
        --color-warning: ${colors.warning};
        --color-error: ${colors.error};
        --color-info: ${colors.info};
        
        /* Border radius */
        --radius-sm: ${borderRadius.sm};
        --radius-md: ${borderRadius.md};
        --radius-lg: ${borderRadius.lg};
        --radius-xl: ${borderRadius.xl};
        --radius-full: ${borderRadius.full};
        
        /* Espaciado */
        --spacing-xs: ${spacing.xs};
        --spacing-sm: ${spacing.sm};
        --spacing-md: ${spacing.md};
        --spacing-lg: ${spacing.lg};
        --spacing-xl: ${spacing.xl};
        --spacing-xxl: ${spacing.xxl};
        
        /* Tipografía */
        --font-family-sans: ${typography.fontFamily.sans};
        --font-family-serif: ${typography.fontFamily.serif};
        --font-family-mono: ${typography.fontFamily.mono};
        
        /* Sombras */
        --shadow-sm: ${shadows.sm};
        --shadow-md: ${shadows.md};
        --shadow-lg: ${shadows.lg};
        --shadow-xl: ${shadows.xl};
        
        /* Animaciones */
        --duration-fast: ${animations.duration.fast};
        --duration-normal: ${animations.duration.normal};
        --duration-slow: ${animations.duration.slow};
        --ease-in: ${animations.ease.in};
        --ease-out: ${animations.ease.out};
        --ease-in-out: ${animations.ease.inOut};
      }
      
      body {
        background-color: var(--color-background);
        color: var(--color-text-primary);
        font-family: var(--font-family-sans);
        transition: background-color var(--duration-normal) var(--ease-in-out);
      }
      
      ${
        state.reducedMotion
          ? `
        *, *::before, *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      `
          : ""
      }
    `;
  };

  // Aplicar tema al DOM
  const applyThemeToDOM = () => {
    const style =
      document.getElementById("theme-variables") ||
      document.createElement("style");
    style.id = "theme-variables";
    style.innerHTML = getThemeCSS();

    if (!style.parentNode) {
      document.head.appendChild(style);
    }

    // Aplicar clase de tema al body
    document.body.className = document.body.className
      .replace(/theme-\w+/g, "")
      .concat(` theme-${state.currentTheme.name}`);

    // Aplicar tamaño de fuente
    document.documentElement.setAttribute("data-font-size", state.fontSize);
  };

  // Verificar si un tema está activo
  const isThemeActive = (themeName: string): boolean => {
    return state.currentTheme.name === themeName;
  };

  // Aplicar tema cuando cambie
  useEffect(() => {
    applyThemeToDOM();
  }, [state.currentTheme, state.fontSize, state.reducedMotion]);

  // Valor del contexto
  const contextValue: ThemeContextType = {
    state,
    setTheme,
    toggleDarkMode,
    setAutoMode,
    setCustomColors,
    resetTheme,
    setFontSize,
    setAnimations,
    setReducedMotion,
    getThemeCSS,
    applyThemeToDOM,
    isThemeActive,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook personalizado para usar el contexto de tema
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

// Hook para obtener solo los colores del tema actual
export const useThemeColors = (): ThemeColors => {
  const { state } = useTheme();
  return state.currentTheme.colors;
};

// Hook para verificar si está en modo oscuro
export const useIsDarkMode = (): boolean => {
  const { state } = useTheme();
  return state.isDarkMode;
};

// Hook para obtener configuración de animaciones
export const useAnimations = (): {
  enabled: boolean;
  reducedMotion: boolean;
} => {
  const { state } = useTheme();
  return {
    enabled: state.animations,
    reducedMotion: state.reducedMotion,
  };
};
