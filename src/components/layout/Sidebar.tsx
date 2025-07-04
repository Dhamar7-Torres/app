import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Beef,
  Syringe,
  Activity,
  Map,
  Calendar,
  BarChart3,
  Settings,
  FileText,
  ChevronRight,
  X,
  MapPin,
  TrendingUp,
  Shield,
  Users,
  Database,
  Bell,
  Eye,
  Plus,
  List,
  Heart,
  Stethoscope,
} from "lucide-react";

// Interfaces para TypeScript
interface NavItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  path: string;
  children?: NavItem[];
  badge?: string;
  badgeColor?: "red" | "blue" | "green" | "yellow" | "purple" | "orange";
  description?: string;
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isMobile: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, isMobile }) => {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>(["dashboard"]);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  // Auto-expandir el elemento activo actual
  useEffect(() => {
    const currentPath = location.pathname;
    const activeParent = navigationItems.find((item) =>
      item.children?.some((child) => currentPath.startsWith(child.path))
    );

    if (activeParent && !expandedItems.includes(activeParent.id)) {
      setExpandedItems((prev) => [...prev, activeParent.id]);
    }
  }, [location.pathname]);

  // Configuración completa de navegación
  const navigationItems: NavItem[] = [
    {
      id: "dashboard",
      title: "Panel Principal",
      icon: <Home size={20} />,
      path: "/dashboard",
      description: "Vista general del sistema",
    },
    {
      id: "cattle",
      title: "Gestión de Ganado",
      icon: <Beef size={20} />,
      path: "/cattle",
      description: "Administrar información del ganado",
      children: [
        {
          id: "cattle-list",
          title: "Lista de Ganado",
          icon: <List size={16} />,
          path: "/cattle/list",
          description: "Ver todos los animales",
        },
        {
          id: "cattle-add",
          title: "Registrar Animal",
          icon: <Plus size={16} />,
          path: "/cattle/add",
          description: "Agregar nuevo ganado",
        },
        {
          id: "cattle-genealogy",
          title: "Genealogía",
          icon: <Users size={16} />,
          path: "/cattle/genealogy",
          description: "Árbol genealógico",
        },
        {
          id: "cattle-breeding",
          title: "Reproducción",
          icon: <Heart size={16} />,
          path: "/cattle/breeding",
          description: "Gestión reproductiva",
        },
      ],
    },
    {
      id: "vaccinations",
      title: "Vacunaciones",
      icon: <Syringe size={20} />,
      path: "/vaccinations",
      badge: "5",
      badgeColor: "red",
      description: "Control de vacunas y medicamentos",
      children: [
        {
          id: "vaccinations-list",
          title: "Historial de Vacunas",
          icon: <FileText size={16} />,
          path: "/vaccinations/list",
          description: "Ver historial completo",
        },
        {
          id: "vaccinations-add",
          title: "Registrar Vacuna",
          icon: <Plus size={16} />,
          path: "/vaccinations/add",
          description: "Nueva vacunación",
        },
        {
          id: "vaccinations-calendar",
          title: "Calendario",
          icon: <Calendar size={16} />,
          path: "/vaccinations/calendar",
          description: "Programar vacunaciones",
        },
        {
          id: "vaccinations-schedule",
          title: "Próximas Vacunas",
          icon: <Bell size={16} />,
          path: "/vaccinations/schedule",
          badge: "3",
          badgeColor: "orange",
          description: "Vacunas pendientes",
        },
      ],
    },
    {
      id: "illnesses",
      title: "Enfermedades",
      icon: <Activity size={20} />,
      path: "/illnesses",
      badge: "2",
      badgeColor: "yellow",
      description: "Seguimiento de salud y enfermedades",
      children: [
        {
          id: "illnesses-list",
          title: "Casos Activos",
          icon: <Stethoscope size={16} />,
          path: "/illnesses/list",
          description: "Enfermedades en curso",
        },
        {
          id: "illnesses-add",
          title: "Reportar Enfermedad",
          icon: <Plus size={16} />,
          path: "/illnesses/add",
          description: "Nuevo caso médico",
        },
        {
          id: "illnesses-reports",
          title: "Reportes Médicos",
          icon: <BarChart3 size={16} />,
          path: "/illnesses/reports",
          description: "Estadísticas de salud",
        },
        {
          id: "illnesses-prevention",
          title: "Prevención",
          icon: <Shield size={16} />,
          path: "/illnesses/prevention",
          description: "Medidas preventivas",
        },
      ],
    },
    {
      id: "maps",
      title: "Mapas y Ubicaciones",
      icon: <Map size={20} />,
      path: "/maps",
      description: "Geolocalización y mapas",
      children: [
        {
          id: "maps-overview",
          title: "Vista General",
          icon: <Eye size={16} />,
          path: "/maps/overview",
          description: "Mapa completo del ganado",
        },
        {
          id: "maps-vaccinations",
          title: "Ubicaciones de Vacunas",
          icon: <MapPin size={16} />,
          path: "/maps/vaccinations",
          description: "Dónde se vacunó cada animal",
        },
        {
          id: "maps-illnesses",
          title: "Zonas de Enfermedad",
          icon: <MapPin size={16} />,
          path: "/maps/illnesses",
          description: "Áreas de brotes",
        },
        {
          id: "maps-locations",
          title: "Gestión de Ubicaciones",
          icon: <Database size={16} />,
          path: "/maps/locations",
          description: "Administrar ubicaciones",
        },
      ],
    },
    {
      id: "reports",
      title: "Reportes y Análisis",
      icon: <BarChart3 size={20} />,
      path: "/reports",
      description: "Análisis y estadísticas",
      children: [
        {
          id: "reports-health",
          title: "Salud del Ganado",
          icon: <TrendingUp size={16} />,
          path: "/reports/health",
          description: "Indicadores de salud",
        },
        {
          id: "reports-vaccinations",
          title: "Cobertura de Vacunas",
          icon: <BarChart3 size={16} />,
          path: "/reports/vaccinations",
          description: "Estadísticas de vacunación",
        },
        {
          id: "reports-financial",
          title: "Costos Veterinarios",
          icon: <TrendingUp size={16} />,
          path: "/reports/financial",
          description: "Análisis de costos",
        },
        {
          id: "reports-productivity",
          title: "Productividad",
          icon: <BarChart3 size={16} />,
          path: "/reports/productivity",
          description: "Métricas de rendimiento",
        },
      ],
    },
    {
      id: "settings",
      title: "Configuraciones",
      icon: <Settings size={20} />,
      path: "/settings",
      description: "Ajustes del sistema",
      children: [
        {
          id: "settings-profile",
          title: "Mi Perfil",
          icon: <Users size={16} />,
          path: "/settings/profile",
          description: "Información personal",
        },
        {
          id: "settings-notifications",
          title: "Notificaciones",
          icon: <Bell size={16} />,
          path: "/settings/notifications",
          description: "Alertas y avisos",
        },
        {
          id: "settings-system",
          title: "Sistema",
          icon: <Database size={16} />,
          path: "/settings/system",
          description: "Configuración general",
        },
      ],
    },
  ];

  // Función para manejar expansión de elementos
  const toggleExpanded = (itemId: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  // Función para verificar si un elemento está activo
  const isActiveItem = (path: string, children?: NavItem[]) => {
    if (location.pathname === path) return true;
    if (children) {
      return children.some(
        (child) =>
          location.pathname === child.path ||
          location.pathname.startsWith(child.path + "/")
      );
    }
    return location.pathname.startsWith(path + "/");
  };

  // Función para obtener el color del badge
  const getBadgeClass = (color: string) => {
    const colorMap = {
      red: "bg-red-100 text-red-800 border-red-200",
      blue: "bg-blue-100 text-blue-800 border-blue-200",
      green: "bg-green-100 text-green-800 border-green-200",
      yellow: "bg-yellow-100 text-yellow-800 border-yellow-200",
      purple: "bg-purple-100 text-purple-800 border-purple-200",
      orange: "bg-orange-100 text-orange-800 border-orange-200",
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  // Animaciones
  const sidebarVariants = {
    open: {
      x: 0,
    },
    closed: {
      x: isMobile ? -320 : -280,
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (_index: number) => ({
      opacity: 1,
      x: 0,
    }),
  };

  const childrenVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: "auto",
    },
  };

  return (
    <motion.aside
      className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 shadow-xl z-50 ${
        isMobile ? "w-80" : "w-72"
      }`}
      initial="closed"
      animate={isOpen ? "open" : "closed"}
      variants={sidebarVariants}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
    >
      <div className="flex flex-col h-full">
        {/* Header del sidebar */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-blue-50">
          <div className="flex items-center space-x-3">
            <motion.div
              className="bg-gradient-to-r from-green-500 to-blue-600 p-2 rounded-xl shadow-lg"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <Beef className="text-white" size={24} />
            </motion.div>
            <div>
              <h2 className="text-lg font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Ganadería
              </h2>
              <p className="text-xs text-gray-500 font-medium">
                Sistema Inteligente v1.0
              </p>
            </div>
          </div>
          {isMobile && (
            <motion.button
              onClick={onClose}
              className="p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.1 }}
            >
              <X size={20} />
            </motion.button>
          )}
        </div>

        {/* Navegación principal */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <div className="space-y-1">
            {navigationItems.map((item, index) => (
              <motion.div
                key={item.id}
                custom={index}
                initial="hidden"
                animate="visible"
                variants={itemVariants}
                transition={{
                  delay: index * 0.05,
                  duration: 0.3,
                }}
                onHoverStart={() => setHoveredItem(item.id)}
                onHoverEnd={() => setHoveredItem(null)}
              >
                {/* Elemento principal */}
                <div className="relative">
                  <NavLink
                    to={item.children ? "#" : item.path}
                    className={`flex items-center justify-between w-full px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                      isActiveItem(item.path, item.children)
                        ? "bg-gradient-to-r from-green-500 to-blue-600 text-white shadow-lg transform scale-105"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900 hover:shadow-md"
                    }`}
                    onClick={(e) => {
                      if (item.children) {
                        e.preventDefault();
                        toggleExpanded(item.id);
                      }
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`p-1 rounded-lg transition-all duration-200 ${
                          isActiveItem(item.path, item.children)
                            ? "bg-white/20"
                            : "group-hover:bg-gray-100"
                        }`}
                      >
                        {item.icon}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium">{item.title}</span>
                        {hoveredItem === item.id && item.description && (
                          <motion.span
                            className="text-xs opacity-75 mt-1"
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                          >
                            {item.description}
                          </motion.span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {/* Badge de notificación */}
                      {item.badge && (
                        <motion.span
                          className={`px-2 py-1 text-xs font-bold rounded-full border ${getBadgeClass(
                            item.badgeColor || "blue"
                          )}`}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                        >
                          {item.badge}
                        </motion.span>
                      )}

                      {/* Icono de expansión */}
                      {item.children && (
                        <motion.div
                          animate={{
                            rotate: expandedItems.includes(item.id) ? 90 : 0,
                          }}
                          transition={{ duration: 0.2, ease: "easeInOut" }}
                        >
                          <ChevronRight size={16} className="opacity-60" />
                        </motion.div>
                      )}
                    </div>
                  </NavLink>
                </div>

                {/* Elementos hijos expandibles */}
                {item.children && (
                  <AnimatePresence>
                    {expandedItems.includes(item.id) && (
                      <motion.div
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={childrenVariants}
                        transition={{
                          duration: 0.3,
                          ease: "easeInOut",
                        }}
                        className="ml-6 mt-2 space-y-1"
                      >
                        {item.children.map((child) => (
                          <motion.div
                            key={child.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <NavLink
                              to={child.path}
                              className={({ isActive }) =>
                                `flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all duration-200 group ${
                                  isActive
                                    ? "bg-blue-50 text-blue-700 border-l-4 border-blue-500 shadow-sm"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                }`
                              }
                            >
                              <div className="flex items-center space-x-3">
                                <div className="p-1 rounded transition-all duration-200 group-hover:bg-gray-100">
                                  {child.icon}
                                </div>
                                <div className="flex flex-col">
                                  <span className="font-medium">
                                    {child.title}
                                  </span>
                                  {child.description && (
                                    <span className="text-xs opacity-75">
                                      {child.description}
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Badge hijo */}
                              {child.badge && (
                                <span
                                  className={`px-2 py-1 text-xs font-bold rounded-full ${getBadgeClass(
                                    child.badgeColor || "blue"
                                  )}`}
                                >
                                  {child.badge}
                                </span>
                              )}
                            </NavLink>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </motion.div>
            ))}
          </div>
        </nav>

        {/* Footer del sidebar con información del sistema */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <motion.div
            className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 border border-green-100"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <div className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping opacity-75"></div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Sistema Activo
                  </p>
                  <p className="text-xs text-gray-600">
                    Sincronizado hace 2 min
                  </p>
                </div>
              </div>
              <motion.button
                className="p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-white"
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <Settings size={16} />
              </motion.button>
            </div>

            {/* Estadísticas rápidas */}
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white rounded-lg p-2 text-center">
                <div className="font-bold text-green-600">127</div>
                <div className="text-gray-500">Animales</div>
              </div>
              <div className="bg-white rounded-lg p-2 text-center">
                <div className="font-bold text-blue-600">5</div>
                <div className="text-gray-500">Pendientes</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
