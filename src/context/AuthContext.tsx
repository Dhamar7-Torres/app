import { createContext, useState, ReactNode } from "react";
import { User } from "../types";

interface AuthContextProps {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

// Crear contexto
export const AuthContext = createContext<AuthContextProps | null>(null);

// Proveedor
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (newUser: User) => setUser(newUser);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
