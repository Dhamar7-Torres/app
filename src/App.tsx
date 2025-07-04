import React, { Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "./components/layout";
import {
  Loader2,
  Construction,
  Home,
  Beef,
  Heart,
  Map,
  Calendar,
  BarChart3,
  Settings,
  Package,
  DollarSign,
  Activity,
  Users,
  Tractor,
  Baby,
} from "lucide-react";

// Interfaces TypeScript
interface LoadingSpinnerProps {
  message?: string;
}

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  module: string;
  features: string[];
}

// Componente de Loading con animación
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = "Cargando...",
}) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <motion.div
        className="flex flex-col items-center space-y-4"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="w-12 h-12 text-blue-600" />
        </motion.div>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            Bovino_Ujat
          </h3>
          <p className="text-sm text-gray-600">{message}</p>
        </div>
      </motion.div>
    </div>
  );
};

// Componente de Error Boundary
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error capturado por ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="text-center p-8">
            <h2 className="text-2xl font-bold text-red-600 mb-4">
              ¡Algo salió mal!
            </h2>
            <p className="text-gray-600 mb-4">
              Ha ocurrido un error inesperado en la aplicación.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Recargar página
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Componente de Ruta Protegida
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
}) => {
  // TODO: Implementar lógica de autenticación real
  // const { isAuthenticated, isLoading } = useAuth();

  // Mock de autenticación para desarrollo
  const isAuthenticated = true; // Cambiar por lógica real
  const isLoading = false;

  if (isLoading) {
    return <LoadingSpinner message="Verificando autenticación..." />;
  }

  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return <>{children}</>;
};

// Componente placeholder temporal para páginas en desarrollo
const PlaceholderPage: React.FC<PlaceholderPageProps> = ({
  title,
  description,
  icon,
  module,
  features,
}) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-green-500 rounded-full mb-6"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.3 }}
          >
            {icon}
          </motion.div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{title}</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {description}
          </p>
        </div>

        {/* Status */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
          <div className="flex items-center space-x-3">
            <Construction className="text-yellow-600" size={24} />
            <div>
              <h3 className="text-lg font-semibold text-yellow-800">
                Módulo en Desarrollo
              </h3>
              <p className="text-yellow-700">
                El módulo <strong>{module}</strong> está siendo desarrollado.
                Pronto estará disponible con todas sus funcionalidades.
              </p>
            </div>
          </div>
        </div>

        {/* Features Preview */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Características Planeadas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-700">{feature}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-8">
          <motion.button
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => (window.location.href = "/dashboard")}
          >
            Volver al Dashboard
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

// Páginas temporales con componentes placeholder
const DashboardPage = () => (
  <PlaceholderPage
    title="Panel Principal"
    description="Vista general del sistema de gestión ganadera"
    icon={<Home className="text-white" size={32} />}
    module="Dashboard"
    features={[
      "Resumen de ganado",
      "Estadísticas de salud",
      "Próximas vacunaciones",
      "Alertas importantes",
      "Métricas de producción",
      "Estado del rancho",
    ]}
  />
);

const BovinePage = () => (
  <PlaceholderPage
    title="Gestión de Ganado"
    description="Administra toda la información de tu ganado bovino"
    icon={<Beef className="text-white" size={32} />}
    module="Bovines"
    features={[
      "Registro de animales",
      "Historial médico",
      "Genealogía",
      "Seguimiento reproductivo",
      "Geolocalización",
      "Reportes individuales",
    ]}
  />
);

const HealthPage = () => (
  <PlaceholderPage
    title="Salud y Veterinaria"
    description="Control completo de la salud de tu ganado"
    icon={<Heart className="text-white" size={32} />}
    module="Health"
    features={[
      "Registro de vacunaciones",
      "Control de enfermedades",
      "Historial médico",
      "Calendario de tratamientos",
      "Alertas sanitarias",
      "Reportes veterinarios",
    ]}
  />
);

const MapsPage = () => (
  <PlaceholderPage
    title="Mapas y Geolocalización"
    description="Visualiza y gestiona las ubicaciones de tu ganado"
    icon={<Map className="text-white" size={32} />}
    module="Maps"
    features={[
      "Mapa interactivo",
      "Ubicaciones en tiempo real",
      "Zonas de pastoreo",
      "Rutas de vacunación",
      "Análisis geoespacial",
      "Alertas de ubicación",
    ]}
  />
);

const CalendarPage = () => (
  <PlaceholderPage
    title="Calendario y Eventos"
    description="Planifica y gestiona todas las actividades del rancho"
    icon={<Calendar className="text-white" size={32} />}
    module="Calendar"
    features={[
      "Calendario interactivo",
      "Programación de eventos",
      "Recordatorios automáticos",
      "Gestión de citas",
      "Planificación de tareas",
      "Sincronización móvil",
    ]}
  />
);

const ReportsPage = () => (
  <PlaceholderPage
    title="Reportes y Análisis"
    description="Análisis detallado y reportes personalizados"
    icon={<BarChart3 className="text-white" size={32} />}
    module="Reports"
    features={[
      "Reportes personalizados",
      "Análisis de tendencias",
      "Métricas de rendimiento",
      "Exportación de datos",
      "Dashboards interactivos",
      "Comparativas históricas",
    ]}
  />
);

const SettingsPage = () => (
  <PlaceholderPage
    title="Configuraciones"
    description="Ajustes y configuración del sistema"
    icon={<Settings className="text-white" size={32} />}
    module="Settings"
    features={[
      "Configuración de perfil",
      "Preferencias del sistema",
      "Gestión de usuarios",
      "Configuración de notificaciones",
      "Respaldo de datos",
      "Configuración de API",
    ]}
  />
);

// Páginas adicionales placeholder
const ProductionPage = () => (
  <PlaceholderPage
    title="Producción"
    description="Gestión y análisis de la producción ganadera"
    icon={<Tractor className="text-white" size={32} />}
    module="Production"
    features={[
      "Métricas de producción",
      "Control de calidad",
      "Análisis de rendimiento",
      "Planificación",
      "Optimización",
      "Reportes de producción",
    ]}
  />
);

const ReproductionPage = () => (
  <PlaceholderPage
    title="Reproducción"
    description="Gestión reproductiva y genética"
    icon={<Baby className="text-white" size={32} />}
    module="Reproduction"
    features={[
      "Control reproductivo",
      "Genealogía",
      "Planificación genética",
      "Seguimiento de preñez",
      "Registros de apareamiento",
      "Análisis genético",
    ]}
  />
);

const RanchPage = () => (
  <PlaceholderPage
    title="Gestión del Rancho"
    description="Administración integral del rancho"
    icon={<Users className="text-white" size={32} />}
    module="Ranch"
    features={[
      "Gestión de instalaciones",
      "Control de pastos",
      "Manejo de personal",
      "Mantenimiento",
      "Recursos del rancho",
      "Planificación de actividades",
    ]}
  />
);

const InventoryPage = () => (
  <PlaceholderPage
    title="Inventario"
    description="Control de suministros y equipos"
    icon={<Package className="text-white" size={32} />}
    module="Inventory"
    features={[
      "Control de medicamentos",
      "Gestión de suministros",
      "Inventario de equipos",
      "Alertas de stock",
      "Órdenes de compra",
      "Gestión de proveedores",
    ]}
  />
);

const FinancesPage = () => (
  <PlaceholderPage
    title="Finanzas"
    description="Gestión financiera y contable"
    icon={<DollarSign className="text-white" size={32} />}
    module="Finances"
    features={[
      "Control de gastos",
      "Análisis de ingresos",
      "Presupuestos",
      "Flujo de caja",
      "Reportes financieros",
      "Análisis de rentabilidad",
    ]}
  />
);

const EventsPage = () => (
  <PlaceholderPage
    title="Eventos"
    description="Gestión de eventos y actividades"
    icon={<Activity className="text-white" size={32} />}
    module="Events"
    features={[
      "Programación de eventos",
      "Seguimiento de actividades",
      "Notificaciones",
      "Gestión de participantes",
      "Historial de eventos",
      "Reportes de actividades",
    ]}
  />
);

// Página de autenticación simple
const AuthPage = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="max-w-md w-full space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">Iniciar Sesión</h2>
        <p className="mt-2 text-gray-600">
          Accede a tu sistema de gestión ganadera
        </p>
      </div>
      <div className="bg-white p-8 rounded-lg shadow-md">
        <p className="text-center text-gray-600">
          Módulo de autenticación en desarrollo...
        </p>
        <button
          onClick={() => (window.location.href = "/dashboard")}
          className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Continuar al Dashboard
        </button>
      </div>
    </div>
  </div>
);

// Página 404
const NotFoundPage = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-8">Página no encontrada</p>
      <button
        onClick={() => (window.location.href = "/dashboard")}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Volver al Dashboard
      </button>
    </div>
  </div>
);

// Componente principal de la aplicación
const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <Router>
        <div className="App">
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              {/* Rutas de autenticación (sin layout) */}
              <Route path="/auth/*" element={<AuthPage />} />

              {/* Rutas principales con layout */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }
              >
                {/* Redirect de la raíz al dashboard */}
                <Route index element={<Navigate to="/dashboard" replace />} />

                {/* Rutas principales */}
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="bovines/*" element={<BovinePage />} />
                <Route path="cattle/*" element={<BovinePage />} />
                <Route path="health/*" element={<HealthPage />} />
                <Route path="vaccinations/*" element={<HealthPage />} />
                <Route path="illnesses/*" element={<HealthPage />} />
                <Route path="maps/*" element={<MapsPage />} />
                <Route path="locations/*" element={<MapsPage />} />
                <Route path="calendar/*" element={<CalendarPage />} />
                <Route path="events/*" element={<EventsPage />} />
                <Route path="reports/*" element={<ReportsPage />} />
                <Route path="analytics/*" element={<ReportsPage />} />
                <Route path="production/*" element={<ProductionPage />} />
                <Route path="reproduction/*" element={<ReproductionPage />} />
                <Route path="breeding/*" element={<ReproductionPage />} />
                <Route path="ranch/*" element={<RanchPage />} />
                <Route path="facilities/*" element={<RanchPage />} />
                <Route path="inventory/*" element={<InventoryPage />} />
                <Route path="supplies/*" element={<InventoryPage />} />
                <Route path="finances/*" element={<FinancesPage />} />
                <Route path="financial/*" element={<FinancesPage />} />
                <Route path="settings/*" element={<SettingsPage />} />
                <Route path="config/*" element={<SettingsPage />} />
              </Route>

              {/* Catch all - 404 */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </div>
      </Router>
    </ErrorBoundary>
  );
};

export default App;
