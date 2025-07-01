import { useContext } from "react";
import { BovinesContext } from "../context/BovinesContext";

// Hook para acceder fácilmente a datos de ganado
export const useBovines = () => {
  const context = useContext(BovinesContext);
  if (!context) {
    throw new Error("useBovines must be used within a BovinesProvider");
  }
  return context;
};
