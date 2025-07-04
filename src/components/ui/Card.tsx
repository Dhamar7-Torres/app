import React from "react";
import { motion } from "framer-motion";

// Tipos para las variantes de la tarjeta
type CardVariant = "default" | "elevated" | "outlined" | "filled" | "gradient";
type CardSize = "sm" | "default" | "lg" | "xl";

// Función para obtener las clases CSS basadas en la variante
const getCardVariantClasses = (variant: CardVariant): string => {
  const variants = {
    default: "bg-white border border-gray-200 shadow-sm",
    elevated: "bg-white shadow-lg border-0",
    outlined: "bg-white border-2 border-gray-300 shadow-none",
    filled: "bg-gray-50 border border-gray-100 shadow-sm",
    gradient:
      "bg-gradient-to-br from-blue-50 to-white border border-blue-100 shadow-sm",
  };
  return variants[variant];
};

// Función para obtener las clases CSS basadas en el tamaño
const getCardSizeClasses = (size: CardSize): string => {
  const sizes = {
    sm: "p-3",
    default: "p-4",
    lg: "p-6",
    xl: "p-8",
  };
  return sizes[size];
};

// Interfaz para las props del componente Card principal
export interface CardProps {
  // Variante de la tarjeta
  variant?: CardVariant;
  // Tamaño de la tarjeta
  size?: CardSize;
  // Prop para habilitar animaciones
  animate?: boolean;
  // Prop para hacer la tarjeta clickeable
  clickable?: boolean;
  // Prop para habilitar hover effect
  hoverable?: boolean;
  // Contenido de la tarjeta
  children: React.ReactNode;
  // Clase CSS adicional
  className?: string;
  // Click handler
  onClick?: () => void;
  // Ancho completo
  fullWidth?: boolean;
}

// Componente Card principal
const Card: React.FC<CardProps> = ({
  className = "",
  variant = "default",
  size = "default",
  animate = true,
  clickable = false,
  hoverable = true,
  children,
  onClick,
  fullWidth = false,
}) => {
  // Configuración de animaciones con Framer Motion
  const animationProps = animate
    ? {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
        whileHover: hoverable ? { y: -2, transition: { duration: 0.2 } } : {},
        whileTap: clickable ? { scale: 0.98 } : {},
        transition: { duration: 0.3 },
      }
    : {};

  // Combinar clases CSS
  const cardClasses = `
    rounded-lg transition-all duration-300 
    ${getCardVariantClasses(variant)} 
    ${getCardSizeClasses(size)}
    ${clickable ? "cursor-pointer" : ""}
    ${fullWidth ? "w-full" : ""}
    ${className}
  `
    .trim()
    .replace(/\s+/g, " ");

  return (
    <motion.div
      className={cardClasses}
      onClick={clickable ? onClick : undefined}
      {...animationProps}
    >
      {children}
    </motion.div>
  );
};

// Interfaz para CardHeader
export interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
  // Mostrar línea divisoria
  divider?: boolean;
}

// Componente CardHeader
const CardHeader: React.FC<CardHeaderProps> = ({
  children,
  className = "",
  divider = false,
}) => {
  return (
    <div
      className={`mb-4 ${
        divider ? "pb-4 border-b border-gray-200" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
};

// Interfaz para CardTitle
export interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
  // Tamaño del título
  size?: "sm" | "default" | "lg";
  // Icono opcional
  icon?: React.ReactNode;
}

// Componente CardTitle
const CardTitle: React.FC<CardTitleProps> = ({
  children,
  className = "",
  size = "default",
  icon,
}) => {
  const sizeClasses = {
    sm: "text-lg",
    default: "text-xl",
    lg: "text-2xl",
  };

  return (
    <h3
      className={`font-semibold text-gray-900 flex items-center gap-2 ${sizeClasses[size]} ${className}`}
    >
      {icon && <span>{icon}</span>}
      {children}
    </h3>
  );
};

// Interfaz para CardDescription
export interface CardDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

// Componente CardDescription
const CardDescription: React.FC<CardDescriptionProps> = ({
  children,
  className = "",
}) => {
  return (
    <p className={`text-gray-600 text-sm mt-1 ${className}`}>{children}</p>
  );
};

// Interfaz para CardContent
export interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

// Componente CardContent
const CardContent: React.FC<CardContentProps> = ({
  children,
  className = "",
}) => {
  return <div className={`${className}`}>{children}</div>;
};

// Interfaz para CardFooter
export interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
  // Mostrar línea divisoria arriba
  divider?: boolean;
  // Alinear contenido
  align?: "left" | "center" | "right" | "between";
}

// Componente CardFooter
const CardFooter: React.FC<CardFooterProps> = ({
  children,
  className = "",
  divider = false,
  align = "left",
}) => {
  const alignClasses = {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end",
    between: "justify-between",
  };

  return (
    <div
      className={`
      mt-4 flex items-center gap-2 
      ${divider ? "pt-4 border-t border-gray-200" : ""} 
      ${alignClasses[align]} 
      ${className}
    `}
    >
      {children}
    </div>
  );
};

// Componente especializado para información de ganado
export interface CattleCardProps {
  // ID del animal
  id: string;
  // Nombre del animal
  name: string;
  // Tipo de animal
  type: "cow" | "bull";
  // Estado de salud
  healthStatus: "healthy" | "sick" | "vaccinated" | "under_treatment";
  // Fecha de último evento
  lastEvent?: Date;
  // Ubicación
  location?: string;
  // Imagen del animal
  image?: string;
  // Callback para ver detalles
  onViewDetails?: () => void;
  // Callback para editar
  onEdit?: () => void;
}

// Componente CattleCard especializado
const CattleCard: React.FC<CattleCardProps> = ({
  id,
  name,
  type,
  healthStatus,
  lastEvent,
  location,
  image,
  onViewDetails,
  onEdit,
}) => {
  // Función para obtener el color según el estado de salud
  const getHealthStatusColor = (status: string) => {
    const colors = {
      healthy: "text-green-600 bg-green-100",
      sick: "text-red-600 bg-red-100",
      vaccinated: "text-blue-600 bg-blue-100",
      under_treatment: "text-yellow-600 bg-yellow-100",
    };
    return colors[status as keyof typeof colors] || "text-gray-600 bg-gray-100";
  };

  // Función para obtener el texto del estado
  const getHealthStatusText = (status: string) => {
    const texts = {
      healthy: "Saludable",
      sick: "Enfermo",
      vaccinated: "Vacunado",
      under_treatment: "En Tratamiento",
    };
    return texts[status as keyof typeof texts] || "Desconocido";
  };

  // Función para obtener el icono del tipo de animal
  const getAnimalIcon = (animalType: string) => {
    return animalType === "cow" ? "🐄" : "🐂";
  };

  return (
    <Card variant="elevated" clickable hoverable onClick={onViewDetails}>
      <CardHeader divider>
        <CardTitle size="default" icon={getAnimalIcon(type)}>
          {name}
        </CardTitle>
        <CardDescription>
          ID: {id} • {type === "cow" ? "Vaca" : "Toro"}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {/* Imagen del animal */}
        {image && (
          <div className="mb-4 w-full h-32 bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Estado de salud */}
        <div className="mb-3">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getHealthStatusColor(
              healthStatus
            )}`}
          >
            {getHealthStatusText(healthStatus)}
          </span>
        </div>

        {/* Información adicional */}
        <div className="space-y-2 text-sm text-gray-600">
          {location && (
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span>{location}</span>
            </div>
          )}

          {lastEvent && (
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>
                Último evento: {lastEvent.toLocaleDateString("es-ES")}
              </span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter divider align="between">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails?.();
          }}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          Ver detalles
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit?.();
          }}
          className="text-gray-600 hover:text-gray-800 text-sm font-medium"
        >
          Editar
        </button>
      </CardFooter>
    </Card>
  );
};

// Exportar todos los componentes
Card.displayName = "Card";
CardHeader.displayName = "CardHeader";
CardTitle.displayName = "CardTitle";
CardDescription.displayName = "CardDescription";
CardContent.displayName = "CardContent";
CardFooter.displayName = "CardFooter";
CattleCard.displayName = "CattleCard";

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CattleCard,
};
