import "./App.css";
import AppRoutes from "./routes/AppRoutes";
import { ThemeProvider } from "./theme/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <div>
      <ThemeProvider defaultTheme="system" storageKey="ui-theme">
        <Toaster position="bottom-right" richColors />
        <AppRoutes />
      </ThemeProvider>
    </div>
  );
}

export default App;
