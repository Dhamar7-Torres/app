import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Tipos para el componente Dropdown
export interface DropdownItem {
  id: string;
  label: string;
  value: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  separator?: boolean;
}

export interface DropdownProps {
  // Elementos del dropdown
  items: DropdownItem[];
  // Valor seleccionado
  value?: string;
  // Placeholder cuando no hay selección
  placeholder?: string;
  // Callback cuando se selecciona un item
  onSelect?: (item: DropdownItem) => void;
  // Deshabilitado
  disabled?: boolean;
  // Ancho completo
  fullWidth?: boolean;
  // Tamaño del dropdown
  size?: "sm" | "default" | "lg";
  // Variante visual
  variant?: "default" | "outline" | "filled";
  // Clase CSS adicional
  className?: string;
  // Posición del dropdown
  position?: "bottom-left" | "bottom-right" | "top-left" | "top-right";
  // Texto de búsqueda
  searchable?: boolean;
  // Placeholder de búsqueda
  searchPlaceholder?: string;
  // Múltiple selección
  multiple?: boolean;
  // Valores seleccionados (para múltiple)
  selectedValues?: string[];
  // Callback para múltiple selección
  onSelectMultiple?: (values: string[]) => void;
  // Mostrar contador de seleccionados
  showCount?: boolean;
}

// Función para obtener clases CSS basadas en el tamaño
const getDropdownSizeClasses = (size: "sm" | "default" | "lg"): string => {
  const sizes = {
    sm: "h-8 px-2 text-sm",
    default: "h-10 px-3 text-sm",
    lg: "h-12 px-4 text-base",
  };
  return sizes[size];
};

// Función para obtener clases CSS basadas en la variante
const getDropdownVariantClasses = (
  variant: "default" | "outline" | "filled"
): string => {
  const variants = {
    default:
      "bg-white border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500",
    outline:
      "bg-transparent border-2 border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500",
    filled:
      "bg-gray-100 border border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500",
  };
  return variants[variant];
};

// Componente principal Dropdown
const Dropdown: React.FC<DropdownProps> = ({
  items,
  value,
  placeholder = "Seleccionar...",
  onSelect,
  disabled = false,
  fullWidth = false,
  size = "default",
  variant = "default",
  className = "",
  position = "bottom-left",
  searchable = false,
  searchPlaceholder = "Buscar...",
  multiple = false,
  selectedValues = [],
  onSelectMultiple,
  showCount = false,
}) => {
  // Estados del componente
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  // Referencias
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filtrar items basado en la búsqueda
  const filteredItems = items.filter(
    (item) =>
      item.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.value.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Obtener el item seleccionado
  const selectedItem = items.find((item) => item.value === value);

  // Cerrar dropdown cuando se hace click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Enfocar input de búsqueda cuando se abre
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, searchable]);

  // Manejar teclas del teclado
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          setHighlightedIndex((prev) =>
            prev < filteredItems.length - 1 ? prev + 1 : 0
          );
          break;
        case "ArrowUp":
          event.preventDefault();
          setHighlightedIndex((prev) =>
            prev > 0 ? prev - 1 : filteredItems.length - 1
          );
          break;
        case "Enter":
          event.preventDefault();
          if (highlightedIndex >= 0) {
            handleItemClick(filteredItems[highlightedIndex]);
          }
          break;
        case "Escape":
          setIsOpen(false);
          setSearchTerm("");
          setHighlightedIndex(-1);
          break;
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, highlightedIndex, filteredItems]);

  // Manejar click en un item
  const handleItemClick = (item: DropdownItem) => {
    if (item.disabled) return;

    if (multiple) {
      const newValues = selectedValues.includes(item.value)
        ? selectedValues.filter((v) => v !== item.value)
        : [...selectedValues, item.value];
      onSelectMultiple?.(newValues);
    } else {
      onSelect?.(item);
      setIsOpen(false);
      setSearchTerm("");
      setHighlightedIndex(-1);
    }
  };

  // Obtener texto del trigger
  const getTriggerText = () => {
    if (multiple) {
      if (selectedValues.length === 0) return placeholder;
      if (showCount) return `${selectedValues.length} seleccionado(s)`;
      return selectedValues.length === 1
        ? items.find((item) => item.value === selectedValues[0])?.label
        : `${selectedValues.length} elementos`;
    }
    return selectedItem?.label || placeholder;
  };

  // Obtener posición del dropdown
  const getPositionClasses = () => {
    const positions = {
      "bottom-left": "top-full left-0 mt-1",
      "bottom-right": "top-full right-0 mt-1",
      "top-left": "bottom-full left-0 mb-1",
      "top-right": "bottom-full right-0 mb-1",
    };
    return positions[position];
  };

  // Clases CSS combinadas
  const triggerClasses = `
    ${getDropdownSizeClasses(size)}
    ${getDropdownVariantClasses(variant)}
    ${fullWidth ? "w-full" : "min-w-[160px]"}
    ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
    rounded-md transition-all duration-200 focus:outline-none
    flex items-center justify-between
    ${className}
  `
    .trim()
    .replace(/\s+/g, " ");

  return (
    <div
      className={`relative ${fullWidth ? "w-full" : "inline-block"}`}
      ref={dropdownRef}
    >
      {/* Trigger del dropdown */}
      <motion.button
        type="button"
        className={triggerClasses}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        whileHover={!disabled ? { scale: 1.01 } : {}}
        whileTap={!disabled ? { scale: 0.99 } : {}}
      >
        <span className="truncate flex items-center gap-2">
          {selectedItem?.icon && <span>{selectedItem.icon}</span>}
          {getTriggerText()}
        </span>

        <motion.svg
          className="w-4 h-4 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </motion.svg>
      </motion.button>

      {/* Dropdown menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
            className={`
              absolute z-50 min-w-full bg-white border border-gray-200 rounded-md shadow-lg
              ${getPositionClasses()}
            `}
          >
            {/* Input de búsqueda */}
            {searchable && (
              <div className="p-2 border-b border-gray-100">
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}

            {/* Lista de items */}
            <div className="max-h-60 overflow-y-auto">
              {filteredItems.length === 0 ? (
                <div className="px-3 py-2 text-sm text-gray-500">
                  No se encontraron resultados
                </div>
              ) : (
                filteredItems.map((item, index) => (
                  <React.Fragment key={item.id}>
                    {item.separator && (
                      <div className="border-t border-gray-100 my-1" />
                    )}
                    <motion.button
                      type="button"
                      className={`
                        w-full px-3 py-2 text-left text-sm transition-colors duration-150
                        flex items-center gap-2
                        ${
                          item.disabled
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-gray-900 hover:bg-gray-100"
                        }
                        ${
                          index === highlightedIndex
                            ? "bg-blue-50 text-blue-600"
                            : ""
                        }
                        ${
                          multiple && selectedValues.includes(item.value)
                            ? "bg-blue-50 text-blue-600"
                            : ""
                        }
                        ${
                          !multiple && item.value === value
                            ? "bg-blue-50 text-blue-600"
                            : ""
                        }
                      `}
                      onClick={() => handleItemClick(item)}
                      disabled={item.disabled}
                      whileHover={
                        !item.disabled ? { backgroundColor: "#f3f4f6" } : {}
                      }
                    >
                      {/* Checkbox para múltiple selección */}
                      {multiple && (
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedValues.includes(item.value)}
                            onChange={() => {}} // Manejado por el click del button
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                        </div>
                      )}

                      {/* Icono del item */}
                      {item.icon && <span>{item.icon}</span>}

                      {/* Label del item */}
                      <span className="flex-1 truncate">{item.label}</span>

                      {/* Checkmark para selección única */}
                      {!multiple && item.value === value && (
                        <svg
                          className="w-4 h-4 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </motion.button>
                  </React.Fragment>
                ))
              )}
            </div>

            {/* Footer para múltiple selección */}
            {multiple && selectedValues.length > 0 && (
              <div className="px-3 py-2 border-t border-gray-100 bg-gray-50 text-xs text-gray-600">
                {selectedValues.length} elemento(s) seleccionado(s)
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Componente especializado para filtros de ganado
export interface CattleFilterDropdownProps {
  onFilterChange?: (filters: CattleFilters) => void;
  currentFilters?: CattleFilters;
}

export interface CattleFilters {
  healthStatus?: string[];
  animalType?: string[];
  location?: string[];
  dateRange?: string;
}

const CattleFilterDropdown: React.FC<CattleFilterDropdownProps> = ({
  onFilterChange,
  currentFilters = {},
}) => {
  // Items para estado de salud
  const healthStatusItems: DropdownItem[] = [
    { id: "healthy", label: "Saludable", value: "healthy", icon: "✅" },
    { id: "sick", label: "Enfermo", value: "sick", icon: "🤒" },
    { id: "vaccinated", label: "Vacunado", value: "vaccinated", icon: "💉" },
    {
      id: "under_treatment",
      label: "En Tratamiento",
      value: "under_treatment",
      icon: "🏥",
    },
  ];

  // Items para tipo de animal
  const animalTypeItems: DropdownItem[] = [
    { id: "cow", label: "Vaca", value: "cow", icon: "🐄" },
    { id: "bull", label: "Toro", value: "bull", icon: "🐂" },
  ];

  // Items para rango de fechas
  const dateRangeItems: DropdownItem[] = [
    { id: "today", label: "Hoy", value: "today" },
    { id: "week", label: "Esta semana", value: "week" },
    { id: "month", label: "Este mes", value: "month" },
    { id: "year", label: "Este año", value: "year" },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {/* Filtro por estado de salud */}
      <Dropdown
        items={healthStatusItems}
        placeholder="Estado de salud"
        multiple
        selectedValues={currentFilters.healthStatus || []}
        onSelectMultiple={(values) =>
          onFilterChange?.({ ...currentFilters, healthStatus: values })
        }
        searchable
        showCount
        size="sm"
      />

      {/* Filtro por tipo de animal */}
      <Dropdown
        items={animalTypeItems}
        placeholder="Tipo de animal"
        multiple
        selectedValues={currentFilters.animalType || []}
        onSelectMultiple={(values) =>
          onFilterChange?.({ ...currentFilters, animalType: values })
        }
        size="sm"
      />

      {/* Filtro por rango de fechas */}
      <Dropdown
        items={dateRangeItems}
        placeholder="Rango de fechas"
        value={currentFilters.dateRange}
        onSelect={(item) =>
          onFilterChange?.({ ...currentFilters, dateRange: item.value })
        }
        size="sm"
      />
    </div>
  );
};

Dropdown.displayName = "Dropdown";
CattleFilterDropdown.displayName = "CattleFilterDropdown";

export { Dropdown, CattleFilterDropdown };
