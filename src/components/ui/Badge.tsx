import React from "react";
import { motion } from "framer-motion";

// Tipos para las variantes del badge
type BadgeVariant =
  | "default"
  | "secondary"
  | "destructive"
  | "outline"
  | "success"
  | "warning"
  | "info";
type BadgeSize = "default" | "sm" | "lg";

// Función para obtener las clases CSS basadas en la variante
const getBadgeVariantClasses = (variant: BadgeVariant): string => {
  const variants = {
    default: "border-transparent bg-blue-500 text-white hover:bg-blue-600",
    secondary: "border-transparent bg-gray-500 text-white hover:bg-gray-600",
    destructive: "border-transparent bg-red-500 text-white hover:bg-red-600",
    outline: "text-gray-900 border-gray-300 bg-white hover:bg-gray-50",
    success: "border-transparent bg-green-500 text-white hover:bg-green-600",
    warning: "border-transparent bg-yellow-500 text-white hover:bg-yellow-600",
    info: "border-transparent bg-blue-500 text-white hover:bg-blue-600",
  };
  return variants[variant];
};

// Función para obtener las clases CSS basadas en el tamaño
const getBadgeSizeClasses = (size: BadgeSize): string => {
  const sizes = {
    default: "text-xs px-2.5 py-0.5",
    sm: "text-xs px-2 py-0.5",
    lg: "text-sm px-3 py-1",
  };
  return sizes[size];
};

// Interfaz para las props del componente Badge
export interface BadgeProps {
  // Variante del badge
  variant?: BadgeVariant;
  // Tamaño del badge
  size?: BadgeSize;
  // Prop para habilitar animaciones
  animate?: boolean;
  // Icono opcional a mostrar
  icon?: React.ReactNode;
  // Función callback para manejar clicks de remover
  onRemove?: () => void;
  // Contenido del badge
  children: React.ReactNode;
  // Clase CSS adicional
  className?: string;
  // Click handler
  onClick?: () => void;
}

// Componente Badge con animaciones y variantes
const Badge: React.FC<BadgeProps> = ({
  className = "",
  variant = "default",
  size = "default",
  animate = true,
  icon,
  onRemove,
  children,
  onClick,
}) => {
  // Configuración de animaciones con Framer Motion
  const animationProps = animate
    ? {
        initial: { opacity: 0, scale: 0.8 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.8 },
        whileHover: { scale: 1.05 },
        whileTap: { scale: 0.95 },
        transition: { duration: 0.2 },
      }
    : {};

  // Combinar clases CSS
  const badgeClasses = `inline-flex items-center rounded-full border font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${getBadgeVariantClasses(
    variant
  )} ${getBadgeSizeClasses(size)} ${className}`;

  const badgeContent = (
    <div className="flex items-center gap-1">
      {/* Icono opcional */}
      {icon && <span className="mr-1">{icon}</span>}
      {children}
      {/* Botón de remover si se proporciona onRemove */}
      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-1 hover:bg-black/20 rounded-full p-0.5 transition-colors"
          type="button"
        >
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );

  return (
    <motion.div className={badgeClasses} onClick={onClick} {...animationProps}>
      {badgeContent}
    </motion.div>
  );
};

Badge.displayName = "Badge";

export { Badge };
