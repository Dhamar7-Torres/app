import React from "react";
import { motion } from "framer-motion";

// Tipos para las variantes del botón
type ButtonVariant =
  | "default"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost"
  | "link"
  | "success"
  | "warning";
type ButtonSize = "default" | "sm" | "lg" | "icon";

// Función para obtener las clases CSS basadas en la variante
const getButtonVariantClasses = (variant: ButtonVariant): string => {
  const variants = {
    default: "bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500",
    destructive: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500",
    outline:
      "border border-gray-300 bg-white text-gray-900 hover:bg-gray-50 focus:ring-blue-500",
    secondary: "bg-gray-500 text-white hover:bg-gray-600 focus:ring-gray-500",
    ghost: "hover:bg-gray-100 text-gray-900 focus:ring-blue-500",
    link: "text-blue-500 underline-offset-4 hover:underline focus:ring-blue-500",
    success: "bg-green-500 text-white hover:bg-green-600 focus:ring-green-500",
    warning:
      "bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-500",
  };
  return variants[variant];
};

// Función para obtener las clases CSS basadas en el tamaño
const getButtonSizeClasses = (size: ButtonSize): string => {
  const sizes = {
    default: "h-10 px-4 py-2 text-sm",
    sm: "h-9 px-3 text-xs",
    lg: "h-11 px-8 text-base",
    icon: "h-10 w-10 p-0",
  };
  return sizes[size];
};

// Interfaz para las props del componente Button
export interface ButtonProps {
  // Variante del botón
  variant?: ButtonVariant;
  // Tamaño del botón
  size?: ButtonSize;
  // Prop para habilitar animaciones
  animate?: boolean;
  // Estado de carga
  loading?: boolean;
  // Botón deshabilitado
  disabled?: boolean;
  // Icono a mostrar (antes del texto)
  icon?: React.ReactNode;
  // Icono a mostrar después del texto
  rightIcon?: React.ReactNode;
  // Contenido del botón
  children?: React.ReactNode;
  // Clase CSS adicional
  className?: string;
  // Click handler
  onClick?: () => void;
  // Tipo de botón
  type?: "button" | "submit" | "reset";
  // Ancho completo
  fullWidth?: boolean;
}

// Componente de spinner para estado de carga
const LoadingSpinner: React.FC = () => (
  <motion.svg
    className="w-4 h-4 mr-2"
    animate={{ rotate: 360 }}
    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
      fill="none"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </motion.svg>
);

// Componente Button con animaciones y variantes
const Button: React.FC<ButtonProps> = ({
  className = "",
  variant = "default",
  size = "default",
  animate = true,
  loading = false,
  disabled = false,
  icon,
  rightIcon,
  children,
  onClick,
  type = "button",
  fullWidth = false,
}) => {
  // Configuración de animaciones con Framer Motion
  const animationProps = animate
    ? {
        whileHover: disabled || loading ? {} : { scale: 1.02 },
        whileTap: disabled || loading ? {} : { scale: 0.98 },
        transition: { duration: 0.2 },
      }
    : {};

  // Combinar clases CSS
  const buttonClasses = `
    inline-flex items-center justify-center rounded-md font-medium transition-colors 
    focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none 
    disabled:opacity-50
    ${getButtonVariantClasses(variant)} 
    ${getButtonSizeClasses(size)} 
    ${fullWidth ? "w-full" : ""}
    ${className}
  `
    .trim()
    .replace(/\s+/g, " ");

  const handleClick = () => {
    if (!disabled && !loading && onClick) {
      onClick();
    }
  };

  return (
    <motion.button
      type={type}
      className={buttonClasses}
      onClick={handleClick}
      disabled={disabled || loading}
      {...animationProps}
    >
      {/* Contenido del botón */}
      {loading && <LoadingSpinner />}
      {!loading && icon && <span className="mr-2">{icon}</span>}
      {children}
      {!loading && rightIcon && <span className="ml-2">{rightIcon}</span>}
    </motion.button>
  );
};

Button.displayName = "Button";

export { Button };
