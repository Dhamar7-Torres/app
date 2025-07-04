import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink, useLocation } from "react-router-dom";
import {
  Bell,
  User,
  Search,
  Menu,
  X,
  Settings,
  LogOut,
  Beef,
  ChevronDown,
} from "lucide-react";

// Interfaces para TypeScript
interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "error" | "success";
  time: string;
  read: boolean;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

interface HeaderProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar, isSidebarOpen }) => {
  const location = useLocation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());

  // Mock data para demo - en producción vendría del contexto o API
  const currentUser: User = {
    id: "1",
    name: "Santiago Morales",
    email: "santiago.morales@ganaderia.com",
    role: "Administrador",
    avatar: undefined,
  };

  const notifications: NotificationItem[] = [
    {
      id: "1",
      title: "Vacunación Pendiente",
      message: "Vaca #A001 requiere vacunación contra brucelosis",
      type: "warning",
      time: "2 horas",
      read: false,
    },
    {
      id: "2",
      title: "Reporte de Enfermedad",
      message: "Toro #B003 presenta síntomas de mastitis",
      type: "error",
      time: "4 horas",
      read: false,
    },
    {
      id: "3",
      title: "Ubicación Actualizada",
      message: "Ganado del lote 5 cambió de ubicación",
      type: "info",
      time: "1 día",
      read: true,
    },
  ];

  const unreadNotifications = notifications.filter((n) => !n.read).length;

  // Actualizar hora cada minuto
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Cerrar menús cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        !target.closest(".notification-dropdown") &&
        !target.closest(".notification-button")
      ) {
        setIsNotificationOpen(false);
      }
      if (
        !target.closest(".user-dropdown") &&
        !target.closest(".user-button")
      ) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Obtener título de la página actual
  const getPageTitle = () => {
    const pathSegments = location.pathname.split("/").filter(Boolean);
    const currentPath = pathSegments[0] || "dashboard";

    const titleMap: { [key: string]: string } = {
      dashboard: "Panel Principal",
      cattle: "Gestión de Ganado",
      vaccinations: "Vacunaciones",
      illnesses: "Enfermedades",
      maps: "Mapas y Ubicaciones",
      reports: "Reportes y Análisis",
      settings: "Configuraciones",
    };

    return titleMap[currentPath] || "Gestión Ganadera";
  };

  // Animaciones para Framer Motion
  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  const searchVariants = {
    hidden: { width: 0, opacity: 0 },
    visible: {
      width: "300px",
      opacity: 1,
    },
  };

  const notificationVariants = {
    hidden: { opacity: 0, scale: 0.95, y: -10 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
    },
  };

  const userMenuVariants = {
    hidden: { opacity: 0, scale: 0.95, y: -10 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
    },
  };

  return (
    <motion.header
      className="bg-white border-b border-gray-200 shadow-sm relative z-50"
      initial="hidden"
      animate="visible"
      variants={headerVariants}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Sección izquierda: Logo y navegación */}
          <div className="flex items-center space-x-4">
            {/* Botón de menú hamburguesa */}
            <motion.button
              onClick={onToggleSidebar}
              className="p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isSidebarOpen ? "close" : "menu"}
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                </motion.div>
              </AnimatePresence>
            </motion.button>

            {/* Logo y título */}
            <div className="flex items-center space-x-3">
              <motion.div
                className="bg-gradient-to-r from-green-500 to-blue-600 p-2 rounded-lg"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <Beef className="text-white" size={24} />
              </motion.div>
              <div className="hidden md:block">
                <h1 className="text-xl font-bold text-gray-900">Ganadería</h1>
                <p className="text-sm text-gray-500">
                  Sistema de Gestión Ganadera
                </p>
              </div>
            </div>

            {/* Título de página actual */}
            <div className="hidden lg:block">
              <span className="text-gray-400">|</span>
              <span className="ml-3 text-lg font-medium text-gray-700">
                {getPageTitle()}
              </span>
            </div>
          </div>

          {/* Sección central: Barra de búsqueda */}
          <div className="flex-1 flex justify-center px-4 max-w-md">
            <div className="relative w-full">
              <AnimatePresence>
                {isSearchOpen ? (
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={searchVariants}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="relative"
                  >
                    <Search
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                    <input
                      type="text"
                      placeholder="Buscar ganado, vacunas, ubicaciones..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      autoFocus
                    />
                    <button
                      onClick={() => setIsSearchOpen(false)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X size={20} />
                    </button>
                  </motion.div>
                ) : (
                  <motion.button
                    onClick={() => setIsSearchOpen(true)}
                    className="flex items-center space-x-2 w-full px-4 py-2 text-left text-gray-500 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Search size={20} />
                    <span className="hidden sm:inline">Buscar...</span>
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Sección derecha: Notificaciones y usuario */}
          <div className="flex items-center space-x-4">
            {/* Fecha y hora actual */}
            <div className="hidden md:block text-right">
              <div className="text-sm font-medium text-gray-900">
                {currentTime.toLocaleDateString("es-ES", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              <div className="text-xs text-gray-500">
                {currentTime.toLocaleTimeString("es-ES", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>

            {/* Botón de notificaciones */}
            <div className="relative">
              <motion.button
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="notification-button relative p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Bell size={24} />
                {unreadNotifications > 0 && (
                  <motion.span
                    className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  >
                    {unreadNotifications}
                  </motion.span>
                )}
              </motion.button>

              {/* Dropdown de notificaciones */}
              <AnimatePresence>
                {isNotificationOpen && (
                  <motion.div
                    className="notification-dropdown absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden"
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={notificationVariants}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  >
                    <div className="p-4 border-b border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Notificaciones
                      </h3>
                      <p className="text-sm text-gray-500">
                        {unreadNotifications} no leídas
                      </p>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map((notification) => (
                        <motion.div
                          key={notification.id}
                          className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                            !notification.read ? "bg-blue-50" : ""
                          }`}
                          whileHover={{ scale: 1.01 }}
                          transition={{ duration: 0.1 }}
                        >
                          <div className="flex items-start space-x-3">
                            <div
                              className={`w-2 h-2 rounded-full mt-2 ${
                                notification.type === "error"
                                  ? "bg-red-500"
                                  : notification.type === "warning"
                                  ? "bg-yellow-500"
                                  : notification.type === "success"
                                  ? "bg-green-500"
                                  : "bg-blue-500"
                              }`}
                            />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">
                                {notification.title}
                              </p>
                              <p className="text-sm text-gray-600 mt-1">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                Hace {notification.time}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    <div className="p-4 border-t border-gray-200">
                      <button className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium">
                        Ver todas las notificaciones
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Menú de usuario */}
            <div className="relative">
              <motion.button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="user-button flex items-center space-x-2 p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                  <User className="text-white" size={16} />
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-900">
                    {currentUser.name}
                  </p>
                  <p className="text-xs text-gray-500">{currentUser.role}</p>
                </div>
                <ChevronDown size={16} />
              </motion.button>

              {/* Dropdown de usuario */}
              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    className="user-dropdown absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden"
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={userMenuVariants}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  >
                    <div className="p-4 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-900">
                        {currentUser.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {currentUser.email}
                      </p>
                    </div>
                    <div className="py-1">
                      <NavLink
                        to="/settings/profile"
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <User size={16} />
                        <span>Mi Perfil</span>
                      </NavLink>
                      <NavLink
                        to="/settings"
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Settings size={16} />
                        <span>Configuración</span>
                      </NavLink>
                      <button className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                        <LogOut size={16} />
                        <span>Cerrar Sesión</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
