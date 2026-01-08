import { AuthProvider } from "./Context/AuthContext";
import { PortfolioProvider } from "./Context/PortfolioContext";
import { AlertProvider } from "./Context/AlertContext";
import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "./components/Toaster";

export default function App() {
  return (
    <AuthProvider>
      <PortfolioProvider>
        <AlertProvider>
          <AppRoutes />
          <Toaster />
        </AlertProvider>
      </PortfolioProvider>
    </AuthProvider>
  );
}