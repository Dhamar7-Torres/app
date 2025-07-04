// Archivo de índice para exportar todos los componentes del layout
// Esto permite importar múltiples componentes con una sola línea

import React from "react";

// Componentes principales del layout
export { default as Layout } from "./Layout";
export { default as Header } from "./Header";
export { default as Sidebar } from "./Sidebar";
export { default as Footer } from "./Footer";

// Exportaciones con nombre para mayor flexibilidad
export { default as MainLayout } from "./Layout";
export { default as AppHeader } from "./Header";
export { default as AppSidebar } from "./Sidebar";
export { default as AppFooter } from "./Footer";

// Tipos e interfaces relacionadas con el layout
export interface LayoutProps {
  children?: React.ReactNode;
  className?: string;
}

export interface HeaderProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
  className?: string;
}

export interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isMobile: boolean;
  className?: string;
}

export interface FooterProps {
  className?: string;
  variant?: "full" | "minimal";
}

// Constantes del layout
export const LAYOUT_CONSTANTS = {
  SIDEBAR_WIDTH: {
    DESKTOP: 288, // w-72 = 18rem = 288px
    MOBILE: 320, // w-80 = 20rem = 320px
  },
  HEADER_HEIGHT: 64, // h-16 = 4rem = 64px
  BREAKPOINTS: {
    MOBILE: 768, // md breakpoint
    TABLET: 1024, // lg breakpoint
    DESKTOP: 1280, // xl breakpoint
  },
  Z_INDEX: {
    SIDEBAR: 50,
    OVERLAY: 40,
    HEADER: 50,
    FOOTER: 10,
  },
} as const;

// Utilidades para el layout
export const layoutUtils = {
  // Función para determinar si es móvil
  isMobile: () => window.innerWidth < LAYOUT_CONSTANTS.BREAKPOINTS.MOBILE,

  // Función para determinar si es tablet
  isTablet: () =>
    window.innerWidth >= LAYOUT_CONSTANTS.BREAKPOINTS.MOBILE &&
    window.innerWidth < LAYOUT_CONSTANTS.BREAKPOINTS.DESKTOP,

  // Función para determinar si es desktop
  isDesktop: () => window.innerWidth >= LAYOUT_CONSTANTS.BREAKPOINTS.DESKTOP,

  // Función para obtener el ancho del sidebar según el dispositivo
  getSidebarWidth: (isMobile: boolean) =>
    isMobile
      ? LAYOUT_CONSTANTS.SIDEBAR_WIDTH.MOBILE
      : LAYOUT_CONSTANTS.SIDEBAR_WIDTH.DESKTOP,

  // Función para obtener clases CSS del contenido principal
  getMainContentClasses: (isSidebarOpen: boolean, isMobile: boolean) => {
    const baseClasses = "flex-1 flex flex-col transition-all duration-300";
    if (isSidebarOpen && !isMobile) {
      return `${baseClasses} ml-72`; // ml-72 = 18rem = 288px
    }
    return `${baseClasses} ml-0`;
  },
};

// Hooks personalizados para el layout
export const useLayoutState = () => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);

  // Detectar cambios en el tamaño de pantalla
  React.useEffect(() => {
    const handleResize = () => {
      const mobile = layoutUtils.isMobile();
      setIsMobile(mobile);

      // Auto-gestión del sidebar
      if (mobile) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return {
    isSidebarOpen,
    setIsSidebarOpen,
    isMobile,
    toggleSidebar: () => setIsSidebarOpen(!isSidebarOpen),
    closeSidebar: () => setIsSidebarOpen(false),
    openSidebar: () => setIsSidebarOpen(true),
  };
};

// Configuración de animaciones del layout
export const LAYOUT_ANIMATIONS = {
  sidebar: {
    open: {
      x: 0,
    },
    closed: {
      x: -320, // Valor por defecto, se puede ajustar dinámicamente
    },
  },
  overlay: {
    open: {
      opacity: 1,
      display: "block",
    },
    closed: {
      opacity: 0,
      transitionEnd: {
        display: "none",
      },
    },
  },
  content: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    },
  },
} as const;

// Temas y estilos del layout
export const LAYOUT_THEMES = {
  light: {
    background: "bg-gray-50",
    sidebar: "bg-white border-gray-200",
    header: "bg-white border-gray-200",
    footer: "bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200",
  },
  dark: {
    background: "bg-gray-900",
    sidebar: "bg-gray-800 border-gray-700",
    header: "bg-gray-800 border-gray-700",
    footer: "bg-gradient-to-r from-gray-800 to-gray-900 border-gray-700",
  },
} as const;

// Configuración por defecto del layout
export const DEFAULT_LAYOUT_CONFIG = {
  theme: "light" as keyof typeof LAYOUT_THEMES,
  sidebarCollapsible: true,
  headerFixed: true,
  footerVariant: "full" as FooterProps["variant"],
  animationsEnabled: true,
  responsiveBreakpoints: true,
} as const;
