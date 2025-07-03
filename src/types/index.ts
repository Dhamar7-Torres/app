// Archivo de índice para exportar todos los tipos de la aplicación

// Exportar tipos de autenticación
export type {
  User,
  UserProfile,
  AuthContext,
  AuthCredentials,
  RegisterData,
  UserPreferences,
  FarmInfo,
  SubscriptionInfo,
} from "./auth";

export { UserRole, FarmType, SubscriptionStatus } from "./auth";

// Exportar tipos comunes básicos
export type {
  BaseEntity,
  ApiResponse,
  ApiError,
  PaginatedResult,
  Coordinates,
  Address,
  ContactInfo,
  FileAttachment,
  Notification,
  Comment,
  SystemActivity,
  SystemAlert,
} from "./common";

export {
  SortOrder,
  NotificationType,
  NotificationPriority,
  ActivityAction,
  AlertType,
  AlertSeverity,
} from "./common";

// Exportar tipos de ganado bovino
export type {
  BovineExtended,
  BovineGenealogy,
  ReproductiveInfo,
  NutritionInfo,
  PhysicalTraits,
  EconomicInfo,
  BovineFilters,
  BovineSearchResult,
  BovineGroupStats,
} from "./bovine";

export {
  ReproductiveStatus,
  WeightMeasurementMethod,
  ExpenseCategory,
} from "./bovine";

// Exportar tipos financieros
export type {
  FinancialTransaction,
  VendorInfo,
  CustomerInfo,
  Budget,
  CashFlow,
  Asset,
  Liability,
  FinancialReport,
  ProfitabilityAnalysis,
} from "./finance";

export {
  TransactionType,
  TransactionCategory,
  PaymentMethod,
  BudgetStatus,
} from "./finance";

// Exportar tipos de salud
export type {
  MedicalRecord,
  RoutineExamination,
  VitalSigns,
  LaboratoryResult,
  DiseaseOutbreak,
  AnimalHealthHistory,
} from "./health";

export {
  MedicalRecordType,
  BodySystem,
  TreatmentType,
  LabTestCategory,
} from "./health";

// Exportar tipos de producción
export type {
  ProductionRecord,
  ProductionMetrics,
  GrowthMetrics,
} from "./production";

export {
  ProductionType,
  QualityGrade,
  MilkingTime,
  HousingType,
} from "./production";

// Configuración de la aplicación
export interface AppConfig {
  name: string;
  version: string;
  environment: "development" | "staging" | "production";
  apiUrl: string;
  features: FeatureFlags;
}

export interface FeatureFlags {
  advancedAnalytics: boolean;
  mobileApp: boolean;
  exportFeatures: boolean;
  integrationsEnabled: boolean;
  aiInsights: boolean;
  realTimeTracking: boolean;
  multiLanguage: boolean;
  customReports: boolean;
}

// Contexto principal de la aplicación
export interface AppContextType {
  config: AppConfig;
  language: "es" | "en";
  isLoading: boolean;
  error: string | null;
  setLanguage: (lang: "es" | "en") => void;
  clearError: () => void;
}

// Tipos básicos para componentes UI
export interface ButtonProps {
  variant?: "primary" | "secondary" | "success" | "warning" | "error";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  isDisabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export interface InputProps {
  type?: "text" | "email" | "password" | "number";
  placeholder?: string;
  value?: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  isInvalid?: boolean;
  error?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: "sm" | "md" | "lg" | "xl";
  children: React.ReactNode;
  className?: string;
}

// Tipos para mapas básicos
export interface AppCoordinates {
  latitude: number;
  longitude: number;
  altitude?: number;
  accuracy?: number;
}

export interface MapMarker {
  id: string;
  position: AppCoordinates;
  title?: string;
  description?: string;
  color?: string;
}

export interface MapProps {
  center?: AppCoordinates;
  zoom?: number;
  markers?: MapMarker[];
  onMapClick?: (coordinates: AppCoordinates) => void;
  onMarkerClick?: (marker: MapMarker) => void;
  className?: string;
}

// Funciones helper básicas
export const createEmptyResponse = <T>(data?: T): AppApiResponse<T> => ({
  success: true,
  data,
  metadata: {
    timestamp: new Date(),
    requestId: Math.random().toString(36).substring(7),
  },
});

// Definir ApiResponse localmente para evitar conflictos
export interface AppApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: AppApiError;
  metadata?: {
    timestamp: Date;
    requestId: string;
  };
}

export interface AppApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

// Tipos para React
export type ComponentWithChildren<P = {}> = React.FC<
  P & { children: React.ReactNode }
>;

// Metadatos de la aplicación
export const APP_METADATA = {
  name: "BovineCare",
  version: "1.0.0",
  description: "Sistema integral de gestión ganadera",
  author: "BovineCare Team",
  defaultLanguage: "es",
  defaultCurrency: "MXN",
  defaultTimezone: "America/Mexico_City",
} as const;
