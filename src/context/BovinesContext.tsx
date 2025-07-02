import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";
import { useAuth } from "./AuthContext";

// Tipos para ubicación geográfica
interface Location {
  latitude: number;
  longitude: number;
  address?: string;
  zone?: string;
  farm?: string;
}

// Tipos para eventos médicos
interface MedicalEvent {
  id: string;
  bovineId: string;
  type:
    | "vaccination"
    | "illness"
    | "treatment"
    | "checkup"
    | "injury"
    | "birth"
    | "death";
  title: string;
  description: string;
  date: Date;
  location: Location;
  veterinarianId?: string;
  veterinarianName?: string;
  medications?: Medication[];
  diagnosis?: string;
  treatment?: string;
  nextAppointment?: Date;
  cost?: number;
  notes?: string;
  attachments?: string[];
  severity?: "low" | "medium" | "high" | "critical";
  status: "pending" | "in_progress" | "completed" | "cancelled";
}

// Tipos para medicamentos
interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  startDate: Date;
  endDate?: Date;
  administeredBy?: string;
  notes?: string;
}

// Tipos para vacunas
interface Vaccination {
  id: string;
  bovineId: string;
  vaccineName: string;
  vaccineType: string;
  dateAdministered: Date;
  nextDueDate?: Date;
  batchNumber?: string;
  veterinarianId: string;
  veterinarianName: string;
  location: Location;
  sideEffects?: string;
  notes?: string;
  status: "administered" | "due" | "overdue" | "scheduled";
}

// Tipos para bovinos
interface Bovine {
  id: string;
  farmId: string;
  tagNumber: string;
  name?: string;
  type: "cow" | "bull" | "calf";
  breed: string;
  gender: "male" | "female";
  birthDate: Date;
  weight?: number;
  height?: number;
  color: string;
  motherId?: string;
  fatherId?: string;
  currentLocation: Location;
  status: "healthy" | "sick" | "quarantine" | "pregnant" | "deceased" | "sold";
  medicalHistory: MedicalEvent[];
  vaccinations: Vaccination[];
  photos?: string[];
  qrCode?: string;
  rfidTag?: string;
  acquisitionDate: Date;
  acquisitionCost?: number;
  currentValue?: number;
  insurance?: {
    company: string;
    policyNumber: string;
    coverage: number;
    expiryDate: Date;
  };
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Estados del contexto de bovinos
interface BovinesState {
  bovines: Bovine[];
  selectedBovine: Bovine | null;
  medicalEvents: MedicalEvent[];
  vaccinations: Vaccination[];
  isLoading: boolean;
  error: string | null;
  filters: {
    status?: Bovine["status"];
    type?: Bovine["type"];
    breed?: string;
    location?: string;
    dateRange?: {
      start: Date;
      end: Date;
    };
  };
  sortBy: "tagNumber" | "name" | "birthDate" | "status" | "breed";
  sortOrder: "asc" | "desc";
  searchTerm: string;
}

// Acciones disponibles para el reducer
type BovinesAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_BOVINES"; payload: Bovine[] }
  | { type: "ADD_BOVINE"; payload: Bovine }
  | { type: "UPDATE_BOVINE"; payload: Bovine }
  | { type: "DELETE_BOVINE"; payload: string }
  | { type: "SELECT_BOVINE"; payload: Bovine | null }
  | { type: "SET_MEDICAL_EVENTS"; payload: MedicalEvent[] }
  | { type: "ADD_MEDICAL_EVENT"; payload: MedicalEvent }
  | { type: "UPDATE_MEDICAL_EVENT"; payload: MedicalEvent }
  | { type: "DELETE_MEDICAL_EVENT"; payload: string }
  | { type: "SET_VACCINATIONS"; payload: Vaccination[] }
  | { type: "ADD_VACCINATION"; payload: Vaccination }
  | { type: "UPDATE_VACCINATION"; payload: Vaccination }
  | { type: "SET_FILTERS"; payload: Partial<BovinesState["filters"]> }
  | {
      type: "SET_SORT";
      payload: {
        sortBy: BovinesState["sortBy"];
        sortOrder: BovinesState["sortOrder"];
      };
    }
  | { type: "SET_SEARCH_TERM"; payload: string }
  | { type: "CLEAR_FILTERS" };

// Estado inicial
const initialState: BovinesState = {
  bovines: [],
  selectedBovine: null,
  medicalEvents: [],
  vaccinations: [],
  isLoading: false,
  error: null,
  filters: {},
  sortBy: "tagNumber",
  sortOrder: "asc",
  searchTerm: "",
};

// Reducer para manejar las acciones
const bovinesReducer = (
  state: BovinesState,
  action: BovinesAction
): BovinesState => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };

    case "SET_ERROR":
      return { ...state, error: action.payload, isLoading: false };

    case "SET_BOVINES":
      return { ...state, bovines: action.payload, isLoading: false };

    case "ADD_BOVINE":
      return {
        ...state,
        bovines: [...state.bovines, action.payload],
        isLoading: false,
      };

    case "UPDATE_BOVINE":
      return {
        ...state,
        bovines: state.bovines.map((bovine) =>
          bovine.id === action.payload.id ? action.payload : bovine
        ),
        selectedBovine:
          state.selectedBovine?.id === action.payload.id
            ? action.payload
            : state.selectedBovine,
      };

    case "DELETE_BOVINE":
      return {
        ...state,
        bovines: state.bovines.filter((bovine) => bovine.id !== action.payload),
        selectedBovine:
          state.selectedBovine?.id === action.payload
            ? null
            : state.selectedBovine,
      };

    case "SELECT_BOVINE":
      return { ...state, selectedBovine: action.payload };

    case "SET_MEDICAL_EVENTS":
      return { ...state, medicalEvents: action.payload };

    case "ADD_MEDICAL_EVENT":
      return {
        ...state,
        medicalEvents: [...state.medicalEvents, action.payload],
        bovines: state.bovines.map((bovine) =>
          bovine.id === action.payload.bovineId
            ? {
                ...bovine,
                medicalHistory: [...bovine.medicalHistory, action.payload],
              }
            : bovine
        ),
      };

    case "UPDATE_MEDICAL_EVENT":
      return {
        ...state,
        medicalEvents: state.medicalEvents.map((event) =>
          event.id === action.payload.id ? action.payload : event
        ),
        bovines: state.bovines.map((bovine) =>
          bovine.id === action.payload.bovineId
            ? {
                ...bovine,
                medicalHistory: bovine.medicalHistory.map((event) =>
                  event.id === action.payload.id ? action.payload : event
                ),
              }
            : bovine
        ),
      };

    case "DELETE_MEDICAL_EVENT":
      return {
        ...state,
        medicalEvents: state.medicalEvents.filter(
          (event) => event.id !== action.payload
        ),
        bovines: state.bovines.map((bovine) => ({
          ...bovine,
          medicalHistory: bovine.medicalHistory.filter(
            (event) => event.id !== action.payload
          ),
        })),
      };

    case "SET_VACCINATIONS":
      return { ...state, vaccinations: action.payload };

    case "ADD_VACCINATION":
      return {
        ...state,
        vaccinations: [...state.vaccinations, action.payload],
        bovines: state.bovines.map((bovine) =>
          bovine.id === action.payload.bovineId
            ? {
                ...bovine,
                vaccinations: [...bovine.vaccinations, action.payload],
              }
            : bovine
        ),
      };

    case "UPDATE_VACCINATION":
      return {
        ...state,
        vaccinations: state.vaccinations.map((vaccination) =>
          vaccination.id === action.payload.id ? action.payload : vaccination
        ),
        bovines: state.bovines.map((bovine) =>
          bovine.id === action.payload.bovineId
            ? {
                ...bovine,
                vaccinations: bovine.vaccinations.map((vaccination) =>
                  vaccination.id === action.payload.id
                    ? action.payload
                    : vaccination
                ),
              }
            : bovine
        ),
      };

    case "SET_FILTERS":
      return { ...state, filters: { ...state.filters, ...action.payload } };

    case "SET_SORT":
      return {
        ...state,
        sortBy: action.payload.sortBy,
        sortOrder: action.payload.sortOrder,
      };

    case "SET_SEARCH_TERM":
      return { ...state, searchTerm: action.payload };

    case "CLEAR_FILTERS":
      return { ...state, filters: {}, searchTerm: "" };

    default:
      return state;
  }
};

// Contexto de bovinos
interface BovinesContextType {
  state: BovinesState;
  // Funciones para bovinos
  loadBovines: () => Promise<void>;
  createBovine: (
    bovineData: Omit<Bovine, "id" | "createdAt" | "updatedAt">
  ) => Promise<void>;
  updateBovine: (id: string, updates: Partial<Bovine>) => Promise<void>;
  deleteBovine: (id: string) => Promise<void>;
  selectBovine: (bovine: Bovine | null) => void;
  // Funciones para eventos médicos
  loadMedicalEvents: (bovineId?: string) => Promise<void>;
  createMedicalEvent: (eventData: Omit<MedicalEvent, "id">) => Promise<void>;
  updateMedicalEvent: (
    id: string,
    updates: Partial<MedicalEvent>
  ) => Promise<void>;
  deleteMedicalEvent: (id: string) => Promise<void>;
  // Funciones para vacunaciones
  loadVaccinations: (bovineId?: string) => Promise<void>;
  createVaccination: (
    vaccinationData: Omit<Vaccination, "id">
  ) => Promise<void>;
  updateVaccination: (
    id: string,
    updates: Partial<Vaccination>
  ) => Promise<void>;
  // Funciones de filtrado y búsqueda
  setFilters: (filters: Partial<BovinesState["filters"]>) => void;
  setSorting: (
    sortBy: BovinesState["sortBy"],
    sortOrder: BovinesState["sortOrder"]
  ) => void;
  setSearchTerm: (term: string) => void;
  clearFilters: () => void;
  getFilteredBovines: () => Bovine[];
  // Funciones de utilidad
  getBovineById: (id: string) => Bovine | undefined;
  getBovinesByStatus: (status: Bovine["status"]) => Bovine[];
  getUpcomingVaccinations: (days?: number) => Vaccination[];
  getRecentMedicalEvents: (days?: number) => MedicalEvent[];
  exportBovineData: (format: "csv" | "json") => Promise<string>;
}

const BovinesContext = createContext<BovinesContextType | undefined>(undefined);

// Configuración de la API
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3001/api";

// Provider del contexto de bovinos
interface BovinesProviderProps {
  children: ReactNode;
}

export const BovinesProvider: React.FC<BovinesProviderProps> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(bovinesReducer, initialState);
  const { state: authState } = useAuth();

  // Función para realizar peticiones API autenticadas
  const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      "Content-Type": "application/json",
      ...(authState.token && { Authorization: `Bearer ${authState.token}` }),
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error en la solicitud");
    }

    return response.json();
  };

  // Cargar bovinos
  const loadBovines = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const bovines = await apiRequest("/bovines");
      dispatch({ type: "SET_BOVINES", payload: bovines });
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload:
          error instanceof Error ? error.message : "Error al cargar bovinos",
      });
    }
  };

  // Crear bovino
  const createBovine = async (
    bovineData: Omit<Bovine, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const newBovine = await apiRequest("/bovines", {
        method: "POST",
        body: JSON.stringify(bovineData),
      });
      dispatch({ type: "ADD_BOVINE", payload: newBovine });
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload:
          error instanceof Error ? error.message : "Error al crear bovino",
      });
      throw error;
    }
  };

  // Actualizar bovino
  const updateBovine = async (id: string, updates: Partial<Bovine>) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const updatedBovine = await apiRequest(`/bovines/${id}`, {
        method: "PUT",
        body: JSON.stringify(updates),
      });
      dispatch({ type: "UPDATE_BOVINE", payload: updatedBovine });
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload:
          error instanceof Error ? error.message : "Error al actualizar bovino",
      });
      throw error;
    }
  };

  // Eliminar bovino
  const deleteBovine = async (id: string) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      await apiRequest(`/bovines/${id}`, { method: "DELETE" });
      dispatch({ type: "DELETE_BOVINE", payload: id });
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload:
          error instanceof Error ? error.message : "Error al eliminar bovino",
      });
      throw error;
    }
  };

  // Seleccionar bovino
  const selectBovine = (bovine: Bovine | null) => {
    dispatch({ type: "SELECT_BOVINE", payload: bovine });
  };

  // Cargar eventos médicos
  const loadMedicalEvents = async (bovineId?: string) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const endpoint = bovineId
        ? `/medical-events?bovineId=${bovineId}`
        : "/medical-events";
      const events = await apiRequest(endpoint);
      dispatch({ type: "SET_MEDICAL_EVENTS", payload: events });
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload:
          error instanceof Error
            ? error.message
            : "Error al cargar eventos médicos",
      });
    }
  };

  // Crear evento médico
  const createMedicalEvent = async (eventData: Omit<MedicalEvent, "id">) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const newEvent = await apiRequest("/medical-events", {
        method: "POST",
        body: JSON.stringify(eventData),
      });
      dispatch({ type: "ADD_MEDICAL_EVENT", payload: newEvent });
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload:
          error instanceof Error
            ? error.message
            : "Error al crear evento médico",
      });
      throw error;
    }
  };

  // Actualizar evento médico
  const updateMedicalEvent = async (
    id: string,
    updates: Partial<MedicalEvent>
  ) => {
    try {
      const updatedEvent = await apiRequest(`/medical-events/${id}`, {
        method: "PUT",
        body: JSON.stringify(updates),
      });
      dispatch({ type: "UPDATE_MEDICAL_EVENT", payload: updatedEvent });
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload:
          error instanceof Error
            ? error.message
            : "Error al actualizar evento médico",
      });
      throw error;
    }
  };

  // Eliminar evento médico
  const deleteMedicalEvent = async (id: string) => {
    try {
      await apiRequest(`/medical-events/${id}`, { method: "DELETE" });
      dispatch({ type: "DELETE_MEDICAL_EVENT", payload: id });
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload:
          error instanceof Error
            ? error.message
            : "Error al eliminar evento médico",
      });
      throw error;
    }
  };

  // Cargar vacunaciones
  const loadVaccinations = async (bovineId?: string) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const endpoint = bovineId
        ? `/vaccinations?bovineId=${bovineId}`
        : "/vaccinations";
      const vaccinations = await apiRequest(endpoint);
      dispatch({ type: "SET_VACCINATIONS", payload: vaccinations });
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload:
          error instanceof Error
            ? error.message
            : "Error al cargar vacunaciones",
      });
    }
  };

  // Crear vacunación
  const createVaccination = async (
    vaccinationData: Omit<Vaccination, "id">
  ) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const newVaccination = await apiRequest("/vaccinations", {
        method: "POST",
        body: JSON.stringify(vaccinationData),
      });
      dispatch({ type: "ADD_VACCINATION", payload: newVaccination });
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload:
          error instanceof Error ? error.message : "Error al crear vacunación",
      });
      throw error;
    }
  };

  // Actualizar vacunación
  const updateVaccination = async (
    id: string,
    updates: Partial<Vaccination>
  ) => {
    try {
      const updatedVaccination = await apiRequest(`/vaccinations/${id}`, {
        method: "PUT",
        body: JSON.stringify(updates),
      });
      dispatch({ type: "UPDATE_VACCINATION", payload: updatedVaccination });
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload:
          error instanceof Error
            ? error.message
            : "Error al actualizar vacunación",
      });
      throw error;
    }
  };

  // Funciones de filtrado y búsqueda
  const setFilters = (filters: Partial<BovinesState["filters"]>) => {
    dispatch({ type: "SET_FILTERS", payload: filters });
  };

  const setSorting = (
    sortBy: BovinesState["sortBy"],
    sortOrder: BovinesState["sortOrder"]
  ) => {
    dispatch({ type: "SET_SORT", payload: { sortBy, sortOrder } });
  };

  const setSearchTerm = (term: string) => {
    dispatch({ type: "SET_SEARCH_TERM", payload: term });
  };

  const clearFilters = () => {
    dispatch({ type: "CLEAR_FILTERS" });
  };

  // Obtener bovinos filtrados
  const getFilteredBovines = (): Bovine[] => {
    let filtered = [...state.bovines];

    // Aplicar filtros
    if (state.filters.status) {
      filtered = filtered.filter(
        (bovine) => bovine.status === state.filters.status
      );
    }
    if (state.filters.type) {
      filtered = filtered.filter(
        (bovine) => bovine.type === state.filters.type
      );
    }
    if (state.filters.breed) {
      filtered = filtered.filter((bovine) =>
        bovine.breed.toLowerCase().includes(state.filters.breed!.toLowerCase())
      );
    }

    // Aplicar búsqueda
    if (state.searchTerm) {
      const searchLower = state.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (bovine) =>
          bovine.tagNumber.toLowerCase().includes(searchLower) ||
          bovine.name?.toLowerCase().includes(searchLower) ||
          bovine.breed.toLowerCase().includes(searchLower)
      );
    }

    // Aplicar ordenamiento
    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (state.sortBy) {
        case "tagNumber":
          aValue = a.tagNumber;
          bValue = b.tagNumber;
          break;
        case "name":
          aValue = a.name || "";
          bValue = b.name || "";
          break;
        case "birthDate":
          aValue = a.birthDate;
          bValue = b.birthDate;
          break;
        case "status":
          aValue = a.status;
          bValue = b.status;
          break;
        case "breed":
          aValue = a.breed;
          bValue = b.breed;
          break;
        default:
          aValue = a.tagNumber;
          bValue = b.tagNumber;
      }

      if (aValue < bValue) return state.sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return state.sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  };

  // Funciones de utilidad
  const getBovineById = (id: string): Bovine | undefined => {
    return state.bovines.find((bovine) => bovine.id === id);
  };

  const getBovinesByStatus = (status: Bovine["status"]): Bovine[] => {
    return state.bovines.filter((bovine) => bovine.status === status);
  };

  const getUpcomingVaccinations = (days = 30): Vaccination[] => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() + days);

    return state.vaccinations.filter(
      (vaccination) =>
        vaccination.nextDueDate && vaccination.nextDueDate <= cutoffDate
    );
  };

  const getRecentMedicalEvents = (days = 7): MedicalEvent[] => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return state.medicalEvents.filter((event) => event.date >= cutoffDate);
  };

  const exportBovineData = async (format: "csv" | "json"): Promise<string> => {
    try {
      const response = await apiRequest(`/bovines/export?format=${format}`);
      return response.data;
    } catch (error) {
      throw new Error(`Error al exportar datos: ${error}`);
    }
  };

  // Cargar datos al inicializar
  useEffect(() => {
    if (authState.isAuthenticated) {
      loadBovines();
      loadMedicalEvents();
      loadVaccinations();
    }
  }, [authState.isAuthenticated]);

  // Valor del contexto
  const contextValue: BovinesContextType = {
    state,
    loadBovines,
    createBovine,
    updateBovine,
    deleteBovine,
    selectBovine,
    loadMedicalEvents,
    createMedicalEvent,
    updateMedicalEvent,
    deleteMedicalEvent,
    loadVaccinations,
    createVaccination,
    updateVaccination,
    setFilters,
    setSorting,
    setSearchTerm,
    clearFilters,
    getFilteredBovines,
    getBovineById,
    getBovinesByStatus,
    getUpcomingVaccinations,
    getRecentMedicalEvents,
    exportBovineData,
  };

  return (
    <BovinesContext.Provider value={contextValue}>
      {children}
    </BovinesContext.Provider>
  );
};

// Hook personalizado para usar el contexto de bovinos
export const useBovines = (): BovinesContextType => {
  const context = useContext(BovinesContext);
  if (!context) {
    throw new Error("useBovines must be used within a BovinesProvider");
  }
  return context;
};
