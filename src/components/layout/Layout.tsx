import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

// Interfaces para TypeScript
interface LayoutProps {
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar si es dispositivo móvil y manejar sidebar
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      // En desktop, sidebar abierto por defecto
      // En móvil, sidebar cerrado por defecto
      if (mobile) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Cerrar sidebar en móvil cuando se navega
  useEffect(() => {
    if (isMobile && isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  // Funciones para manejar el sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  // Animaciones para el overlay
  const overlayVariants = {
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
  };

  // Animación del contenido principal
  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Overlay para móvil */}
      {isMobile && (
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              initial="closed"
              animate="open"
              exit="closed"
              variants={overlayVariants}
              onClick={closeSidebar}
            />
          )}
        </AnimatePresence>
      )}

      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
        isMobile={isMobile}
      />

      {/* Contenido principal */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isSidebarOpen && !isMobile ? "ml-72" : "ml-0"
        }`}
      >
        {/* Header */}
        <Header onToggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

        {/* Contenido de la página con scroll */}
        <main className="flex-1 overflow-y-auto">
          <motion.div
            className="min-h-full"
            initial="hidden"
            animate="visible"
            variants={contentVariants}
            transition={{
              duration: 0.4,
              ease: "easeOut",
            }}
          >
            {/* Contenedor para las rutas hijas */}
            <div className="container mx-auto px-4 py-6">
              {/* Outlet para renderizar las rutas hijas */}
              <Outlet />

              {/* Contenido adicional si se pasa como children */}
              {children}
            </div>

            {/* Footer */}
            <Footer variant="full" />
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
