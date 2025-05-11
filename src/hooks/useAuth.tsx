import {
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext,
  ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";

interface User {
  id: string;
  username: string;
  roles: "ADMIN" | "USER";
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (userData: User) => void;
  logout: () => void;
  withAuth: <P extends object>(
    WrappedComponent: React.ComponentType<P>
  ) => React.FC<P>;
  withAdminAuth: <P extends object>(
    WrappedComponent: React.ComponentType<P>
  ) => React.FC<P>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Error al leer el usuario del localStorage:", error);
      setUser(null);
      localStorage.removeItem("user");
    }
  }, []);

  const isAuthenticated = !!user;
  const isAdmin = isAuthenticated && user?.roles === "ADMIN";

  const login = useCallback((userData: User) => {
    try {
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      // Optionally navigate after login, e.g., to a dashboard
      // navigate("/dashboard");
    } catch (error) {
      console.error("Error al guardar el usuario en localStorage:", error);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  }, [navigate]);

  const withAuth = <P extends object>(
    WrappedComponent: React.ComponentType<P>
  ): React.FC<P> => {
    const ComponentWithAuth: React.FC<P> = (props) => {
      useEffect(() => {
        if (!isAuthenticated) {
          navigate("/");
        }
      }, [isAuthenticated, navigate]);

      if (!isAuthenticated) {
        return null;
      }
      return <WrappedComponent {...props} />;
    };
    return ComponentWithAuth;
  };

  const withAdminAuth = <P extends object>(
    WrappedComponent: React.ComponentType<P>
  ): React.FC<P> => {
    const ComponentWithAdminAuth: React.FC<P> = (props) => {
      useEffect(() => {
        if (!isAuthenticated) {
          navigate("/");
        } else if (!isAdmin) {
          navigate("/");
        }
      }, [isAuthenticated, isAdmin, navigate]);

      if (!isAuthenticated || !isAdmin) {
        return null;
      }
      return <WrappedComponent {...props} />;
    };
    return ComponentWithAdminAuth;
  };

  const contextValue = {
    user,
    isAuthenticated,
    isAdmin,
    login,
    logout,
    withAuth,
    withAdminAuth,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default useAuth;
