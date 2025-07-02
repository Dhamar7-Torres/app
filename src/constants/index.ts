// Archivo de índice para exportar todas las constantes de la aplicación
// Este archivo centraliza las exportaciones para facilitar las importaciones

// Exportar todos los tipos y constantes relacionados con ganado bovino
export * from "./bovineTypes";

// Exportar toda la paleta de colores
export * from "./colors";

// Exportar constantes de navegación
export * from "./navigation";

// Exportar URLs y endpoints
export * from "./urls";

// Exportar tipos y constantes de vacunas
export * from "./vaccineTypes";

// Re-exportar tipos específicos para facilitar importaciones
export type {
  Bovine,
  Vaccination,
  Illness,
  BovineBreed,
  CommonSymptom,
} from "./bovineTypes";

// Re-exportar enums principales
export {
  BovineType,
  BovineGender,
  HealthStatus,
  IllnessSeverity,
} from "./bovineTypes";

// Re-exportar funciones helper de colores
export {
  getHealthStatusColor,
  getIllnessSeverityColor,
  getBovineTypeColor,
} from "./colors";

// Constantes globales de la aplicación
export const APP_CONFIG = {
  name: "BovineCare",
  version: "1.0.0",
  description: "Sistema de gestión y seguimiento de ganado bovino",
  author: "Cattle Management System",
  locale: "es-MX", // Español México
  timezone: "America/Mexico_City",
  currency: "MXN",
} as const;

// Configuraciones por defecto
export const DEFAULT_SETTINGS = {
  // Configuración del mapa
  map: {
    defaultZoom: 13,
    maxZoom: 18,
    minZoom: 5,
    tileLayer: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: "© OpenStreetMap contributors",
  },
  // Configuración de notificaciones
  notifications: {
    duration: 5000, // 5 segundos
    position: "top-right" as const,
    enableSound: true,
    enableVibration: true,
  },
  // Configuración de paginación
  pagination: {
    defaultPageSize: 20,
    pageSizeOptions: [10, 20, 50, 100],
  },
  // Configuración de fechas
  dateFormat: {
    display: "DD/MM/YYYY",
    displayWithTime: "DD/MM/YYYY HH:mm",
    api: "YYYY-MM-DD",
    apiWithTime: "YYYY-MM-DDTHH:mm:ss",
  },
  // Configuración de archivos
  files: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ["image/jpeg", "image/png", "image/webp", "application/pdf"],
    imageQuality: 0.8,
  },
  // Configuración de validaciones
  validation: {
    earTagMinLength: 3,
    earTagMaxLength: 20,
    nameMaxLength: 100,
    notesMaxLength: 500,
    minWeight: 10, // kg
    maxWeight: 2000, // kg
  },
} as const;

// Mensajes de error comunes
export const ERROR_MESSAGES = {
  // Errores de validación
  validation: {
    required: "Este campo es requerido",
    invalidEmail: "Correo electrónico inválido",
    invalidDate: "Fecha inválida",
    invalidEarTag: "Número de arete inválido",
    duplicateEarTag: "Este número de arete ya existe",
    invalidWeight: "Peso debe estar entre 10 y 2000 kg",
    futureDate: "La fecha no puede ser futura",
    pastDate: "La fecha no puede ser pasada",
  },
  // Errores de API
  api: {
    networkError: "Error de conexión. Verifica tu internet",
    serverError: "Error del servidor. Intenta más tarde",
    unauthorized: "No autorizado. Inicia sesión nuevamente",
    forbidden: "No tienes permisos para esta acción",
    notFound: "Recurso no encontrado",
    timeout: "Tiempo de espera agotado",
  },
  // Errores de geolocalización
  geolocation: {
    denied: "Permiso de ubicación denegado",
    unavailable: "Ubicación no disponible",
    timeout: "Tiempo de espera para obtener ubicación",
    unsupported: "Geolocalización no soportada",
  },
  // Errores de archivos
  files: {
    tooLarge: "Archivo muy grande. Máximo 5MB",
    invalidType: "Tipo de archivo no permitido",
    uploadFailed: "Error al subir archivo",
  },
} as const;

// Mensajes de éxito
export const SUCCESS_MESSAGES = {
  bovine: {
    created: "Animal registrado exitosamente",
    updated: "Animal actualizado exitosamente",
    deleted: "Animal eliminado exitosamente",
  },
  vaccination: {
    created: "Vacunación registrada exitosamente",
    updated: "Vacunación actualizada exitosamente",
    deleted: "Vacunación eliminada exitosamente",
  },
  illness: {
    created: "Enfermedad registrada exitosamente",
    updated: "Enfermedad actualizada exitosamente",
    deleted: "Enfermedad eliminada exitosamente",
    recovered: "Animal marcado como recuperado",
  },
  general: {
    saved: "Guardado exitosamente",
    updated: "Actualizado exitosamente",
    deleted: "Eliminado exitosamente",
    locationUpdated: "Ubicación actualizada",
  },
} as const;

// Formatos de fecha localizados
export const DATE_FORMATS = {
  short: "DD/MM/YY",
  medium: "DD/MM/YYYY",
  long: "DD [de] MMMM [de] YYYY",
  full: "dddd, DD [de] MMMM [de] YYYY",
  time: "HH:mm",
  dateTime: "DD/MM/YYYY HH:mm",
  relative: true, // Para mostrar "hace 2 días", etc.
} as const;

// Configuración de animaciones
export const ANIMATION_CONFIG = {
  // Duraciones estándar
  durations: {
    fast: 150,
    normal: 300,
    slow: 500,
    extraSlow: 1000,
  },
  // Curvas de animación
  easings: {
    easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
    easeOut: "cubic-bezier(0, 0, 0.2, 1)",
    easeIn: "cubic-bezier(0.4, 0, 1, 1)",
    bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
  },
  // Configuraciones específicas para elementos
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.3 },
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.2 },
  },
} as const;
