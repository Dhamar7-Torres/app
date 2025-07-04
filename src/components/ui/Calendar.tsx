import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Tipos para el componente Calendar
type CalendarMode = "single" | "multiple" | "range";

export interface CalendarProps {
  // Modo de selección del calendario
  mode?: CalendarMode;
  // Fecha seleccionada (para modo single)
  selected?: Date;
  // Fechas seleccionadas (para modo multiple)
  selectedDates?: Date[];
  // Rango de fechas seleccionado (para modo range)
  selectedRange?: { from: Date; to: Date };
  // Callback cuando se selecciona una fecha
  onSelect?: (date: Date) => void;
  // Callback cuando se seleccionan múltiples fechas
  onSelectMultiple?: (dates: Date[]) => void;
  // Callback cuando se selecciona un rango
  onSelectRange?: (range: { from: Date; to: Date }) => void;
  // Fechas deshabilitadas
  disabled?: Date[];
  // Fecha mínima seleccionable
  minDate?: Date;
  // Fecha máxima seleccionable
  maxDate?: Date;
  // Clase CSS adicional
  className?: string;
  // Mostrar días de semanas adyacentes
  showOutsideDays?: boolean;
}

// Utilidades para manejo de fechas
const formatDate = (date: Date): string => {
  return date.toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
};

const isDateInRange = (
  date: Date,
  range: { from: Date; to: Date }
): boolean => {
  return date >= range.from && date <= range.to;
};

// Componente Calendar
const Calendar: React.FC<CalendarProps> = ({
  mode = "single",
  selected,
  selectedDates = [],
  selectedRange,
  onSelect,
  onSelectMultiple,
  onSelectRange,
  disabled = [],
  minDate,
  maxDate,
  className = "",
  showOutsideDays = true,
}) => {
  // Estado para el mes y año actual mostrado
  const [currentDate, setCurrentDate] = useState(new Date());
  // Estado para animaciones de transición
  const [isTransitioning, setIsTransitioning] = useState(false);
  // Estado para el rango temporal (mientras se selecciona)
  const [tempRange, setTempRange] = useState<{ from: Date; to?: Date } | null>(
    null
  );

  // Obtener el primer día del mes actual
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );
  const lastDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  );

  // Calcular días para mostrar en el calendario
  const getDaysInMonth = () => {
    const days: Date[] = [];
    const startDate = new Date(firstDayOfMonth);

    // Añadir días del mes anterior si showOutsideDays es true
    if (showOutsideDays) {
      const startDay = startDate.getDay();
      for (let i = startDay - 1; i >= 0; i--) {
        const prevDate = new Date(startDate);
        prevDate.setDate(prevDate.getDate() - i - 1);
        days.push(prevDate);
      }
    }

    // Añadir días del mes actual
    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      days.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));
    }

    // Añadir días del mes siguiente para completar la grilla
    if (showOutsideDays) {
      const remainingDays = 42 - days.length; // 6 semanas * 7 días
      for (let i = 1; i <= remainingDays; i++) {
        const nextDate = new Date(lastDayOfMonth);
        nextDate.setDate(nextDate.getDate() + i);
        days.push(nextDate);
      }
    }

    return days;
  };

  // Navegar al mes anterior
  const goToPreviousMonth = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentDate(
        new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
      );
      setIsTransitioning(false);
    }, 150);
  };

  // Navegar al mes siguiente
  const goToNextMonth = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentDate(
        new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
      );
      setIsTransitioning(false);
    }, 150);
  };

  // Verificar si una fecha está deshabilitada
  const isDateDisabled = (date: Date): boolean => {
    // Verificar si está en la lista de fechas deshabilitadas
    if (disabled.some((disabledDate) => isSameDay(date, disabledDate))) {
      return true;
    }

    // Verificar fecha mínima
    if (minDate && date < minDate) {
      return true;
    }

    // Verificar fecha máxima
    if (maxDate && date > maxDate) {
      return true;
    }

    return false;
  };

  // Verificar si una fecha está seleccionada
  const isDateSelected = (date: Date): boolean => {
    if (mode === "single" && selected) {
      return isSameDay(date, selected);
    }

    if (mode === "multiple") {
      return selectedDates.some((selectedDate) =>
        isSameDay(date, selectedDate)
      );
    }

    if (mode === "range" && selectedRange) {
      return isDateInRange(date, selectedRange);
    }

    return false;
  };

  // Manejar click en una fecha
  const handleDateClick = (date: Date) => {
    if (isDateDisabled(date)) return;

    if (mode === "single") {
      onSelect?.(date);
    } else if (mode === "multiple") {
      const newSelectedDates = selectedDates.some((selectedDate) =>
        isSameDay(date, selectedDate)
      )
        ? selectedDates.filter((selectedDate) => !isSameDay(date, selectedDate))
        : [...selectedDates, date];
      onSelectMultiple?.(newSelectedDates);
    } else if (mode === "range") {
      if (!tempRange) {
        setTempRange({ from: date });
      } else if (!tempRange.to) {
        const range =
          tempRange.from <= date
            ? { from: tempRange.from, to: date }
            : { from: date, to: tempRange.from };
        onSelectRange?.(range);
        setTempRange(null);
      } else {
        setTempRange({ from: date });
      }
    }
  };

  // Obtener clase CSS para un día específico
  const getDayClasses = (date: Date): string => {
    const baseClasses =
      "w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium transition-colors cursor-pointer";
    const isCurrentMonth = date.getMonth() === currentDate.getMonth();
    const isToday = isSameDay(date, new Date());
    const isSelected = isDateSelected(date);
    const isDisabled = isDateDisabled(date);

    let classes = baseClasses;

    if (isDisabled) {
      classes += " text-gray-300 cursor-not-allowed";
    } else if (isSelected) {
      classes += " bg-blue-500 text-white";
    } else if (isToday) {
      classes += " bg-blue-100 text-blue-600 font-bold";
    } else if (isCurrentMonth) {
      classes += " text-gray-900 hover:bg-gray-100";
    } else {
      classes += " text-gray-400 hover:bg-gray-50";
    }

    return classes;
  };

  const days = getDaysInMonth();
  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];
  const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

  return (
    <div className={`bg-white rounded-lg shadow-lg p-4 ${className}`}>
      {/* Header del calendario */}
      <div className="flex items-center justify-between mb-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={goToPreviousMonth}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </motion.button>

        <motion.h2
          className="text-lg font-semibold text-gray-900"
          key={`${currentDate.getMonth()}-${currentDate.getFullYear()}`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </motion.h2>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={goToNextMonth}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </motion.button>
      </div>

      {/* Días de la semana */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-gray-500 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Grilla de días */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${currentDate.getMonth()}-${currentDate.getFullYear()}`}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-7 gap-1"
        >
          {days.map((date, index) => (
            <motion.button
              key={`${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.01, duration: 0.2 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleDateClick(date)}
              className={getDayClasses(date)}
            >
              {date.getDate()}
            </motion.button>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Información de fecha seleccionada */}
      {selected && mode === "single" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 bg-blue-50 rounded-lg"
        >
          <p className="text-sm text-blue-600 font-medium">
            Fecha seleccionada: {formatDate(selected)}
          </p>
        </motion.div>
      )}
    </div>
  );
};

Calendar.displayName = "Calendar";

export { Calendar };
